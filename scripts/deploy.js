const { ethers, artifacts } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  // 1. Tell Hardhat specifically to look for "PatientAccess"
  const PatientAccess = await ethers.getContractFactory("PatientAccess");
  
  // 2. Deploy it
  console.log("Deploying PatientAccess...");
  const patientAccess = await PatientAccess.deploy();
  await patientAccess.deployed();

  console.log("✅ PatientAccess deployed to:", patientAccess.address);

  // 3. Save the address to the frontend
  saveFrontendFiles(patientAccess);
}

function saveFrontendFiles(contract) {
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save Address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ PatientAccess: contract.address }, undefined, 2)
  );

  // Save ABI (The Instructions)
  const Artifact = artifacts.readArtifactSync("PatientAccess");

  fs.writeFileSync(
    path.join(contractsDir, "PatientAccess.json"),
    JSON.stringify(Artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });