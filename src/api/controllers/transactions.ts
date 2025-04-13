import { Request, Response } from "express";
import * as txService from "../services/transactionService";
import { transactionQuerySchema } from "../types/TransactionQuery";
import { z } from "zod";

/**
 * Get filtered transactions
 * @returns The filtered transactions
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
 * Get unique event names
 * @returns The unique event names
 */
export async function getEventNames(_: Request, res: Response) {
  const events = await txService.getUniqueEventNames();
  res.json(events);
}

/**
 * Get unique chain ids
 * @returns The unique chain ids
 */
export async function getChains(_: Request, res: Response) {
  const chains = await txService.getUniqueChainIds();
  res.json(chains);
}
