import dotenv from "dotenv";

dotenv.config();

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

export const REDIS_URL = process.env.REDIS_URL;
export const DATABASE_URL = process.env.DATABASE_URL;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set");
}

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
