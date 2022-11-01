import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv';
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const { GOERLI_RPC_URL, WALLET_SECRET_KEY } = process.env;
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [`${WALLET_SECRET_KEY}`],
    },
  },
};

export default config;
