import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv"
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: { tests: "tests" },
  networks: {
    sepolia: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `${process.env.RPC_ENDPOINT_URL}`,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: `${process.env.ETHERSCAN_API_KEY}`,
    },
  },
    };

export default config;
