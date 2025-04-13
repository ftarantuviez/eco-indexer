import { z } from "zod";

export type TransactionQuery = {
  /** The event name to filter by */
  eventName?: string;
  /** The start block to filter by */
  startBlock?: number;
  /** The end block to filter by */
  endBlock?: number;
  /** The page number to filter by */
  page?: number;
  /** The page size to filter by */
  pageSize?: number;
  /** The chain id to filter by */
  chainId?: number;
};

// Define the validation schema
export const transactionQuerySchema = z
  .object({
    eventName: z.string().optional(),
    startBlock: z.coerce.number().int().positive().optional(),
    endBlock: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().default(10),
    chainId: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) => {
      // Additional validation: if both startBlock and endBlock are provided,
      // ensure startBlock is less than endBlock
      if (data.startBlock && data.endBlock) {
        return data.startBlock <= data.endBlock;
      }
      return true;
    },
    {
      message: "startBlock must be less than or equal to endBlock",
    }
  );
