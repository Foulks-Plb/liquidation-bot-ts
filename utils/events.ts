import { parseAbi } from "viem";
import { MORPHO_BLUE_ADDRESS, publicClient } from "./config";

export const watchBlocks = (onBlockReceived: (block: unknown) => void) => {
  const unwatchBlocks = publicClient.watchBlocks({
    onBlock: (block: unknown) => onBlockReceived(block),
  });

  return unwatchBlocks;
};

export const watchEvents = (onEventReceived: (logs: unknown) => void) => {
  const unwatchEvents = publicClient.watchEvent({
    address: MORPHO_BLUE_ADDRESS,
    events: parseAbi([
      "event Borrow(bytes32 id, address caller, address onBehalf, address receiver, uint256 assets, uint256 shares)",
      "event Supply(bytes32 id, address caller, address onBehalf, uint256 assets, uint256 shares)",
      "event SupplyCollateral(bytes32 id, address caller, address onBehalf, uint256 assets)",
      "event Withdraw(bytes32 id, address caller, address onBehalf, address receiver, uint256 assets, uint256 shares)",
      "event WithdrawCollateral(bytes32 id, address caller, address onBehalf, address receiver, uint256 assets)",
      "event Repay(bytes32 id, address caller, address onBehalf, uint256 assets, uint256 shares)",
      "event Liquidate(bytes32 id, address caller, address borrower, uint256 repaidAssets, uint256 repaidShares, uint256 seizedAssets, uint256 badDebtAssets, uint256 badDebtShares)",
    ]),
    onLogs: (logs) => onEventReceived(logs),
  });

  return unwatchEvents;
};
