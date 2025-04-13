import { getRedisClient } from "../../packages/db/redis";
import { hashString } from "../../utils/crypto";

const generateKey = (
  chain: number,
  query: string,
  variables: string
): string => {
  const key = `${chain}-${query}-${variables}`.toLowerCase();
  const hashedKey = hashString(key);
  return hashedKey;
};

export const fetchFromRedis = async (
  chain: number,
  query: string,
  variables: string
): Promise<string | null> => {
  const client = await getRedisClient();
  const hashedKey = generateKey(chain, query, variables);
  return client.get(hashedKey);
};

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
