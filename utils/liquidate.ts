import { BOTMORPHO } from "../abi/BotMorpho";
import { getQuote, getSwap } from "./1inch";
import { BOT_ADDRESS, account, publicClient, walletClient } from "./config";
import type { IMarket, IPosition, ISwap1inch } from "./types";
import {
  LIQUIDATION_CURSOR,
  MAX_LIQUIDATION_INCENTIVE_FACTOR,
  ORACLE_PRICE_SCALE,
  WAD,
  min,
  mulDivDown,
  toAssetsDown,
  wDivDown,
  wMulDown,
} from "./utils";

export const checkPositionAndLiquidate = async (
  position: IPosition,
  market: IMarket
) => {
  const liquidationIncentiveFactor = min(
    MAX_LIQUIDATION_INCENTIVE_FACTOR,
    wDivDown(WAD, WAD - wMulDown(LIQUIDATION_CURSOR, WAD - BigInt(market.lltv)))
  );

  const a = toAssetsDown(
    BigInt(position.borrowShares),
    BigInt(market.state.borrowAssets),
    BigInt(market.state.borrowShares)
  );
  const b = wMulDown(a, liquidationIncentiveFactor);

  let seizedAssets = mulDivDown(
    b,
    ORACLE_PRICE_SCALE,
    BigInt(market.collateralPrice)
  );
  seizedAssets = seizedAssets - seizedAssets / 100n; // 1% to avoid error underflow or overflow

  let swap = await getSwap(
    market.collateralAsset.address,
    market.loanAsset.address,
    seizedAssets,
    account.address
  );

  const dstAmount = swap?.dstAmount || "0";
  // TODO: verify also the profit int ETH compare to tx cost
  // let quote = await getQuote(market.loanAsset.address, dstAmount)
  if (!swap || BigInt(dstAmount) <= 0) {
    console.log("Swap not profitable");
    return;
  }

  _liquidate(swap, market, position, seizedAssets);
};

const _liquidate = async (
  swap: ISwap1inch,
  market: IMarket,
  position: IPosition,
  seizedAssets: bigint
) => {
  console.log("Execute liquidation");
  try {
    const { request } = await publicClient.simulateContract({
      account,
      address: BOT_ADDRESS,
      abi: BOTMORPHO,
      functionName: "morphoLiquidate",
      args: [
        market.uniqueKey,
        position.user.address,
        seizedAssets, // Carefull underflow or overflow
        swap.tx.to,
        swap.tx.data,
      ],
    });
    await walletClient.writeContract(request);
  } catch (error) {
    console.error(error);
  }
};
