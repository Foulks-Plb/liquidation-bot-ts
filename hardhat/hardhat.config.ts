import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
      accounts: [{privateKey: process.env.PRIVATE_KEY as string, balance: "1000000000000000000000000"}],
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/jlkyqc70l2lraiPggraHYwHjxCpUntpw",
      }
    }
  },
};

export default config;
