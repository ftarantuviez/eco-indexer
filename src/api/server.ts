import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

import { logger } from "../utils/logger";
import transactionsRouter from "./routes/transactions";
import rateLimit from "express-rate-limit";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300, // Limit each IP to 300 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/transactions", transactionsRouter);

// Start server
app.listen(port, () => {
  logger.log(`⚡️[server]: API Listening On Port ${port}`);
});
