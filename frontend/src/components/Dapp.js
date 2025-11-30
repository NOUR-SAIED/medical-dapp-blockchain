import React from "react";
import { ethers } from "ethers";
import PatientAccessArtifact from "../contracts/PatientAccess.json";
import contractAddress from "../contracts/contract-address.json";

// --- Components (Keep these simple or import them if you have them) ---
const ConnectWallet = ({ connectWallet }) => (
  <div className="container text-center mt-5">
    <div className="card p-5 shadow">
      <h2>🏥 Medical Blockchain System</h2>
      <p>Please connect your wallet to access the system.</p>
      <button className="btn btn-warning btn-lg" onClick={connectWallet}>
        Connect MetaMask
      </button>
    </div>
  </div>
);

export class Dapp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Wallet State
      selectedAddress: undefined,
      networkError: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
      
      // Data State
      patientName: "",
      medicalData: "",
      doctorAddress: "",
      viewPatientAddress: "",
      viewedPatientData: "",
      isRegistered: false,
      
      // UI State
      activeTab: "patient", // 'patient' or 'doctor'
    };
  }

  render() {
    if (!this.state.selectedAddress) {
      return <ConnectWallet connectWallet={() => this._connectWallet()} />;
    }

    return (
      <div className="container-fluid p-0">
        {/* Navbar / Role Switcher */}
        <nav className="navbar navbar-dark bg-dark p-3">
          <span className="navbar-brand mb-0 h1">🏥 MedChain Demo</span>
          <div className="d-flex align-items-center">
             <span className="text-light me-3 small">Wallet: {this.state.selectedAddress.substring(0,6)}...</span>
          </div>
        </nav>

        {/* ROLE TABS */}
        <div className="d-flex justify-content-center bg-light border-bottom">
          <button 
            className={`btn p-3 px-5 rounded-0 ${this.state.activeTab === 'patient' ? 'btn-primary' : 'btn-light text-muted'}`}
            onClick={() => this.setState({ activeTab: 'patient', transactionError: undefined })}
          >
            👤 I am a Patient
          </button>
          <button 
            className={`btn p-3 px-5 rounded-0 ${this.state.activeTab === 'doctor' ? 'btn-success' : 'btn-light text-muted'}`}
            onClick={() => this.setState({ activeTab: 'doctor', transactionError: undefined })}
          >
            👨‍⚕️ I am a Doctor
          </button>
        </div>

        <div className="container mt-4">
          
          {/* Status Messages */}
          {this.state.txBeingSent && (
            <div className="alert alert-warning">⏳ Transaction pending... ({this.state.txBeingSent.substring(0,10)}...)</div>
          )}
          {this.state.transactionError && (
            <div className="alert alert-danger">❌ Error: {this.state.transactionError.message || "Transaction Failed"}</div>
          )}

          {/* PATIENT VIEW */}
          {this.state.activeTab === 'patient' && (
            <div className="card shadow-sm border-primary">
              <div className="card-header bg-primary text-white">
                <h4>Patient Portal</h4>
              </div>
              <div className="card-body">
                
                {/* Registration Section */}
                {!this.state.isRegistered ? (
                  <div className="mb-4">
                    <h5>1. Create Your Medical Record</h5>
                    <div className="mb-2">
                      <input type="text" className="form-control mb-2" placeholder="Full Name" 
                        onChange={(e) => this.setState({ patientName: e.target.value })} />
                      <textarea className="form-control mb-2" placeholder="Medical History (e.g. Blood Type O, Allergic to Penicillin)" 
                        onChange={(e) => this.setState({ medicalData: e.target.value })} />
                      <button className="btn btn-primary w-100" onClick={() => this._registerPatient()}>
                        Register on Blockchain
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-success">
                    ✅ You are registered as <strong>{this.state.patientName}</strong>
                  </div>
                )}

                <hr />

                {/* Authorization Section */}
                <div className={!this.state.isRegistered ? "opacity-50" : ""}>
                  <h5>2. Authorize a Doctor</h5>
                  <p className="text-muted small">Give a doctor permission to view your private data.</p>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Doctor's Wallet Address (0x...)" 
                       value={this.state.doctorAddress}
                       onChange={(e) => this.setState({ doctorAddress: e.target.value })}
                    />
                    <button className="btn btn-outline-primary" onClick={() => this._authorizeDoctor()} disabled={!this.state.isRegistered}>
                      Grant Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCTOR VIEW */}
          {this.state.activeTab === 'doctor' && (
            <div className="card shadow-sm border-success">
              <div className="card-header bg-success text-white">
                <h4>Doctor Portal</h4>
              </div>
              <div className="card-body">
                <h5>🔎 Search Patient Records</h5>
                <p className="text-muted small">You can only view data if the patient has authorized your address.</p>
                
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Patient's Wallet Address (0x...)" 
                    onChange={(e) => this.setState({ viewPatientAddress: e.target.value })}
                  />
                  <button className="btn btn-success" onClick={() => this._viewPatientData()}>
                    Fetch Records
                  </button>
                </div>

                {this.state.viewedPatientData && (
                  <div className="mt-4 p-4 bg-light border rounded">
                    <h6>📄 Patient Record Found:</h6>
                    <p className="lead text-dark">{this.state.viewedPatientData}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // --- LOGIC (Same as before) ---
  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this._initialize(selectedAddress);
    window.ethereum.on("accountsChanged", ([newAddress]) => this._initialize(newAddress));
  }

  _initialize(userAddress) {
    this.setState({ selectedAddress: userAddress, transactionError: undefined, viewedPatientData: "" });
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._patientAccess = new ethers.Contract(contractAddress.PatientAccess, PatientAccessArtifact.abi, this._provider.getSigner(0));
    this.setState({ isRegistered: false }); // Simplified for demo
  }

  async _registerPatient() {
    await this._execute(() => this._patientAccess.registerPatient(this.state.patientName, this.state.medicalData));
    this.setState({ isRegistered: true });
  }

  async _authorizeDoctor() {
    await this._execute(() => this._patientAccess.authorizeDoctor(this.state.doctorAddress));
    alert("Doctor Authorized Successfully!");
  }

  async _viewPatientData() {
    try {
      this.setState({ transactionError: undefined, viewedPatientData: "" });
      const data = await this._patientAccess.viewPatientData(this.state.viewPatientAddress);
      this.setState({ viewedPatientData: data });
    } catch (error) {
      console.error(error);
      this.setState({ viewedPatientData: "⛔ ACCESS DENIED: You are not authorized to view this patient." });
    }
  }

  async _execute(action) {
    try {
      this.setState({ transactionError: undefined });
      const tx = await action();
      this.setState({ txBeingSent: tx.hash });
      await tx.wait();
    } catch (error) {
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }
}