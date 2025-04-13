import { prismaClient } from "../../packages/db/prisma";

type TransactionQuery = {
  eventName?: string;
  startBlock?: number;
  endBlock?: number;
  page?: number;
  pageSize?: number;
  chainId?: number;
};

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
