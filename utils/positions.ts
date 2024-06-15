import type { Address } from "viem";
import { GRAPH_URL } from "./config";
import type { IMarket, IPosition } from "./types";
import { checkPositionAndLiquidate } from "./liquidate";

export const verifyPositions = async (market: IMarket) => {
  const positions = await getPositions(market.uniqueKey);
  positions.forEach(async (position: IPosition, i: number) => {
    // FOR TESTING (avoid spamming call)
    if (i > 0) {
      return;
    }

    checkPositionAndLiquidate(position, market);
  });
};

const getPositions = async (uniqueKeys: Address): Promise<IPosition[]> => {
  const query = {
    operationName: "getMarketPositions",
    variables: {
      where: {
        marketUniqueKey_in: [uniqueKeys],
        chainId_in: [1],
        borrowShares_gte: 1,
        collateral_gte: 1,
        healthFactor_lte: 1,
      },
      orderBy: "BorrowShares",
      orderDirection: "Desc",
      first: 100,
      skip: 0,
    },
    query: `
            query getMarketPositions($where: MarketPositionFilters, $orderBy: MarketPositionOrderBy, $orderDirection: OrderDirection, $first: Int, $skip: Int) {
                marketPositions(first: $first skip: $skip where: $where orderBy: $orderBy orderDirection: $orderDirection) {
                    items {
                        id
                        borrowShares
                        borrowAssets
                        borrowAssetsUsd
                        collateral
                        healthFactor
                        user {
                            address
                        }
                    }
                }
            }`,
  };

  let res: any;
  try {
    const response = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    res = await response.json();
  } catch (error) {
    console.error("Error fetching markets data:", error);
  }

  return res ? res.data.marketPositions.items : [];
};
