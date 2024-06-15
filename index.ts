import type { Address } from "viem";
import {
  compareAndReturnLastUpdate,
  createMarketsMapping,
  getMarkets,
} from "./utils/markets";
import { watchBlocks } from "./utils/events";
import type { IMarket } from "./utils/types";
import { verifyPositions } from "./utils/positions";

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
  console.log("GET MARKETS", _getMarkets)
  _getMarkets.forEach((market: IMarket) => {
    const uniqueKey = market.uniqueKey;
    if (!markets[uniqueKey]) {
      markets[uniqueKey] = market;
      verifyPositions(market);
    } else {
      const _newMarket = compareAndReturnLastUpdate(markets[uniqueKey], market);
      if (_newMarket) {
        markets[uniqueKey] = _newMarket;
        verifyPositions(_newMarket);
      }
    }
  });
});
