import { erc20Abi } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";
import { logger } from "../../../utils/logger";

const ARBITRUM_SEPOLIA_USDC_CONTRACT_ADDRESS =
  "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as const;

const config: IndexerConfig = {
  chainId: arbitrumSepolia.id,
  contractAddress: ARBITRUM_SEPOLIA_USDC_CONTRACT_ADDRESS,
  abi: erc20Abi,
  eventNames: ["Transfer", "Approval"],
  pollingInterval: process.env.POLLING_INTERVAL
    ? parseInt(process.env.POLLING_INTERVAL)
    : 5000,
};

const main = async () => {
  const stop = await IndexerFactory.createAndRunIndexer(config);

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    logger.error("\nGracefully shutting down...");
    stop();
    process.exit(0);
  });
};

main();
