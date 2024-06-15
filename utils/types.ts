import type { Address } from "viem";

export interface IMarket {
  id: string;
  uniqueKey: Address;
  lltv: string;
  oracleAddress: Address;
  irmAddress: Address;
  collateralPrice: string;
  loanAsset: {
    address: Address;
    symbol: string;
    decimals: number;
  };
  collateralAsset: {
    address: Address;
    symbol: string;
    decimals: number;
  };
  state: {
    borrowShares: string;
    borrowAssets: string;
    supplyShares: string;
    supplyAssets: string;
    fee: number;
    timestamp: number;
    utilization: number;
  };
}

export interface IMarketMapping {
  [key: Address]: IMarket;
}

export interface IPosition {
  id: string;
  borrowShares: string;
  borrowAssets: number;
  collateral: number;
  healthFactor: number;
  user: {
    address: Address;
  };
}

export interface ISwap1inch {
  dstAmount: string;
  tx: {
    from: Address;
    to: Address;
    data: Address;
    value: string;
    gas: number;
    gasPrice: string;
  };
}
