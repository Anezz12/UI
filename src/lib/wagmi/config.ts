import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

// Define Base Sepolia
const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Explorer",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [mainnet, sepolia, baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }), // Gunakan projectId dari env var
    coinbaseWallet({ appName: "Super Cluster" }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Setup Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
});

export { projectId };
