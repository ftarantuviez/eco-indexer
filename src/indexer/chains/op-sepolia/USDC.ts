import { erc20Abi } from "viem";
import { optimismSepolia } from "viem/chains";
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";
import { logger } from "../../../utils/logger";
const OPTIMISM_USDC_CONTRACT_ADDRESS =
  "0x5fd84259d66cd46123540766be93dfe6d43130d7" as const;

const config: IndexerConfig = {
  chainId: optimismSepolia.id,
  contractAddress: OPTIMISM_USDC_CONTRACT_ADDRESS,
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
