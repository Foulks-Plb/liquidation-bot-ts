export const LIQUIDATION_CURSOR = BigInt(0.3 * 10 ** 18);
export const MAX_LIQUIDATION_INCENTIVE_FACTOR = BigInt(1.15e18);
export const pow10 = (exponant: bigint | number) => 10n ** BigInt(exponant);
export const ORACLE_PRICE_SCALE = pow10(36);
export const WAD = pow10(18);
export const VIRTUAL_ASSETS = 1n;
export const VIRTUAL_SHARES = 10n ** 6n;

export const wMulDown = (x: bigint, y: bigint): bigint => mulDivDown(x, y, WAD);
export const wDivDown = (x: bigint, y: bigint): bigint => mulDivDown(x, WAD, y);
export const wDivUp = (x: bigint, y: bigint): bigint => mulDivUp(x, WAD, y);
export const mulDivDown = (x: bigint, y: bigint, d: bigint): bigint =>
  (x * y) / d;
export const mulDivUp = (x: bigint, y: bigint, d: bigint): bigint =>
  (x * y + (d - 1n)) / d;

/// @dev Calculates the value of `shares` quoted in assets, rounding down.
const toSharesDown = (
  assets: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint => {
  return mulDivDown(
    assets,
    totalShares + VIRTUAL_SHARES,
    totalAssets + VIRTUAL_ASSETS
  );
};

/// @dev Calculates the value of `shares` quoted in assets, rounding up.
const toAssetsUp = (
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint => {
  return mulDivUp(
    shares,
    totalAssets + VIRTUAL_ASSETS,
    totalShares + VIRTUAL_SHARES
  );
};

/// @dev Calculates the value of `shares` quoted in assets, rounding down.
export const toAssetsDown = (
  shares: bigint,
  totalAssets: bigint,
  totalShares: bigint
): bigint => {
  const totalAssetsWithVirtual = totalAssets + VIRTUAL_ASSETS;
  const totalSharesWithVirtual = totalShares + VIRTUAL_SHARES;

  return mulDivDown(shares, totalAssetsWithVirtual, totalSharesWithVirtual);
};

export const min = (a: bigint, b: bigint): bigint => {
  return a < b ? a : b;
};
