![Eco Events Banner](https://media.licdn.com/dms/image/v2/D4E3DAQFKgrVfObTQ_w/image-scale_191_1128/B4EZW0D3QqHMAg-/0/1742482668564/ecoproto_cover?e=1745204400&v=beta&t=Bk3hd1PO7tuunNo8k4fotPbf1ps5sxM9IZ-wpS37o0o)

# Eco Events Indexer

A powerful multi-chain event indexer built with TypeScript, supporting multiple EVM-compatible networks. This project allows you to index and query blockchain events across different networks efficiently.

## 🚀 Features

- Multi-chain support (Sepolia, Arbitrum Sepolia, Base Sepolia, Optimism Sepolia, Polygon Amoy)
- Real-time event indexing
- RESTful API with Swagger documentation
- MongoDB database with Prisma ORM
- Built with Viem for reliable blockchain interactions
- Fallback RPC support with multiple providers
- Rate limiting for API endpoints
- TypeScript for type safety

## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **ORM**: Prisma
- **Blockchain**: Viem
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ftarantuviez/eco-indexer.git
cd eco
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

### Running the Application

1. Start the indexer in development mode:

```bash
npm run indexer:dev
```

2. Start the API server in development mode:

```bash
npm run api:dev
```

## 📚 API Documentation

The API documentation is available through Swagger UI at:

```
http://localhost:3000/api-docs
```

### Available Endpoints

- `GET /transactions` - Get filtered transactions
- `GET /transactions/event-names` - Get unique event names
- `GET /transactions/chains` - Get unique chain IDs

### Query Parameters

- `eventName`: Filter by event name
- `startBlock`: Filter by start block number
- `endBlock`: Filter by end block number
- `page`: Page number for pagination (default: 1)
- `pageSize`: Number of items per page (default: 10)
- `chainId`: Filter by chain ID

## 🔧 Configuring Event Indexing

### Adding New Events to Index

1. Create a new configuration file in `src/indexer/chains/<network-name>/<contract-name>.ts`:

```typescript
import { IndexerFactory, IndexerConfig } from "../../core/indexer-factory";

const config: IndexerConfig = {
  chainId: YOUR_CHAIN_ID,
  contractAddress: "0x...",
  abi: YOUR_CONTRACT_ABI,
  eventNames: ["Event1", "Event2"],
  pollingInterval: 5000, // 5 seconds
};

const main = async () => {
  await IndexerFactory.createAndRunIndexer(config);
};
```

2. Add your contract's ABI and configure the events you want to index.

## 🌐 Multi-Chain Support

The project uses a custom multi-chain client located in `packages/multi-chain-client`. This client:

- Supports multiple EVM-compatible networks
- Implements fallback RPC providers for reliability
- Handles chain-specific configurations
- Currently supports:
  - Sepolia
  - Arbitrum Sepolia
  - Base Sepolia
  - Optimism Sepolia
  - Polygon Amoy

### Adding a New Chain

To add support for a new chain, update the configuration in `src/packages/multi-chain-client/config/getTransportConfig.ts`:

```typescript
[newChain.id]: {
  enabled: true,
  chain: newChain,
  transport: fallback([
    http(`${RPC_URL}`, {
      name: "Primary RPC",
      onFetchRequest: () => logger.debug("Primary RPC request"),
    }),
    // Add fallback RPCs...
  ]),
}
```

## 📝 License

ISC

---

Made with ❤️ by @ftarantuviez
