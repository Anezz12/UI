"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowRightLeft,
  Info,
  Zap,
  Shield,
  TrendingUp,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useBalance } from "wagmi";
import { useSTokenBalance, useWsTokenBalance } from "@/hooks/useTokenBalance";
import { useWrapping } from "@/hooks/useWrapping";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LidoWrapUnwrap() {
  const router = useRouter();
  const pathname = usePathname();
  const [amount, setAmount] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Get sUSDC and wsUSDC balances
  const { formatted: sUSDCBalance, refetch: refetchSToken } =
    useSTokenBalance();
  const {
    formatted: wsUSDCBalance,
    formattedConversionRate,
    refetch: refetchWsToken,
  } = useWsTokenBalance();

  // Wrapping functionality
  const { wrap, unwrap, isSubmitting, error, resetError } = useWrapping();

  const activeTab = pathname === "/wrap/unwrap" ? "unwrap" : "wrap";

  const handleTabChange = (tab: string) => {
    if (tab === "wrap") {
      router.push("/wrap");
    } else {
      router.push("/wrap/unwrap");
    }
  };
  const handleMaxClick = () => {
    if (activeTab === "wrap" && sUSDCBalance) {
      setAmount(sUSDCBalance.replace(/,/g, ""));
    } else if (activeTab === "unwrap" && wsUSDCBalance) {
      setAmount(wsUSDCBalance.replace(/,/g, ""));
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      resetError();
      await open();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const handleWrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    const toastId = toast.loading("Waiting for wallet confirmation...");
    try {
      const success =
        activeTab === "wrap" ? await wrap(amount) : await unwrap(amount);

      if (success) {
        const actionText = activeTab === "wrap" ? "Wrap" : "Unwrap";
        toast.success(`${actionText} successful! Refreshing balance...`, {
          id: toastId,
        });
        setAmount("");
        setTimeout(() => {
          refetchSToken();
          refetchWsToken();
        }, 2000);
      } else {
        // User rejected or transaction failed
        toast.dismiss(toastId);
      }
    } catch (error: unknown) {
      // Check if error is user rejection
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
            ? String((error as { message: unknown }).message)
            : typeof error === "string"
              ? error
              : "";
      const isUserRejection =
        errorMessage.includes("User denied") ||
        errorMessage.includes("User rejected") ||
        errorMessage.includes("user rejected");

      if (!isUserRejection) {
        const actionText = activeTab === "wrap" ? "wrap" : "unwrap";
        toast.error(`Failed to ${actionText}, please try again later.`, {
          id: toastId,
        });
      } else {
        toast.dismiss(toastId);
      }
      console.error("Wrap/Unwrap error:", error);
    }
  };

  useEffect(() => {
    if (error) {
      // Don't show toast for user rejection errors
      const isUserRejection =
        error.includes("User denied") ||
        error.includes("User rejected") ||
        error.includes("user rejected");

      if (!isUserRejection) {
        toast.error(error);
      }
    }
  }, [error]);

  const faqItems = [
    {
      question:
        "What are the risks of engaging with the superCluster protocol?",
      answer:
        "The superCluster protocol carries smart contract risk, slashing risk, and other DeFi-related risks. Our protocol has been audited by multiple security firms, and we maintain insurance coverage to mitigate these risks.",
      icon: Shield,
    },
    {
      question: "What is wsUSDC?",
      answer:
        "wsUSDC is a wrapped version of sUSDC that maintains a fixed balance and uses an internal share system. It's designed to be compatible with DeFi protocols that don't support rebasing tokens.",
      icon: Info,
    },
    {
      question: "How can I get wsUSDC?",
      answer:
        "You can get wsUSDC by wrapping your sUSDC tokens through this interface. The process is simple and only requires one transaction.",
      icon: Zap,
    },
    {
      question: "How can I use wsUSDC?",
      answer:
        "wsUSDC can be used across various DeFi protocols and platforms including lending markets, liquidity pools, and yield farming strategies. It maintains the same value as sUSDC but with a fixed balance.",
      icon: TrendingUp,
    },
  ];

  // Calculate conversion based on real conversion rate
  const calculateWrapReceive = () => {
    if (!amount || !formattedConversionRate) return "0.0000";
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(formattedConversionRate.replace(/,/g, ""));
    if (rateNum === 0) return "0.0000";
    return (amountNum / rateNum).toFixed(4);
  };

  const calculateUnwrapReceive = () => {
    if (!amount || !formattedConversionRate) return "0.0000";
    const amountNum = parseFloat(amount);
    const rateNum = parseFloat(formattedConversionRate.replace(/,/g, ""));
    return (amountNum * rateNum).toFixed(4);
  };

  const wrapDetails = {
    youWillReceive: calculateWrapReceive(),
    maxUnlockCost: "~$0.25",
    maxTransactionCost: "~$0.59",
    exchangeRate: `1 sUSDC = ${
      formattedConversionRate
        ? (1 / parseFloat(formattedConversionRate.replace(/,/g, ""))).toFixed(4)
        : "0.0000"
    } wsUSDC`,
    allowance: "-",
  };

  const unwrapDetails = {
    youWillReceive: calculateUnwrapReceive(),
    maxTransactionCost: "~$0.56",
    exchangeRate: `1 wsUSDC = ${formattedConversionRate || "0.0000"} sUSDC`,
  };

  return (
    <div className="min-h-screen pb-24 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Convert Your Tokens
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Seamlessly wrap and unwrap sUSDC for enhanced DeFi compatibility
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Conversion Panel */}
          <div className="lg:col-span-2">
            {/* Tab Selector */}
            <div className="relative mb-6">
              <div className="flex gap-2 p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <button
                  onClick={() => handleTabChange("wrap")}
                  className={`flex-1 relative py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "wrap"
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}>
                  {activeTab === "wrap" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"></div>
                  )}
                  <span className="relative z-10">Wrap sUSDC</span>
                </button>
                <button
                  onClick={() => handleTabChange("unwrap")}
                  className={`flex-1 relative py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "unwrap"
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}>
                  {activeTab === "unwrap" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl"></div>
                  )}
                  <span className="relative z-10">Unwrap wsUSDC</span>
                </button>
              </div>
            </div>

            {/* Conversion Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
              {/* From Section */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">
                  You send
                </label>
                <div className="relative">
                  <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 overflow-hidden  flex items-center justify-center rounded-full">
                        <Image
                          height={40}
                          width={40}
                          src={
                            activeTab === "wrap" ? "/susdc.png" : "/wsusdc.png"
                          }
                          alt={activeTab === "wrap" ? "sUSDC" : "wsUSDC"}
                          className="rounded-full"
                        />
                      </div>

                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={!isConnected}
                        className="bg-transparent border-none text-3xl font-semibold p-1 focus-visible:ring-0 h-auto text-white placeholder:text-slate-600"
                      />
                    </div>
                    <button
                      onClick={handleMaxClick}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Info - Only show when connected */}
              {isConnected && address && (
                <div className="mb-6 p-6 bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 border border-slate-700/50 rounded-2xl backdrop-blur-sm">
                  <div className="grid grid-cols-1 gap-5">
                    {/* Wallet Address Header */}
                    <div className="pb-4 border-b border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                            <Wallet className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 font-medium block mb-1">
                              Connected Wallet
                            </span>
                            <button
                              onClick={handleCopyAddress}
                              className="flex items-center gap-2 text-sm font-mono text-white hover:text-blue-400 transition-colors group">
                              <span className="font-semibold">
                                {formatAddress(address)}
                              </span>
                              {copied ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Token Balances Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* sUSDC Balance */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-4 bg-slate-900/40 border border-slate-700/30 rounded-xl hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/50">
                              <Image
                                src="/susdc.png"
                                alt="sUSDC"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm text-slate-400 font-medium">
                              sUSDC
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-white">
                              {sUSDCBalance}
                            </div>
                            <div className="text-xs text-slate-500">
                              ≈{" "}
                              {sUSDCBalance && formattedConversionRate
                                ? (
                                    parseFloat(sUSDCBalance.replace(/,/g, "")) /
                                    parseFloat(
                                      formattedConversionRate.replace(/,/g, "")
                                    )
                                  ).toFixed(4)
                                : "0.0000"}{" "}
                              wsUSDC
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* wsUSDC Balance */}
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-4 bg-slate-900/40 border border-slate-700/30 rounded-xl hover:border-cyan-500/30 transition-all">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700/50">
                              <Image
                                src="/wsusdc.png"
                                alt="wsUSDC"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-sm text-slate-400 font-medium">
                              wsUSDC
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-white">
                              {wsUSDCBalance}
                            </div>
                            <div className="text-xs text-slate-500">
                              ≈{" "}
                              {wsUSDCBalance && formattedConversionRate
                                ? (
                                    parseFloat(
                                      wsUSDCBalance.replace(/,/g, "")
                                    ) *
                                    parseFloat(
                                      formattedConversionRate.replace(/,/g, "")
                                    )
                                  ).toFixed(4)
                                : "0.0000"}{" "}
                              sUSDC
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Arrow */}
              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-10 h-10 bg-slate-800 border-2 border-slate-700 rounded-full flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              {/* To Section */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">
                  You receive
                </label>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        height={40}
                        width={40}
                        src={
                          activeTab === "wrap" ? "/wsusdc.png" : "/susdc.png"
                        }
                        alt={activeTab === "wrap" ? "wsUSDC" : "sUSDC"}
                        className="rounded-full"
                      />
                    </div>
                    <div className="text-3xl font-semibold text-white">
                      {activeTab === "wrap"
                        ? wrapDetails.youWillReceive
                        : unwrapDetails.youWillReceive}{" "}
                      <span className="text-slate-400 text-xl">
                        {activeTab === "wrap" ? "wsUSDC" : "sUSDC"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Connect/Wrap Button */}
              {isConnected ? (
                <Button
                  onClick={handleWrap}
                  disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                  {isSubmitting
                    ? activeTab === "wrap"
                      ? "Wrapping..."
                      : "Unwrapping..."
                    : activeTab === "wrap"
                      ? "Wrap sUSDC"
                      : "Unwrap wsUSDC"}
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}

              {/* Transaction Info */}
              <div className="mt-6 space-y-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exchange Rate</span>
                  <span className="text-white font-medium">
                    {activeTab === "wrap"
                      ? wrapDetails.exchangeRate
                      : unwrapDetails.exchangeRate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network Fee</span>
                  <span className="text-white font-medium">
                    {activeTab === "wrap"
                      ? wrapDetails.maxTransactionCost
                      : unwrapDetails.maxTransactionCost}
                  </span>
                </div>
                {activeTab === "wrap" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Unlock Cost</span>
                      <span className="text-white font-medium">
                        {wrapDetails.maxUnlockCost}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400 flex items-center gap-1">
                        Allowance
                        <Info className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-white font-medium">
                        {wrapDetails.allowance}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info Banner */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {activeTab === "wrap" ? "Why Wrap?" : "Why Unwrap?"}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeTab === "wrap"
                      ? "Wrapped sUSDC (wsUSDC) maintains a fixed balance and is compatible with DeFi protocols that don't support rebasing tokens. Perfect for lending, borrowing, and liquidity provision."
                      : "Unwrapping wsUSDC back to sUSDC allows you to receive the rebasing rewards directly in your wallet. Your balance will automatically increase as staking rewards are earned."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Common Questions
              </h3>
              <div className="space-y-3">
                {faqItems.map((item, index) => {
                  const Icon = item.icon;
                  const isExpanded = expandedFaq === index;

                  return (
                    <div
                      key={index}
                      className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-700 transition-colors">
                      <button
                        onClick={() =>
                          setExpandedFaq(isExpanded ? null : index)
                        }
                        className="w-full p-5 text-left flex items-start gap-3 hover:bg-slate-800/30 transition-colors">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm leading-snug">
                            {item.question}
                          </h4>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <p className="text-sm text-slate-400 leading-relaxed pl-11">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
