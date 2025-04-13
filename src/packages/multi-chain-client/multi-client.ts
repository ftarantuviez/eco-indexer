import { createPublicClient, PublicClient } from "viem";
import { ClientsConfig } from "./base-multi-chain-client";
import { BaseMultiChainClient } from "./base-multi-chain-client";
import { defaultTestnetConfig } from "./config/getTransportConfig";

export class MultiClient extends BaseMultiChainClient<PublicClient> {
  constructor(networksConfig: ClientsConfig[]) {
    super(networksConfig);

    this.initializeClients();
  }

  protected initClient(config: ClientsConfig): PublicClient {
    const client = createPublicClient(config);
    this.clients.set(config.chain.id, client);
    return client;
  }
}

export const multiClient = new MultiClient(
  Object.values(defaultTestnetConfig())
);
