import { Abi } from "viem";
import { Indexer } from "./indexer";

export interface IndexerConfig {
  chainId: number;
  contractAddress: `0x${string}`;
  abi: Abi;
  eventNames: string[];
  pollingInterval?: number; // in milliseconds
  fromBlock?: bigint; // Optional starting block number
}

export class IndexerFactory {
  private constructor() {} // Prevent instantiation

  /**
   * Create an indexer for a specific chain
   * @param config - The configuration for the indexer
   * @returns An instance of the Indexer class
   */
  static createIndexer(config: IndexerConfig): Indexer {
    return new Indexer(
      config.chainId,
      config.contractAddress,
      config.abi,
      config.eventNames,
      config.fromBlock
    );
  }

  /**
   * Create and run an indexer for a specific chain
   * @param config - The configuration for the indexer
   * @returns A function to stop the indexer
   */
  static async createAndRunIndexer(config: IndexerConfig): Promise<() => void> {
    const indexer = this.createIndexer(config);
    let isRunning = true;

    const run = async () => {
      while (isRunning) {
        await indexer.getLogsFromBlockRange();
        await new Promise((resolve) =>
          setTimeout(resolve, config.pollingInterval || 5000)
        );
      }
    };

    // Start the indexer
    run();

    // Return a function to stop the indexer
    return () => {
      isRunning = false;
    };
  }
}
