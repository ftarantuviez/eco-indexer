import {
  PublicClient,
  WalletClient,
  Chain,
  FallbackTransport,
  HttpTransport,
} from "viem";
import { logger } from "../../utils/logger";

export type ClientsConfig = {
  chain: Chain;
  transport: FallbackTransport | HttpTransport;
  enabled?: boolean;
};

export abstract class BaseMultiChainClient<
  T extends PublicClient | WalletClient
> {
  readonly clients: Map<number, T> = new Map();
  protected readonly configs: Map<number, ClientsConfig> = new Map();

  constructor(networksConfig: ClientsConfig[]) {
    for (const config of networksConfig) {
      if (config.enabled) {
        this.configs.set(config.chain.id, config);
      }
    }
    logger.debug(
      "Available networks:",
      networksConfig
        .filter((c) => c.enabled)
        .map((c) => c.chain.name)
        .join("\n")
    );
  }

  /**
   * Initialize all clients
   */
  protected initializeClients(): void {
    for (const config of this.configs.values()) {
      this.initClient(config);
    }
  }

  /**
   * Get or initialize a client for a given chainId
   */
  public getClient(chainId: number): T | undefined {
    if (this.clients.has(chainId)) {
      return this.clients.get(chainId);
    }

    const config = this.configs.get(chainId);
    if (config) {
      return this.initClient(config);
    }

    logger.debug(`No config found for chainId: ${chainId}`);
    return undefined;
  }

  /**
   * Initialize a client for a given config and add it to the clients map
   */
  protected abstract initClient(config: ClientsConfig): T;

  /**
   * List the names of the clients initialized
   * @returns An array of client names
   */
  public listClientsNames(): string[] {
    return Array.from(this.clients.values()).map((client) => client.name);
  }

  /**
   * List the names of the networks configured (received in the constructor)
   * @returns An array of network names
   */
  public listConfiguredNetworks(): string[] {
    return Array.from(this.configs.values()).map((config) => config.chain.name);
  }
}
