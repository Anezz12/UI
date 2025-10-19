import { Address } from "viem";

// Base Sepolia Testnet - Primary network
export const CONTRACTS = {
  superCluster: "0xD50f33e06477700044355E9da7893c51e37822AF" as Address,
  pilot: "0x388a7F7685E0E3BCc04318b17cb21014617C42Bb" as Address,
  mockUSDC: "0xB4d5B455Da31325B86e4705a69734A153dEa1C34" as Address,
} as const;

export const TOKEN_DECIMALS = {
  USDC: 18,
  SUSDC: 18,
} as const;

// Base Sepolia Chain ID
export const CHAIN_ID = 84532;

// Helper function - simplified
export function getContractAddress(
  contractName: keyof typeof CONTRACTS
): Address {
  return CONTRACTS[contractName];
}

// Validation helpers
export function isBaseSepolia(chainId: number | undefined): boolean {
  return chainId === CHAIN_ID;
}

export function isSupportedChain(chainId: number | undefined): boolean {
  return isBaseSepolia(chainId);
}

// Network info
export const NETWORK_INFO = {
  name: "Base Sepolia",
  chainId: CHAIN_ID,
  currency: "ETH",
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
} as const;
