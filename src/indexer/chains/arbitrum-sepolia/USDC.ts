import { erc20Abi } from "viem";
import { Indexer } from "../../core/indexer";
import { arbitrumSepolia } from "viem/chains";

const ARBITRUM_SEPOLIA_USDC_CONTRACT_ADDRESS =
  "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

async function getIndexer() {
  const indexer = new Indexer(
    arbitrumSepolia.id,
    ARBITRUM_SEPOLIA_USDC_CONTRACT_ADDRESS,
    erc20Abi,
    ["Transfer", "Approval"]
  );

  return indexer;
}

const main = async () => {
  const indexer = await getIndexer();

  while (true) {
    await indexer.getLogsFromBlockRange();
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds
  }
};

main();
