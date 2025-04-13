import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "viem/chains";
import { ClientsConfig } from "../base-multi-chain-client";
import { fallback, http } from "viem";
import { logger } from "../../../utils/logger";
import { ALCHEMY_API_KEY } from "../../../utils/env";

/**
 * Default testnet config for the multi-chain client
 * @returns A record of chain IDs to client configs
 */
export const defaultTestnetConfig = (): Record<number, ClientsConfig> => ({
  [sepolia.id]: {
    enabled: true,
    chain: sepolia,
    transport: fallback([
      http(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        name: "Alchemy",
        onFetchRequest: () => logger.debug("Alchemy request"),
      }),
      http("https://ethereum-sepolia.wallet.brave.com", {
        name: "Brave Wallet",
        onFetchRequest: () => logger.debug("Brave Wallet request"),
      }),
      http("https://ethereum-sepolia-rpc.publicnode.com", {
        name: "Sepolia publicnode",
        onFetchRequest: () => logger.debug("Sepolia publicnode request"),
      }),
      http("https://endpoints.omniatech.io/v1/eth/sepolia/public", {
        name: "Sepolia omniatech",
        onFetchRequest: () => logger.debug("Sepolia omniatech request"),
      }),
    ]),
  },
  [arbitrumSepolia.id]: {
    enabled: true,
    chain: arbitrumSepolia,
    transport: fallback([
      http(`https://arbitrum-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        name: "Alchemy",
        onFetchRequest: () => logger.debug("Alchemy request"),
      }),
      http("https://sepolia-rollup.arbitrum.io/rpc", {
        name: "Sepolia Rollup",
        onFetchRequest: () => logger.debug("Sepolia Rollup request"),
      }),
      http("https://arbitrum-sepolia.gateway.tenderly.co", {
        name: "Tenderly Gateway",
        onFetchRequest: () => logger.debug("Tenderly Gateway request"),
      }),
      http("https://endpoints.omniatech.io/v1/arbitrum/sepolia/public", {
        name: "omniatech Gateway",
        onFetchRequest: () => logger.debug("omniatech Gateway request"),
      }),
      http("https://arbitrum-sepolia.blockpi.network/v1/rpc/public	", {
        name: "Blockpi Node",
        onFetchRequest: () => logger.debug("Blockpi Node request"),
      }),
    ]),
  },
  [baseSepolia.id]: {
    enabled: true,
    chain: baseSepolia,
    transport: fallback([
      http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        name: "Alchemy",
        onFetchRequest: () => logger.debug("Alchemy request"),
      }),
      http("https://sepolia.base.org", {
        name: "Base Sepolia RPC",
        onFetchRequest: () => logger.debug("Base Public RPC request"),
      }),
      http("https://base-sepolia-rpc.publicnode.com", {
        name: "Base Sepolia Public RPC",
        onFetchRequest: () => logger.debug("omniatech Gateway request"),
      }),
      http("https://base-sepolia.gateway.tenderly.co", {
        name: "Tenderly Gateway",
        onFetchRequest: () => logger.debug("Tenderly Gateway request"),
      }),
      http("https://base-sepolia.drpc.org", {
        name: "drpc",
        onFetchRequest: () => logger.debug("drpc request"),
      }),
    ]),
  },
  [optimismSepolia.id]: {
    enabled: true,
    chain: optimismSepolia,
    transport: fallback([
      http(`https://opt-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        name: "Alchemy",
        onFetchRequest: () => logger.debug("Alchemy request"),
      }),
      http("https://sepolia.optimism.io", {
        name: "Optimism Public RPC",
        onFetchRequest: () => logger.debug("Optimism Public RPC request"),
      }),
      http("https://endpoints.omniatech.io/v1/op/sepolia/public", {
        name: "omniatech Gateway",
        onFetchRequest: () => logger.debug("omniatech Gateway request"),
      }),
      http("https://optimism-sepolia.gateway.tenderly.co", {
        name: "Tenderly Gateway",
        onFetchRequest: () => logger.debug("Tenderly Gateway request"),
      }),
    ]),
  },
  [polygonAmoy.id]: {
    enabled: true,
    chain: polygonAmoy,
    transport: fallback([
      http(`https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, {
        name: "Alchemy",
        onFetchRequest: () => logger.debug("Alchemy request"),
      }),
      http("https://endpoints.omniatech.io/v1/polygon/amoy/public", {
        name: "omniatech Gateway",
        onFetchRequest: () => logger.debug("omniatech Gateway request"),
      }),
    ]),
  },
});
