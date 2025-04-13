import { RedisClientType, createClient } from "redis";
import * as dotenv from "dotenv";

import { logger } from "../../utils/logger";

dotenv.config();

class RedisClient {
  static instance: RedisClient;
  private client: RedisClientType;
  private constructor() {
    if (process.env.REDIS_URL === undefined)
      throw new Error("REDIS_URL is not defined");
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
  }

  public static async getInstance(): Promise<RedisClientType> {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
      await RedisClient.instance.client.connect();
      logger.log("Redis client connected: ", { url: process.env.REDIS_URL });
    }
    return RedisClient.instance.client;
  }
}

export const getRedisClient = (): Promise<RedisClientType> => {
  return RedisClient.getInstance();
};
