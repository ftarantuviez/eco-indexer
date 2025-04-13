import { erc20Abi } from "viem";
import { baseSepolia } from "viem/chains";
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";

const BASE_SEPOLIA_USDC_CONTRACT_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

const config: IndexerConfig = {
  chainId: baseSepolia.id,
  contractAddress: BASE_SEPOLIA_USDC_CONTRACT_ADDRESS,
  abi: erc20Abi,
  eventNames: ["Transfer", "Approval"],
  pollingInterval: 5000,
  fromBlock: 24377372n,
};

const main = async () => {
  const stop = await IndexerFactory.createAndRunIndexer(config);

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\nGracefully shutting down...");
    stop();
    process.exit(0);
  });
};

main();
