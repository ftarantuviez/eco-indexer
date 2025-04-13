import { Router } from "express";
import {
  getTransactions,
  getEventNames,
  getChains,
} from "../controllers/transactions";

const router = Router();

router.get("/", getTransactions);
router.get("/event-names", getEventNames);
router.get("/chains", getChains);

export default router;
