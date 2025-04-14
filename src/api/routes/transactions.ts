import { Router } from "express";
import {
  getTransactions,
  getEventNames,
  getChains,
  getTransactionStats,
} from "../controllers/transactions";

const router = Router();

router.get("/", getTransactions);
router.get("/event-names", getEventNames);
router.get("/chains", getChains);
router.get("/stats", getTransactionStats);

export default router;
