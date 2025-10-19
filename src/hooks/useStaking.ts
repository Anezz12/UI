import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import {
  CONTRACTS,
  TOKEN_DECIMALS,
  isBaseSepolia,
} from "@/contracts/addresses";
import { MOCK_USDC_ABI } from "@/contracts/abis/MockUSDC";
import { SUPERCLUSTER_ABI } from "@/contracts/abis/SuperCluster";

export function useStaking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const stake = async (amount: string) => {
    if (!address || !chainId) {
      setError("Please connect your wallet");
      return false;
    }

    if (!isBaseSepolia(chainId)) {
      setError("Please switch to Base Sepolia network");
      return false;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      setTxHash(null);

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.USDC);

      console.log("Approving USDC...");
      const approveTx = await writeContractAsync({
        address: CONTRACTS.mockUSDC,
        abi: MOCK_USDC_ABI,
        functionName: "approve",
        args: [CONTRACTS.superCluster, amountBigInt],
      });

      await publicClient?.waitForTransactionReceipt({ hash: approveTx });
      console.log("USDC approved:", approveTx);

      console.log("Depositing to SuperCluster...");
      const depositTx = await writeContractAsync({
        address: CONTRACTS.superCluster,
        abi: SUPERCLUSTER_ABI,
        functionName: "deposit",
        args: [CONTRACTS.pilot, CONTRACTS.mockUSDC, amountBigInt],
      });

      await publicClient?.waitForTransactionReceipt({ hash: depositTx });
      console.log("Deposit successful:", depositTx);

      setTxHash(depositTx);
      setError(null);
      return true;
    } catch (err: any) {
      console.error("Staking error:", err);
      const errorMessage =
        err?.shortMessage ??
        err?.message ??
        "Failed to stake. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setError(null);

  return {
    stake,
    isSubmitting,
    error,
    txHash,
    resetError,
  };
}
