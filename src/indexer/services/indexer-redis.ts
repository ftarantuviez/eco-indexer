import { getRedisClient } from "../../packages/db/redis";
import { hashString } from "../../utils/crypto";

/**
 * Generates a key for Redis.
 * @returns The generated key.
 */
const generateKey = (
  chain: number,
  query: string,
  variables: string
): string => {
  const key = `${chain}-${query}-${variables}`.toLowerCase();
  const hashedKey = hashString(key);
  return hashedKey;
};

/**
 * Fetches a value from Redis.
 * @returns The value from Redis or null if it doesn't exist.
 */
export const fetchFromRedis = async (
  chain: number,
  query: string,
  variables: string
): Promise<string | null> => {
  const client = await getRedisClient();
  const hashedKey = generateKey(chain, query, variables);
  return client.get(hashedKey);
};

/**
 * Adds a key to Redis.
 */
export const addKeyToRedis = async (
  chain: number,
  query: string,
  variables: string,
  value: string
): Promise<string | null> => {
  const client = await getRedisClient();
  const hashedKey = generateKey(chain, query, variables);
  return client.set(hashedKey, value);
};
