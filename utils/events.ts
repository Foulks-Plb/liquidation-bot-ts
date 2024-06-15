import { publicClient } from "./config";

export const watchBlocks = (onBlockReceived: (block: unknown) => void) => {
  const unwatchBlocks = publicClient.watchBlocks({
    onBlock: (block: unknown) => onBlockReceived(block),
  });

  return unwatchBlocks;
};
