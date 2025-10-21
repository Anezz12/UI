import { useCallback, useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { parseUnits, decodeEventLog, type Address } from "viem";

import {
  CONTRACTS,
  TOKEN_DECIMALS,
  isBaseSepolia,
} from "@/contracts/addresses";
import { SUPERCLUSTER_ABI } from "@/contracts/abis/SuperCluster";
import { WITHDRAW_MANAGER_ABI } from "@/contracts/abis/WithdrawManager";

const STORAGE_KEY = "supercluster.selectedPilot";

function resolveSelectedPilot(): Address {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored.startsWith("0x")) {
      return stored as Address;
    }
  }
  return CONTRACTS.pilot as Address;
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "shortMessage" in error &&
    typeof (error as { shortMessage: unknown }).shortMessage === "string"
  ) {
    return (error as { shortMessage: string }).shortMessage;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "An error occurred. Please try again.";
}

export function useWithdrawActions() {
  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { data: sTokenBalance } = useBalance({
    address,
    token: CONTRACTS.sToken,
    query: {
      enabled: Boolean(address),
      refetchInterval: 12_000,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestTxHash, setRequestTxHash] = useState<string | null>(null);
  const [latestRequestId, setLatestRequestId] = useState<string | null>(null);

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const requestWithdraw = useCallback(
    async (amount: string) => {
      if (!isConnected) throw new Error("Wallet is not connected.");
      if (!isBaseSepolia(chainId)) {
        throw new Error("Please switch to Base Sepolia network first.");
      }

      const cleanAmount = amount.trim();
      if (!cleanAmount || Number(cleanAmount) <= 0) {
        throw new Error("Enter a valid amount.");
      }

      const amountBigInt = parseUnits(cleanAmount, TOKEN_DECIMALS.SUSDC);
      const walletBalance = sTokenBalance?.value ?? BigInt(0);
      if (amountBigInt > walletBalance) {
        throw new Error("Amount exceeds your sUSDC balance.");
      }

      setIsSubmitting(true);
      setRequestError(null);
      setRequestTxHash(null);
      setLatestRequestId(null);

      try {
        const pilotAddress = resolveSelectedPilot();

        const txHash = await writeContractAsync({
          address: CONTRACTS.superCluster,
          abi: SUPERCLUSTER_ABI,
          functionName: "withdraw",
          args: [pilotAddress, CONTRACTS.mockUSDC, amountBigInt],
        });

        setRequestTxHash(txHash);

        const receipt = await publicClient?.waitForTransactionReceipt({
          hash: txHash,
        });

        let newRequestId: string | null = null;
        if (receipt) {
          for (const log of receipt.logs) {
            try {
              const decoded = decodeEventLog({
                abi: SUPERCLUSTER_ABI,
                data: log.data,
                topics: log.topics,
              });

              if (decoded.eventName === "TokenWithdrawn") {
                const requestId = decoded.args?.requestId as bigint | undefined;
                const user = decoded.args?.user as `0x${string}` | undefined;

                if (
                  typeof requestId === "bigint" &&
                  user?.toLowerCase() === address?.toLowerCase()
                ) {
                  newRequestId = requestId.toString();
                  break;
                }
              }
            } catch {}
          }
        }

        setLatestRequestId(newRequestId);
        return { txHash, requestId: newRequestId };
      } catch (error) {
        const message = resolveErrorMessage(error);
        setRequestError(message);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isConnected,
      chainId,
      sTokenBalance,
      writeContractAsync,
      publicClient,
      address,
    ]
  );

  const claimWithdraw = useCallback(
    async (requestId: bigint) => {
      if (!isConnected) throw new Error("Wallet is not connected.");
      if (!isBaseSepolia(chainId)) {
        throw new Error("Please switch to Base Sepolia network first.");
      }

      setClaimError(null);
      setClaimingId(requestId.toString());

      try {
        const txHash = await writeContractAsync({
          address: CONTRACTS.withdrawManager,
          abi: WITHDRAW_MANAGER_ABI,
          functionName: "claim",
          args: [requestId],
        });

        await publicClient?.waitForTransactionReceipt({ hash: txHash });
        return txHash;
      } catch (error) {
        const message = resolveErrorMessage(error);
        setClaimError(message);
        throw error;
      } finally {
        setClaimingId(null);
      }
    },
    [isConnected, chainId, writeContractAsync, publicClient]
  );

  const resetRequestState = useCallback(() => {
    setRequestError(null);
    setRequestTxHash(null);
    setLatestRequestId(null);
  }, []);

  const resetClaimState = useCallback(() => {
    setClaimError(null);
    setClaimingId(null);
  }, []);

  return {
    requestWithdraw,
    isSubmitting,
    requestError,
    requestTxHash,
    latestRequestId,
    resetRequestState,
    claimWithdraw,
    claimingId,
    claimError,
    resetClaimState,
    sTokenBalance: sTokenBalance?.formatted ?? "0.00",
  };
}
