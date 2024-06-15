import axios from "axios";
import type { Address } from "viem";

const URL = "https://api.1inch.dev/swap/v6.0/1";

export const getSwap = async (
  src: Address,
  dst: Address,
  amount: bigint,
  from: Address
): Promise<any> => {
  const params = {
    src,
    dst,
    amount: amount.toString(),
    from,
    slippage: 10,
    includeGas: true,
    disableEstimate: true,
  };

  let swapResult: any;
  try {
    const response = await axios.get(URL + "/swap", {
      headers: {
        Authorization: "Bearer " + process.env.ONEINCH_API_KEY,
      },
      params,
    });
    swapResult = response.data;
  } catch (error) {
    console.error(error);
  }

  return swapResult;
};
