import { erc20Abi } from "viem";
import { polygonAmoy } from "viem/chains";
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";
import { logger } from "../../../utils/logger";
const POLYGON_AMOY_USDC_CONTRACT_ADDRESS =
  "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582" as const;

const config: IndexerConfig = {
  chainId: polygonAmoy.id,
  contractAddress: POLYGON_AMOY_USDC_CONTRACT_ADDRESS,
  abi: erc20Abi,
  eventNames: ["Transfer"],
  pollingInterval: 5000,
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
