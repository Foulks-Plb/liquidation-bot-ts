import type { Address } from "viem";
import { createMarketsMapping, getMarkets } from "./utils/markets";
import { watchBlocks } from "./utils/events";
import type { IMarket } from "./utils/types";

const marketsAddress: Address[] = [
  "0x698fe98247a40c5771537b5786b2f3f9d78eb487b4ce4d75533cd0e94d88a115",
];

// Initialize the markets mapping and set in cache
const GetMarkets = await getMarkets(marketsAddress);
let markets = createMarketsMapping(GetMarkets);

// WAIT BLOCKS
// Update all markets and if new or update => verify positions
watchBlocks(async () => {
    const _getMarkets = await getMarkets(marketsAddress);
    _getMarkets.forEach((market: IMarket) => {
      const uniqueKey = market.uniqueKey;
      if (!markets[uniqueKey]) {
        // if market not exists, add it
        console.log("New market added", market);
      }
    });
  });
