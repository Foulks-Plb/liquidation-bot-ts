export const BOTMORPHO = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "loanToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "collateralToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "oracle",
            type: "address",
          },
          {
            internalType: "address",
            name: "irm",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "lltv",
            type: "uint256",
          },
        ],
        internalType: "struct MarketParams",
        name: "marketParams",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        internalType: "bool",
        name: "seizeFullCollat",
        type: "bool",
      },
    ],
    name: "fullLiquidationWithoutCollat",
    outputs: [
      {
        internalType: "uint256",
        name: "seizedAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "repaidAssets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lltv",
        type: "uint256",
      },
    ],
    name: "getLiquidationIncentiveFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "morpho",
    outputs: [
      {
        internalType: "contract IMorpho",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Id",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "seizedAssets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "pair",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "swapData",
        type: "bytes",
      },
    ],
    name: "morphoLiquidate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "onMorphoLiquidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapper",
    outputs: [
      {
        internalType: "contract ISwap",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
