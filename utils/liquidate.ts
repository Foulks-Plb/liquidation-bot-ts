import { getSwap } from "./1inch";
import { account } from "./config";
import type { IMarket, IPosition, ISwap1inch } from "./types";

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

  const a = toAssetsDown(
    BigInt(position.borrowShares),
    BigInt(market.state.borrowAssets),
    BigInt(market.state.borrowShares)
  );
  const b = _wMulDown(a, liquidationIncentiveFactor);

  let seizedAssets = _mulDivDown(
    b,
    BigInt(market.collateralPrice),
    ORACLE_PRICE_SCALE
  );
  seizedAssets = seizedAssets - seizedAssets / 10n;

  let swap = await getSwap(
    market.collateralAsset.address,
    market.loanAsset.address,
    seizedAssets,
    account.address
  );

  // TODO: verify also the profit int ETH compate to tx cost
  if (!swap || BigInt(swap?.dstAmount || 0) <= 0) {
    console.log("Swap not profitable");
    return;
  }

  try {
    await _liquidate(swap, market, position, seizedAssets);
  } catch (error) {
    console.error(error);
  }
};

const _liquidate = async (
  swap: ISwap1inch,
  market: IMarket,
  position: IPosition,
  seizedAssets: bigint
) => {
  console.log("Execute liquidation");

  // const { request } = await publicClient.simulateContract({
  //   account,
  //   address: BOT_ADDRESS,
  //   abi: BOTMORPHO,
  //   functionName: "morphoLiquidate",
  //   args: [
  //     market.uniqueKey,
  //     position.user.address,
  //     seizedAssets, // carefull underflow or overflow
  //     swap.tx.to,
  //     swap.tx.data,
  //   ],
  // });
  // await walletClient.writeContract(request);
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
