import axios from "axios";
import type { Address } from "viem";
import type { ISwap1inch } from "./types";
import { WETH_ADDRESS } from "./config";

const URL = "https://api.1inch.dev/swap/v6.0/1";

export const getSwap = async (
  src: Address,
  dst: Address,
  amount: bigint,
  from: Address
): Promise<ISwap1inch | null> => {
  const params = {
    src,
    dst,
    amount: amount.toString(),
    from,
    slippage: 10,
    includeGas: true,
    disableEstimate: true,
  };

  try {
    const response = await axios.get(`${URL}/swap`, {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching swap data:", error);
    return null;
  }
};

export const getQuote = async (
  src: string,
  amount: string
): Promise<any | null> => {
  const params = {
    src: src,
    dst: WETH_ADDRESS,
    amount: amount,
  };

  try {
    const response = await axios.get(`${URL}/quote`, {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quote data:", error);
    return null;
  }
};
