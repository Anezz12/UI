"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Info,
  Clock,
  Zap,
  Shield,
  TrendingDown,
  ArrowDownLeft,
  Copy,
  Check,
  FileText,
  Settings,
  CheckCircle2,
  Clock10Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useBalance } from "wagmi";

export default function LidoWithdrawals() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("lido");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // TODO: Get stETH balance from contract
  const stETHBalance = "0.0";

  // TODO: Get pending withdrawal requests count from contract
  const pendingRequests = 2;
  const readyToClaim = 1; // Ready to claim requests

  // Withdrawal mode (Turbo or Bunker)
  const withdrawalMode = "Turbo";

  const activeTab = pathname === "/withdrawals/claim" ? "claim" : "request";

  const handleTabChange = (tab: string) => {
    if (tab === "request") {
      router.push("/withdrawals/request");
    } else {
      router.push("/withdrawals/claim");
    }
  };

  const handleMaxClick = () => {
    if (stETHBalance) {
      setAmount(stETHBalance);
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
      await open();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    try {
      console.log("Withdrawing", amount, "stETH via", selectedMethod);
    } catch (error) {
      console.error("Withdrawal error:", error);
    }
  };

  const faqItems = [
    {
      question: "What are the risks of engaging with the Lido protocol?",
      answer:
        "The Lido protocol carries smart contract risk, slashing risk, and other DeFi-related risks. Our protocol has been audited by multiple security firms, and we maintain insurance coverage to mitigate these risks.",
      icon: Shield,
    },
    {
      question: "What are withdrawals?",
      answer:
        "Withdrawals allow you to exchange your stETH/wstETH back to ETH after a waiting period. You can choose between using Lido's withdrawal queue or swapping on DEXs for instant liquidity.",
      icon: Info,
    },
    {
      question: "How long does withdrawal take?",
      answer:
        "Withdrawal time depends on the exit queue and can range from 1-5 days to several weeks when using Lido. For instant withdrawals, you can use DEXs with minimal slippage.",
      icon: Clock,
    },
    {
      question: "What is the difference between Lido and DEX withdrawals?",
      answer:
        "Lido withdrawals provide 1:1 rate but require waiting time. DEX withdrawals are instant but may have slight slippage depending on market conditions.",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
            <ArrowDownLeft className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              Withdrawal System
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Request Withdrawals
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Request stETH/wstETH withdrawal and claim your ETH
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Withdrawal Panel */}
          <div className="lg:col-span-2">
            {/* Tab Selector */}
            <div className="relative mb-6">
              <div className="flex gap-2 p-1.5 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                <button
                  onClick={() => handleTabChange("request")}
                  className={`flex-1 relative py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "request"
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}>
                  {activeTab === "request" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl"></div>
                  )}
                  <span className="relative z-10">Request</span>
                </button>
                <button
                  onClick={() => handleTabChange("claim")}
                  className={`flex-1 relative py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === "claim"
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}>
                  {activeTab === "claim" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl"></div>
                  )}
                  <span className="relative z-10">Claim</span>
                </button>
              </div>
            </div>

            {activeTab === "request" ? (
              <>
                {/* Withdrawal Card */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm mb-6">
                  {/* Input Section */}
                  <div className="mb-6">
                    <label className="text-sm text-slate-400 mb-2 block">
                      Amount to withdraw
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">
                            st
                          </div>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={!isConnected}
                            className="bg-transparent border-none text-3xl font-semibold focus-visible:ring-0 p-0 h-auto text-white placeholder:text-slate-600"
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

                  {/* Method Selection */}
                  <div className="mb-6">
                    <label className="text-sm text-slate-400 mb-3 block">
                      Withdrawal method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Lido Option */}
                      <button
                        onClick={() => setSelectedMethod("lido")}
                        disabled={!isConnected}
                        className={`p-5 rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedMethod === "lido"
                            ? "border-blue-500 bg-blue-900/20"
                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold text-white">
                              Lido Queue
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedMethod === "lido"
                                ? "border-blue-400"
                                : "border-slate-500"
                            }`}>
                            {selectedMethod === "lido" && (
                              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rate:</span>
                            <span className="text-white font-medium">
                              1 : 1
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Wait time:</span>
                            <span className="text-white font-medium">
                              ~ 10 days
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* DEX Option */}
                      <button
                        onClick={() => setSelectedMethod("dex")}
                        disabled={!isConnected}
                        className={`p-5 rounded-2xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedMethod === "dex"
                            ? "border-cyan-500 bg-cyan-900/20"
                            : "border-slate-700 bg-slate-800/30 hover:border-slate-600"
                        }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-cyan-400" />
                            <span className="font-semibold text-white">
                              DEX Swap
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedMethod === "dex"
                                ? "border-cyan-400"
                                : "border-slate-500"
                            }`}>
                            {selectedMethod === "dex" && (
                              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Rate:</span>
                            <span className="text-white font-medium">
                              1 : 0.9994
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Wait time:</span>
                            <span className="text-white font-medium">
                              ~ 1-5 min
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Wallet Info - Only show when connected */}
                  {isConnected && address && (
                    <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* stETH Balance */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                              <span className="text-[8px] font-bold text-white">
                                st
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                              stETH balance
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {stETHBalance} stETH
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="space-y-1">
                          <span className="text-xs text-slate-400 font-medium block">
                            Wallet Address
                          </span>
                          <button
                            onClick={handleCopyAddress}
                            className="flex items-center gap-2 text-sm font-mono text-white hover:text-blue-400 transition-colors group">
                            <span>{formatAddress(address)}</span>
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </div>

                        {/* My Requests */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-slate-400 font-medium">
                              My requests
                            </span>
                          </div>
                          <TooltipProvider>
                            <div className="flex items-center gap-3">
                              {/* Ready to Claim */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-help">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    <span className="text-2xl font-bold text-white">
                                      {readyToClaim.toString().padStart(2, "0")}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 border-slate-700">
                                  <p className="text-sm text-white font-medium">
                                    Ready to claim
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Click to view claimable requests
                                  </p>
                                </TooltipContent>
                              </Tooltip>

                              {/* Divider */}
                              <div className="h-8 w-px bg-slate-600"></div>

                              {/* Pending */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center gap-2 cursor-help">
                                    <Clock10Icon className="w-5 h-5 text-amber-400" />
                                    <span className="text-2xl font-bold text-white">
                                      {pendingRequests
                                        .toString()
                                        .padStart(2, "0")}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 border-slate-700">
                                  <p className="text-sm text-white font-medium">
                                    Pending requests
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Waiting in withdrawal queue
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </div>

                        {/* Withdrawals Mode */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-slate-400 font-medium">
                              Withdrawals mode
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-cyan-400">
                              {withdrawalMode}
                            </span>
                            {withdrawalMode === "Turbo" && (
                              <div className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs font-semibold text-cyan-400">
                                FAST
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* You will receive */}
                  <div className="mb-8">
                    <label className="text-sm text-slate-400 mb-2 block">
                      You will receive
                    </label>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-xl">
                          Ξ
                        </div>
                        <div className="text-3xl font-semibold text-white">
                          {selectedMethod === "lido"
                            ? amount || "0.00"
                            : amount
                              ? (parseFloat(amount) * 0.9994).toFixed(4)
                              : "0.00"}{" "}
                          ETH
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connect/Withdraw Button */}
                  {isConnected ? (
                    <Button
                      onClick={handleWithdraw}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                      {selectedMethod === "lido"
                        ? "Request Withdrawal"
                        : "Swap on DEX"}
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
                      <span className="text-slate-400">Unlock Cost</span>
                      <span className="text-green-400 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Network Fee</span>
                      <span className="text-white font-medium">$2.09</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Exchange Rate</span>
                      <span className="text-white font-medium">
                        {selectedMethod === "lido"
                          ? "1 stETH = 1 ETH"
                          : "1 stETH = 0.9994 ETH"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="p-5 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Info className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        Choose Your Method
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {selectedMethod === "lido"
                          ? "Lido queue provides 1:1 rate but requires ~10 days waiting time. Perfect for larger amounts without slippage."
                          : "DEX swap is instant (1-5 minutes) but may have slight slippage. Best for urgent withdrawals and smaller amounts."}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 backdrop-blur-sm text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                  <Info className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Pending Requests
                </h3>
                <p className="text-slate-400 mb-8">
                  Connect your wallet to view withdrawal requests
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-500/25">
                  Connect Wallet
                </Button>
              </div>
            )}
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
