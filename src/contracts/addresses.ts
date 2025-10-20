import { Address } from "viem";

// Base Sepolia Testnet - Primary network
export const CONTRACTS = {
  superCluster: "0x529A994B65A42d75dF23C254ff67eB6Fb73c3b33" as Address,
  pilot: "0x378274002f6E6230c6b06D01c85032D95760902E" as Address,
  mockUSDC: "0xB34882512FC16e74939fc75f6C4b72d827b66f56" as Address,
  sToken: "0x21644Ec0c17733ec6cc251519322627a31f11d54" as Address,
  wsToken: "0x4fAbA08B055d192a7Cd9c70dCBfb84e390c32d65" as Address,
  faucet: "0x39697028fEe49981c79D8ED9753bEB12f6a97E2A" as Address,
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
