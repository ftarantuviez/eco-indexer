import { erc20Abi } from "viem";
import { sepolia } from "viem/chains";
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";
import { logger } from "../../../utils/logger";

const SEPOLIA_USDC_CONTRACT_ADDRESS =
  "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238" as const;

const config: IndexerConfig = {
  chainId: sepolia.id,
  contractAddress: SEPOLIA_USDC_CONTRACT_ADDRESS,
  abi: erc20Abi,
  eventNames: ["Transfer"],
  pollingInterval: 5000,
};

const main = async () => {
  const stop = await IndexerFactory.createAndRunIndexer(config);
  process.on("SIGINT", () => {
    logger.error("\nGracefully shutting down...");
    stop();
    process.exit(0);
  });
};

main();
