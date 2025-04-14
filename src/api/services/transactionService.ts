import { prismaClient } from "../../packages/db/prisma";
import { TransactionQuery } from "../types/TransactionQuery";

/**
 * Get filtered transactions
 * @param query - The query object
 * @returns The filtered transactions
 */
export async function getFilteredTransactions(query: TransactionQuery) {
  const {
    eventName,
    startBlock,
    endBlock,
    page = 1,
    pageSize = 10,
    chainId,
  } = query;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where: any = {};

  if (eventName) where.eventName = eventName;
  if (chainId) where.chainId = Number(chainId);
  if (startBlock) where.blockNumber = { gte: Number(startBlock) };
  if (endBlock) {
    where.blockNumber = {
      ...(where.blockNumber || {}),
      lte: Number(endBlock),
    };
  }

  const [transactions, total] = await Promise.all([
    prismaClient.transaction.findMany({
      where,
      skip,
      take,
      orderBy: { timestamp: "desc" },
    }),
    prismaClient.transaction.count({ where }),
  ]);

  return {
    total,
    totalPages: Math.ceil(total / Number(pageSize)),
    page: Number(page),
    pageSize: Number(pageSize),
    data: transactions,
  };
}

/**
 * Get unique event names
 * @returns The unique event names
 */
export async function getUniqueEventNames() {
  const rawEvents = await prismaClient.transaction.findMany({
    distinct: ["eventName"],
    select: { eventName: true },
  });

  return rawEvents.map((e) => e.eventName);
}

/**
 * Get unique chain ids
 * @returns The unique chain ids
 */
export async function getUniqueChainIds() {
  const rawChains = await prismaClient.transaction.findMany({
    distinct: ["chainId"],
    select: { chainId: true },
  });

  return rawChains.map((c) => c.chainId);
}

/**
 * Get transfer transaction statistics, optionally filtered by chain
 * @param chainId - Optional chain ID to filter by
 * @returns Statistics about Transfer events and total value
 */
export async function getTransferTransactionStats(chainId?: number) {
  // Base where clause for Transfer events
  const whereClause = {
    eventName: "Transfer",
    ...(chainId ? { chainId } : {}),
  };

  const transferStats = await prismaClient.transaction.aggregate({
    where: whereClause,
    _count: {
      id: true,
    },
  });

  // Get all Transfer transactions to sum their values from decodedTopics
  const transfers = await prismaClient.transaction.findMany({
    where: whereClause,
    select: {
      decodedTopics: true,
      chainId: true,
    },
  });

  // Sum up the values from decodedTopics, which contains the decoded event arguments
  const totalValue = transfers.reduce((sum, tx) => {
    const value = (tx.decodedTopics as any).value || 0n;
    return sum + BigInt(value.toString());
  }, 0n);

  return {
    totalTransfers: transferStats._count.id || 0,
    totalValue: totalValue.toString(), // Convert BigInt to string for JSON
    chainId: chainId || "all", // Indicate which chain these stats are for
  };
}
