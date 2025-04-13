import { Request, Response } from "express";
import * as txService from "../services/transactionService";

/**
 * Get filtered transactions
 * @returns The filtered transactions
 */
export async function getTransactions(req: Request, res: Response) {
  const data = await txService.getFilteredTransactions(req.query);
  res.json(data);
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
