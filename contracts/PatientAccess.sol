// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract PatientAccess {
    // Structure to hold patient details
    struct Patient {
        string name;
        string medicalData;
        bool isRegistered;
    }

    // Mapping: Patient Address => Patient Details
    mapping(address => Patient) private patients;
    
    // Mapping: Patient Address => (Doctor Address => Is Authorized)
    mapping(address => mapping(address => bool)) private doctorAccess;

    // Events to help track what happens on-chain
    event PatientRegistered(address indexed patient, string name);
    event DoctorAuthorized(address indexed patient, address indexed doctor);
    event DoctorRevoked(address indexed patient, address indexed doctor);

    // 1. Register a new patient
    function registerPatient(string memory _name, string memory _data) external {
        patients[msg.sender] = Patient(_name, _data, true);
        emit PatientRegistered(msg.sender, _name);
    }

    // 2. Authorize a doctor to view your records
    function authorizeDoctor(address _doctor) external {
        require(patients[msg.sender].isRegistered, "You are not registered");
        doctorAccess[msg.sender][_doctor] = true;
        emit DoctorAuthorized(msg.sender, _doctor);
    }

    // 3. Revoke a doctor's access
    function revokeDoctor(address _doctor) external {
        require(patients[msg.sender].isRegistered, "You are not registered");
        doctorAccess[msg.sender][_doctor] = false;
        emit DoctorRevoked(msg.sender, _doctor);
    }

    // 4. View data (Only works if you are the patient OR an authorized doctor)
    function viewPatientData(address _patient) external view returns (string memory) {
        bool isPatient = (msg.sender == _patient);
        bool isAuthorizedDoctor = doctorAccess[_patient][msg.sender];

        require(isPatient || isAuthorizedDoctor, "Access Denied: You are not authorized");
        require(patients[_patient].isRegistered, "Patient does not exist");

        return patients[_patient].medicalData;
    }
}