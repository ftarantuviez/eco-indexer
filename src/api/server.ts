import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { logger } from "../utils/logger";
import transactionsRouter from "./routes/transactions";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/transactions", transactionsRouter);

// Start server
app.listen(port, () => {
  logger.log(`⚡️[server]: API Listening On Port ${port}`);
});
