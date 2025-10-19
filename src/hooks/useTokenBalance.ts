import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useMemo } from "react";
import { CONTRACTS, TOKEN_DECIMALS } from "@/contracts/addresses";
import { STOKEN_ABI } from "@/contracts/abis/SToken";

export function useUSDCBalance() {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading,
    refetch,
  } = useBalance({
    address,
    token: CONTRACTS.mockUSDC,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });

  const formatted = useMemo(() => {
    if (!balance) return "0.00";

    const numericValue = Number(balance.formatted);

    return numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }, [balance]);

  return {
    balance,
    formatted,
    isLoading,
    refetch,
    raw: balance?.value ?? BigInt(0),
  };
}

export function useSTokenBalance() {
  const { address } = useAccount();

  // Get sToken address from SuperCluster
  const { data: sTokenAddress } = useReadContract({
    address: CONTRACTS.superCluster,
    abi: [
      {
        type: "function",
        name: "sToken",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
      },
    ] as const,
    functionName: "sToken",
  });

  // Get decimals
  const { data: decimals } = useReadContract({
    address: sTokenAddress,
    abi: STOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: Boolean(sTokenAddress),
    },
  });

  // Get balance
  const { data: rawBalance, refetch } = useReadContract({
    address: sTokenAddress,
    abi: STOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && sTokenAddress),
      refetchInterval: 10000,
    },
  });

  const formatted = useMemo(() => {
    if (!rawBalance || decimals == null) return "0.00";

    const numericValue = Number(formatUnits(rawBalance, decimals));

    return numericValue.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }, [rawBalance, decimals]);

  return {
    balance: rawBalance ?? BigInt(0),
    formatted,
    decimals: decimals ?? TOKEN_DECIMALS.SUSDC,
    sTokenAddress,
    refetch,
  };
}
