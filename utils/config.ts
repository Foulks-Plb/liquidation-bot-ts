import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat, mainnet } from "viem/chains";

export const GRAPH_URL = "https://blue-api.morpho.org/graphql";
export const MORPHO_BLUE_ADDRESS: Address = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb";
export const BOT_ADDRESS: Address = "0x716473Fb4E7cD49c7d1eC7ec6d7490A03d9dA332";
export const WETH_ADDRESS: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export const account = privateKeyToAccount(process.env.PRIVATE_KEY as Address);

export const walletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
  account,
});