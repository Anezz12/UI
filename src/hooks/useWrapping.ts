import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import {
  CONTRACTS,
  TOKEN_DECIMALS,
  isBaseSepolia,
} from "@/contracts/addresses";
import { STOKEN_ABI } from "@/contracts/abis/SToken";
import { WSTOKEN_ABI } from "@/contracts/abis/WsToken";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    if (typeof err.shortMessage === "string") return err.shortMessage;
    if (typeof err.message === "string") return err.message;
  }

  return "Transaction failed. Please try again.";
}

export function useWrapping() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const wrap = async (amount: string) => {
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

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.SUSDC);

      console.log("Approving sToken for wrapping...");
      const approveTx = await writeContractAsync({
        address: CONTRACTS.sToken,
        abi: STOKEN_ABI,
        functionName: "approve",
        args: [CONTRACTS.wsToken, amountBigInt],
      });

      await publicClient?.waitForTransactionReceipt({ hash: approveTx });
      console.log("sToken approved:", approveTx);

      console.log("Wrapping sToken to wsToken...");
      const wrapTx = await writeContractAsync({
        address: CONTRACTS.wsToken,
        abi: WSTOKEN_ABI,
        functionName: "wrap",
        args: [amountBigInt],
      });

      await publicClient?.waitForTransactionReceipt({ hash: wrapTx });
      console.log("Wrap successful:", wrapTx);

      setTxHash(wrapTx);
      setError(null);
      return true;
    } catch (err: unknown) {
      console.error("Wrap error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const unwrap = async (amount: string) => {
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

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.SUSDC);

      console.log("Unwrapping wsToken to sToken...");
      const unwrapTx = await writeContractAsync({
        address: CONTRACTS.wsToken,
        abi: WSTOKEN_ABI,
        functionName: "unwrap",
        args: [amountBigInt],
      });

      await publicClient?.waitForTransactionReceipt({ hash: unwrapTx });
      console.log("Unwrap successful:", unwrapTx);

      setTxHash(unwrapTx);
      setError(null);
      return true;
    } catch (err: unknown) {
      console.error("Unwrap error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setError(null);

  return {
    wrap,
    unwrap,
    isSubmitting,
    error,
    txHash,
    resetError,
  };
}
