import type { Address } from "viem";
import { createMarketsMapping, getMarkets } from "./utils/markets";

const marketsAddress: Address[] = [
  "0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115",
];

// Initialize the markets mapping and set in cache
const GetMarkets = await getMarkets(marketsAddress);
let markets = createMarketsMapping(GetMarkets);

console.log(markets);
