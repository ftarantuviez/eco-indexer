import { multiClient } from "../../packages/multi-chain-client/multi-client";
import { Abi, AbiItem, decodeEventLog, PublicClient } from "viem";

import {
  addKeyToRedis,
  fetchFromRedis,
} from "../../indexer/services/indexer-redis";
import { Json } from "../../utils/Json";
import { logger } from "../../utils/logger";
import { Prisma } from "@prisma/client";
import { prismaClient } from "../../packages/db/prisma";

const REDIS_KEY_LATEST_PROCESSED_BLOCK = "latest-processed-block";

export class Indexer {
  private publicClient: PublicClient;
  public chainId: number;
  public abi: Abi;
  public eventsToIndex: AbiItem[] = [];
  public contractAddress: `0x${string}`;
  public initialBlock: bigint | undefined;

  constructor(
    chainId: number,
    contractAddress: `0x${string}`,
    abi: Abi,
    eventsToIndex: string[],
    initialBlock?: bigint
  ) {
    const client = multiClient.getClient(chainId);
    if (!client) {
      logger.error("Chain Not Supported", { chainId });
      throw new Error("Chain Not Supported");
    }

    this.abi = abi;
    // We assert that the events to index are valid and exist in the ABI.
    this._assertEventsToIndex(eventsToIndex);

    this.publicClient = client;
    this.chainId = chainId;
    this.contractAddress = contractAddress;
    this.initialBlock = initialBlock;
  }

  /**
   * Fetches and processes blockchain logs from a dynamic block range.
   * The range starts from the last processed block (or initial block if none)
   * up to the current latest block on the chain.
   *
   * The logs are decoded and transformed into transaction records with:
   * - Block number and timestamp
   * - Transaction hash
   * - Event name and decoded parameters
   * - Chain ID
   *
   * @returns {Promise<Prisma.TransactionCreateManyInput[]>} Array of transaction records ready for database insertion
   */
  async getLogsFromBlockRange(): Promise<Prisma.TransactionCreateManyInput[]> {
    try {
      const blockRange = await this.getBlockRange();

      // If there's no block range, we've already processed all blocks.
      if (!blockRange) {
        logger.debug("No block range, we've already processed all blocks.");
        return [];
      }

      logger.debug(
        `getLogsFromBlockRange: ${blockRange.fromBlock} - ${blockRange.toBlock}`
      );

      // Get logs from block range
      const logs = await this.publicClient.getLogs({
        address: this.contractAddress,
        fromBlock: blockRange.fromBlock,
        toBlock: blockRange.toBlock,
        events: this.eventsToIndex,
      });

      if (logs.length === 0) {
        logger.debug("No logs found, we've already processed all blocks.");
        await this.saveLatestProcessedBlock(blockRange.toBlock);
        return [];
      }

      logger.debug(`getLogsFromBlockRange: ${logs.length} logs found`);

      // Since logs don't have timestamps, we should use the block number to get the timestamp.
      const timestamps = await this.getBlocksTimestamps(
        logs.map((log) => log.blockNumber)
      );

      // Decode logs to get the event name and arguments
      const decodedLogs = logs.map((log) => {
        const decodedLog = decodeEventLog({
          abi: this.abi,
          topics: log.topics,
          data: log.data,
        });

        return {
          decodedTopics: decodedLog.args ?? {},
          blockNumber: Number(log.blockNumber),
          transactionHash: log.transactionHash,
          chainId: this.chainId,
          timestamp: Number(timestamps[Number(log.blockNumber)]),
          eventName: decodedLog.eventName ?? "",
        };
      });

      // Save logs to database
      await this.saveLogsToDatabase(
        JSON.parse(Json.stringifyBigInt(decodedLogs))
      );

      // Let's update the latest processed block
      await this.saveLatestProcessedBlock(blockRange.toBlock);

      return decodedLogs;
    } catch (error) {
      logger.error("Error getting logs from block range", { error });
      return [];
    }
  }

