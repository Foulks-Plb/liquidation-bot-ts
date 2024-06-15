import type { Address } from "viem";
import { GRAPH_URL } from "./config";
import type { IMarket, IMarketMapping } from "./types";

export const getMarkets = async (markets: Address[]): Promise<IMarket[]> => {
  const marketsArray = JSON.stringify(markets);
  const query = `{
      markets(where: {uniqueKey_in: ${marketsArray}}) {
        items {
          id
          uniqueKey
          lltv
          oracleAddress
          irmAddress
          collateralPrice
          loanAsset {
            address
            symbol
            decimals
          }
          collateralAsset {
            address
            symbol
            decimals
          }
          state {
            borrowShares
            borrowAssets
            supplyShares
            supplyAssets
            fee
            timestamp
            utilization
          }
        }
      }
    }`;

  let res: any;
  try {
    const response = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    res = await response.json();

    if (res.errors) {
      console.error(res.errors[0].message);
    }
  } catch (error) {
    console.error("Error fetching markets data:", error);
  }

  return res ? res.data.markets.items : [];
};

export const getMarket = async (uniqueKey: Address): Promise<IMarket> => {
  console.log("uniqueKey: ", uniqueKey);
  const query = `{
      markets(where: {uniqueKey_in: "${uniqueKey}"}) {
        items {
          id
          uniqueKey
          lltv
          oracleAddress
          irmAddress
          collateralPrice
          loanAsset {
            address
            symbol
            decimals
          }
          collateralAsset {
            address
            symbol
            decimals
          }
          state {
            borrowShares
            borrowAssets
            supplyShares
            supplyAssets
            fee
            timestamp
            utilization
          }
        }
      }
    }`;

  let res: any;
  try {
    const response = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    res = await response.json();

    if (res.errors) {
      console.error(res.errors[0].message);
    }
  } catch (error) {
    console.error("Error fetching markets data:", error);
  }
  return res ? res.data.markets.items[0] : null;
};

export const createMarketsMapping = (markets: IMarket[]): IMarketMapping => {
  const marketsMapping = markets.reduce(
    (acc: IMarketMapping, market: IMarket) => {
      acc[market.uniqueKey] = market;
      return acc;
    },
    {}
  );

  return marketsMapping;
};

export const compareAndReturnLastUpdate = (
  oldMarket: IMarket,
  newMarket: IMarket
): IMarket | null => {
  if (oldMarket.state.timestamp < newMarket.state.timestamp) {
    return newMarket;
  }
  return null;
};
