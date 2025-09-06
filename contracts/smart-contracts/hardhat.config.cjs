require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const config = {
  solidity: "0.8.0",
  networks: {
    blockdag_testnet: {
      url: process.env.BLOCKDAG_TESTNET_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

module.exports = config;