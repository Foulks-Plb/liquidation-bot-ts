import {
  createPublicClient,
  http,
  type Address,
} from "viem";
import { mainnet } from "viem/chains";

export const GRAPH_URL = "https://blue-api.morpho.org/graphql";
export const MORPHO_BLUE_ADDRESS: Address = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb";
export const BOT_ADDRESS: Address = "0x725314746e727f586E9FCA65AeD5dBe45aA71B99";
export const WETH_ADDRESS: Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});