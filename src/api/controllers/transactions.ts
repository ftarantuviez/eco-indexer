import { Request, Response } from "express";
import * as txService from "../services/transactionService";
import { transactionQuerySchema } from "../types/TransactionQuery";
import { z } from "zod";

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get filtered transactions
 *     description: Retrieve transactions with optional filtering
 *     parameters:
 *       - in: query
 *         name: eventName
 *         schema:
 *           type: string
 *         description: Filter by event name
 *       - in: query
 *         name: startBlock
 *         schema:
 *           type: integer
 *         description: Filter by start block number
 *       - in: query
 *         name: endBlock
 *         schema:
 *           type: integer
 *         description: Filter by end block number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: chainId
 *         schema:
 *           type: integer
 *         description: Filter by chain ID
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       chainId:
 *                         type: integer
 *                       eventName:
 *                         type: string
 *                       blockNumber:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
export async function getTransactions(req: Request, res: Response) {
  try {
    // Validate and transform query parameters
    const validatedQuery = transactionQuerySchema.parse(req.query);

    // Pass the validated query to the service
    const data = await txService.getFilteredTransactions(validatedQuery);
    res.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).json({
        error: "Invalid query parameters",
        details: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    } else {
      // Handle other errors
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

/**
 * @swagger
 * /transactions/event-names:
 *   get:
 *     summary: Get unique event names
 *     description: Retrieve a list of all unique event names
 *     responses:
 *       200:
 *         description: List of event names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
export async function getEventNames(_: Request, res: Response) {
  const events = await txService.getUniqueEventNames();
  res.json(events);
}

/**
 * @swagger
 * /transactions/chains:
 *   get:
 *     summary: Get unique chain IDs
 *     description: Retrieve a list of all unique chain IDs
 *     responses:
 *       200:
 *         description: List of chain IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 */
export async function getChains(_: Request, res: Response) {
  const chains = await txService.getUniqueChainIds();
  res.json(chains);
}

/**
 * @swagger
 * /transactions/stats:
 *   get:
 *     summary: Get transfer transaction statistics
 *     description: Retrieve aggregate statistics about Transfer events and total value, optionally filtered by chain
 *     parameters:
 *       - in: query
 *         name: chainId
 *         schema:
 *           type: integer
 *         required: false
 *         description: Optional chain ID to filter statistics by
 *     responses:
 *       200:
 *         description: Transaction statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTransfers:
 *                   type: integer
 *                   description: Total number of Transfer events
 *                 totalValue:
 *                   type: string
 *                   description: Total value of tokens transferred (as BigInt string)
 *                 chainId:
 *                   type: string
 *                   description: Chain ID for the stats, or 'all' if not filtered
 *       400:
 *         description: Invalid chain ID
 *       500:
 *         description: Internal server error
 */
export async function getTransactionStats(req: Request, res: Response) {
  try {
    const chainId = req.query.chainId ? Number(req.query.chainId) : undefined;

    // Validate chainId if provided
    if (chainId !== undefined && (!Number.isInteger(chainId) || chainId <= 0)) {
      res.status(400).json({
        error: "Invalid chain ID. Must be a positive integer.",
      });
    }

    const stats = await txService.getTransferTransactionStats(chainId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
}
