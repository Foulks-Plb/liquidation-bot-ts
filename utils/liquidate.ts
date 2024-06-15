import type { IMarket, IPosition } from "./types";

const WAD = BigInt(1e18);
const VIRTUAL_ASSETS = BigInt(1e6);
const VIRTUAL_SHARES = BigInt(1);
const LIQUIDATION_CURSOR = BigInt(0.3 * 10 ** 18);
const MAX_LIQUIDATION_INCENTIVE_FACTOR = BigInt(1.15e18);
const ORACLE_PRICE_SCALE = BigInt(1e36);

export const checkPositionAndLiquidate = async (
  position: IPosition,
  market: IMarket
) => {
  const liquidationIncentiveFactor = _min(
    MAX_LIQUIDATION_INCENTIVE_FACTOR,
    _wDivDown(
      WAD,
      WAD - _wMulDown(LIQUIDATION_CURSOR, WAD - BigInt(market.lltv))
    )
  );


  // liquidate
};

function toAssetsDown(
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint {
  const totalAssetsWithVirtual = totalAssets + VIRTUAL_ASSETS;
  const totalSharesWithVirtual = totalShares + VIRTUAL_SHARES;

  return _mulDivDown(shares, totalAssetsWithVirtual, totalSharesWithVirtual);
}

function _mulDivDown(x: bigint, y: bigint, d: bigint): bigint {
  const xy = x * y;

  return xy / d;
}

function _mulDivUp(x: bigint, y: bigint, d: bigint): bigint {
  const xy = x * y;

  const add = xy + d - BigInt(1);

  return add / d;
}

function _wMulDown(a: bigint, b: bigint): bigint {
  return (a * b) / WAD;
}

function _wDivDown(a: bigint, b: bigint): bigint {
  return (a * WAD) / b;
}

function _min(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}
