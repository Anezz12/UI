import { Address } from "viem";

export type SupportedChainId = 1 | 11155111 | 8453 | 84532;

export type ContractName = "superCluster" | "pilot" | "mockUSDC";

export interface StakeParams {
  pilot: Address;
  token: Address;
  amount: bigint;
}

export interface WithdrawParams {
  token: Address;
  amount: bigint;
}

export interface TokenBalance {
  value: bigint;
  decimals: number;
  formatted: string;
  symbol: string;
}

export interface StakingStats {
  totalStaked: string;
  activeStakers: string;
  apr: string;
  marketCap: string;
}
