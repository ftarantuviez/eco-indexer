import dotenv from "dotenv";

dotenv.config();

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is not set");
}
