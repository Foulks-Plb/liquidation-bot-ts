# Morpho Blue Liquidation Bot

Welcome to the Morpho Blue Liquidation Bot repository. This project contains a bot designed to handle liquidations on the Morpho Blue markets. The bot is developed in TypeScript using Bun, and it includes a Hardhat project for the smart contract responsible for triggering liquidations and taking profit, as well as the bot itself.

## Why Bun?

Bun is chosen for this project due to its performance advantages and built-in features that streamline the development process. It provides faster startup times and a more efficient bundling process compared to other JavaScript/TypeScript bundlers. This helps in creating a more responsive and efficient bot, crucial for timely execution in a high-frequency trading environment like Morpho Blue markets.

## Technologies Used

### Hardhat

Hardhat is used as the development environment for Ethereum smart contracts.
It Contains the Solidity smart contract code for triggering liquidations and taking profits.

### viem

viem is utilized as the interface to interact with the Ethereum blockchain. It provides a seamless and efficient way to connect to Ethereum nodes, listen for blockchain events, and perform transactions.

### graphql

graphql is used to query the blockchain for the latest state of the Morpho Blue markets. This allows the bot to stay updated with the current positions and make informed decisions on when to trigger liquidations and take profits.

## Bot Functionality

The bot operates with the following functionalities:

1. **Listening for New Blocks**: The bot listens for new blocks added to the Ethereum blockchain. This allows it to stay updated with the latest state of the blockchain and act on any relevant changes promptly.
   
2. **Monitoring Smart Contract Events**: The bot listens for specific events emitted by the Morpho Blue smart contract. This includes events that indicate when a position needs to be liquidated or when profit can be taken.

3. **Updating Positions**: Based on the events and new blocks, the bot updates its understanding of the current positions thanks graphql and decides when to trigger liquidations and take profits.


## Improvement Suggestion

- Evaluate the performance benefits of using lower-level languages such as Rust, Go or Python for critical performance sections of the bot. These languages offer superior execution speed and memory management, which could be crucial for high-frequency trading and real-time operations.
- Develop a mechanism to monitor all transactions sent by the bot. This includes tracking the status and outcome of each transaction to ensure successful execution and to diagnose issues promptly.
- Implement functionality to monitor the mempool (the pool of pending transactions) for relevant transactions. By observing pending transactions, the bot can anticipate changes to the blockchain state and make liquidation decisions quickly.
- Verify the real profit in ETH with gas cost

## Getting Started

### Prerequisites

- Bun
- Hardhat
- viem
- graphql
- 1Inch API

### Installation & Running

```bash
bun install
```

To run:

```bash
bun run index.ts
```

### Testing real liquidation in localhost with mainnet fork

```bash
npx hardhat node --fork {RPC_URL}
```

```bash
npx hardhat ignition deploy ./ignition/modules/BotMorpho.ts --network localhost 
```
