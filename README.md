# Medical Record DApp (Blockchain)

A decentralized application for managing patient medical records and doctor authorizations. This project allows patients to own their data and grant specific access to doctors using the Ethereum blockchain.

**Note:** This project is built on top of the [Hardhat Boilerplate](https://github.com/NomicFoundation/hardhat-boilerplate) by Nomic Foundation, adapted for medical transaction logic.

## 🚀 Quick Start Guide

Follow these steps exactly to run the project locally.

### 1. Install Dependencies
You need to install packages for both the backend (Hardhat) and the frontend (React).

```bash
# 1. Install root dependencies
npm install

# 2. Install frontend dependencies
cd frontend
npm install
cd ..
2. Start the Local Blockchain
Open a terminal and run:
code
Bash
npx hardhat node
🛑 Keep this terminal running at all times! It gives you 20 test accounts with 10,000 ETH.
3. Deploy the Smart Contract
Open a second terminal and run this command to deploy your contract to the local network:
code
Bash
npx hardhat run scripts/deploy.js --network localhost
Important: This script automatically creates the contract-address.json file in your frontend folder. If you restart the Node, you must run this deploy command again.
4. Setup MetaMask
Open your browser and click the MetaMask extension.
Switch the network to Localhost 8545.
Import Account #0 (Patient) and Account #1 (Doctor) using the private keys displayed in your first terminal.
5. Start the Frontend
In your second terminal, run:
code
Bash
cd frontend
npm start
The app should open at http://localhost:3000.
👨‍⚕️ How to Use the DApp (Demo Flow)
Since this works locally, you need to simulate two users:
Patient Role (Account 1):
Connect Wallet (Account 1).
Enter Name & Medical Data -> Click Register.
Copy the Doctor's Address (Account 2) and paste it into the authorization box.
Click Authorize Doctor.
Doctor Role (Account 2):
Switch MetaMask to Account 2 (or use a second browser).
Refresh the page.
Paste the Patient's Address (Account 1) into the search box.
Click Fetch Records.
🔧 Troubleshooting
Error: "Calling an account which is not a contract"
This means your frontend is trying to talk to an old contract address.
Fix:
Run npx hardhat run scripts/deploy.js --network localhost.
Reset MetaMask (Settings > Advanced > Clear Activity Tab Data).
Refresh the page.
Error: "Nonce too high"
This means MetaMask is out of sync with your local blockchain.
Fix: Go to MetaMask Settings > Advanced > Clear Activity Tab Data.
code
Code
### Step 2: Push the Changes to GitHub

Run these commands in your terminal to update the README on your online repo:

```bash
git add README.md
git commit -m "Update README with credits and run instructions"
git push
