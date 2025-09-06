# FocusStake Smart Contract

This project implements the FocusStake smart contract, designed to operate on the BlockDAG network. Below are the details for setting up, deploying, and testing the contract.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js & npm
- MetaMask

## Project Structure
```
focus-stake-contract
├── contracts
│   └── FocusStake.sol        # Smart contract code
├── scripts
│   └── deploy.ts             # Deployment script
├── test
│   └── FocusStake.test.ts    # Test cases for the contract
├── .env                       # Environment variables
├── .gitignore                 # Git ignore file
├── hardhat.config.ts          # Hardhat configuration
├── package.json               # npm configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                  # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd focus-stake-contract
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Deployment
To deploy the FocusStake contract to the BlockDAG network, follow these steps:

1. Ensure your `.env` file is configured with the correct RPC URL and private key.
2. Compile the contract:
   ```
   npx hardhat compile
   ```

3. Deploy the contract:
   ```
   npx hardhat run scripts/deploy.ts --network blockdag_testnet
   ```

Upon successful deployment, you will receive the contract address.

## Testing
To run the tests for the FocusStake contract, execute the following command:
```
npx hardhat test
```

This will run all test cases defined in `FocusStake.test.ts`.

## Environment Variables
The `.env` file should contain the following variables:
```
BLOCKDAG_TESTNET_RPC_URL="<YOUR_RPC_URL>"
PRIVATE_KEY="<YOUR_PRIVATE_KEY>"
```
Ensure this file is kept secure and not shared publicly.