  /**
   * Retrieves timestamps for a list of block numbers.
   * @param blockNumbers - Array of block numbers to fetch timestamps for.
   * @returns {Promise<{ [blockNumber: number]: number }>} Object mapping block numbers to their timestamps.
   */
  private async getBlocksTimestamps(
    blockNumbers: bigint[]
  ): Promise<{ [blockNumber: number]: number }> {
    const uniqueBlockNumbers = [...new Set(blockNumbers)];
    const timestamps: { [blockNumber: number]: number } = {};

    await Promise.all(
      uniqueBlockNumbers.map(async (blockNumber) => {
        const block = await this.publicClient.getBlock({ blockNumber });
        timestamps[Number(blockNumber)] = Number(block.timestamp);
      })
    );

    return timestamps;
  }

  /**
   * Retrieves the block range to process.
   * @returns {Promise<{ fromBlock: bigint; toBlock: bigint } | undefined>}
   *   - Returns the block range if there are blocks to process
   *   - Returns undefined if all blocks have been processed
   * @remarks
   * The block range is fetched from Redis, which is updated by the saveLatestProcessedBlock method.
   * If no blocks have been processed yet, the initial block is used.
   */
  private async getBlockRange(): Promise<
    Readonly<{ fromBlock: bigint; toBlock: bigint }> | undefined
  > {
    const latestProcessedBlock = await fetchFromRedis(
      this.chainId,
      REDIS_KEY_LATEST_PROCESSED_BLOCK,
      this.contractAddress
    );

    const toBlock = await this.publicClient.getBlockNumber();

    // If we have not saved any blocks yet, return the initial block.
    // If we don't have an initial block, we'll start from the latest block.
    if (!latestProcessedBlock) {
      return {
        fromBlock: this.initialBlock ?? toBlock,
        toBlock: toBlock,
      };
    }

    // If we have already processed all blocks, return undefined
    if (Number(latestProcessedBlock) >= toBlock) {
      return undefined;
    }

    return {
      fromBlock: BigInt(Number(latestProcessedBlock) + 1),
      toBlock: toBlock,
    };
  }

  /**
   * Saves blockchain event logs to the database.
   * @param logs - Array of log entries to save, each containing:
   * ```typescript
   * {
   *   decodedTopics: Record<string, unknown>; // Decoded event parameters
   *   blockNumber: number;                    // Block number where event occurred
   *   transactionHash: string;                // Transaction hash containing the event
   *   chainId: number;                        // Chain ID where event occurred
   *   timestamp: number;                      // Block timestamp
   *   eventName: string;                      // Name of the event (e.g. "Transfer")
   * }
   * ```
   */
  private async saveLogsToDatabase(logs: Prisma.TransactionCreateManyInput[]) {
    logger.debug(`Saving ${logs.length} logs to database`);
    await prismaClient.transaction.createMany({
      data: logs,
    });
    logger.debug(`Saved ${logs.length} logs to database`);
  }

  /**
   * Save the latest processed block to Redis.
   * @param blockNumber - The block number to save.
   */
  private async saveLatestProcessedBlock(blockNumber: bigint) {
    logger.debug(`Saving latest processed block ${blockNumber}`);
    await addKeyToRedis(
      this.chainId,
      REDIS_KEY_LATEST_PROCESSED_BLOCK,
      this.contractAddress,
      blockNumber.toString()
    );
    logger.debug(`Saved latest processed block ${blockNumber}`);
  }

  /**
   * Asserts that the events to index are valid.
   * @param eventsToIndex - The events to index.
   * @throws {Error} If an event is not found in the ABI.
   */
  private _assertEventsToIndex(eventsToIndex: string[]) {
    for (const event of eventsToIndex) {
      const foundEvent = this.abi
        .filter((e) => e.type === "event")
        .find((e) => e.name === event);
      if (!foundEvent) {
        logger.error(`Event ${event} not found in ABI`);
        throw new Error(`Event ${event} not found in ABI`);
      }
      this.eventsToIndex.push(foundEvent);
    }
  }
}
