"use client";
import { useState } from "react";
import {
  Info,
  ExternalLink,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Sparkles,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { useUSDCBalance, useSTokenBalance } from "@/hooks/useTokenBalance";
import { useStaking } from "@/hooks/useStaking";

export default function StakePage() {
  const [usdcAmount, setUsdcAmount] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();

  const { formatted: usdcBalance, refetch: refetchUSDC } = useUSDCBalance();
  const { formatted: sUSDCBalance, refetch: refetchSToken } =
    useSTokenBalance();

  // const { address, isConnected, isConnecting, chainId } = useAccount();
  // const {
  //   formatted: usdcBalance,
  //   refetch: refetchUSDC,
  //   raw: rawUSDCBalance,
  // } = useUSDCBalance();
  // const {
  //   formatted: sUSDCBalance,
  //   refetch: refetchSToken,
  //   balance: rawSUSDCBalance,
  //   sTokenAddress,
  // } = useSTokenBalance();

  const { stake, isSubmitting, error, resetError } = useStaking();

  const handleMaxClick = () => {
    setUsdcAmount(usdcBalance);
  };

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const stats = {
    apr: "3.3%",
    totalStaked: "8,691,541.703 USDC",
    stakers: "569,385",
    marketCap: "$35,031,698,430",
  };

  const handleConnect = async () => {
    try {
      resetError();
      await open();
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  const handleStake = async () => {
    const success = await stake(usdcAmount);
    if (success) {
      setUsdcAmount("");
      setTimeout(() => {
        refetchUSDC();
        refetchSToken();
      }, 2000);
    }
  };

  // useEffect(() => {
  //   console.log("=== WALLET INFO ===");
  //   console.log("Address:", address);
  //   console.log("Is Connected:", isConnected);
  //   console.log("Is Connecting:", isConnecting);
  //   console.log("Chain ID:", chainId);
  //   console.log(
  //     "Chain Name:",
  //     chainId === 84532
  //       ? "Base Sepolia"
  //       : chainId === 11155111
  //         ? "Sepolia"
  //         : "Unknown"
  //   );
  //   console.log("USDC Balance (formatted):", usdcBalance);
  //   console.log("USDC Balance (raw):", rawUSDCBalance?.toString());
  //   console.log("sUSDC Balance (formatted):", sUSDCBalance);
  //   console.log("sUSDC Balance (raw):", rawSUSDCBalance?.toString());
  //   console.log("sToken Address:", sTokenAddress);
  //   console.log("==================");
  // }, [
  //   address,
  //   isConnected,
  //   chainId,
  //   usdcBalance,
  //   sUSDCBalance,
  //   rawUSDCBalance,
  //   rawSUSDCBalance,
  //   sTokenAddress,
  // ]);

  const faqItems = [
    {
      question: "What is liquid staking?",
      answer:
        "Liquid staking allows you to stake your USDC and receive a tokenized version (sUSDC) that represents your staked USDC plus staking rewards. Unlike traditional staking, you can use sUSDC in DeFi applications while still earning staking rewards.",
      icon: Info,
    },
    {
      question: "How do I receive my staking rewards?",
      answer:
        "Your sUSDC balance automatically increases daily to reflect your staking rewards. The token is a rebase token, meaning the amount in your wallet grows over time as rewards are earned. You can also track your rewards through the dashboard.",
      icon: TrendingUp,
    },
    {
      question: "Can I unstake my USDC at any time?",
      answer:
        "Yes, you can unstake your USDC at any time. However, there may be a withdrawal queue depending on network conditions. The unstaking process typically takes 1-5 days. You can also swap your sUSDC for USDC on decentralized exchanges for instant liquidity.",
      icon: Zap,
    },
    {
      question: "What are the risks of staking?",
      answer:
        "The main risks include smart contract risk, slashing risk (validators can lose a portion of stake for misbehavior), and market risk (the value of USDC/sUSDC can fluctuate). Our protocol has been audited by multiple security firms, and we maintain insurance coverage to mitigate these risks.",
      icon: Shield,
    },
    {
      question: "What is the reward fee?",
      answer:
        "A 10% fee is applied to your staking rewards to cover protocol maintenance, development, and validator operations. This means if you earn 3.3% APR, the protocol takes 10% of that reward, and you receive the remaining 90%. The fee is automatically deducted from your rewards.",
      icon: Award,
    },
    {
      question: "Is there a minimum staking amount?",
      answer:
        "No, there is no minimum amount required to stake. You can stake any amount of USDC you wish, making it accessible for everyone regardless of their holdings.",
      icon: Info,
    },
  ];

  return (
    <div className="min-h-screen pb-12 text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Stake & Earn Rewards
            </span>
          </h1>

          <p className="text-md text-slate-400 max-w-2xl mx-auto mb-8">
            Stake your USDC and receive sUSDC while earning competitive rewards
          </p>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-sm">
              <span className="text-xs text-slate-400">APR:</span>{" "}
              <span className="text-sm font-semibold text-blue-400">
                {stats.apr}
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-sm">
              <span className="text-xs text-slate-400">Total Staked:</span>{" "}
              <span className="text-sm font-semibold text-cyan-400">
                8.69M USDC
              </span>
            </div>
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-sm">
              <span className="text-xs text-slate-400">Stakers:</span>{" "}
              <span className="text-sm font-semibold text-blue-400">569K+</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Staking Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Staking Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
              {/* Input Section */}
              <div className="mb-6">
                <label className="text-sm text-slate-400 mb-2 block">
                  Amount to stake
                </label>
                <div className="relative">
                  <div className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-sm">
                        USDC
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={usdcAmount}
                        onChange={(e) => setUsdcAmount(e.target.value)}
                        disabled={!isConnected || isSubmitting}
                        className="bg-transparent border-none text-3xl font-semibold focus-visible:ring-0 p-0 h-auto text-white placeholder:text-slate-600 disabled:opacity-50"
                      />
                    </div>
                    <button
                      onClick={handleMaxClick}
                      disabled={!isConnected || isSubmitting}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Wallet Info - Only show when connected */}
              {isConnected && address && (
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Available to stake */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400 font-medium">
                          Available to stake
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {usdcBalance} USDC
                      </div>
                    </div>

                    {/* Staked amount */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-slate-400 font-medium">
                          Staked amount
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {sUSDCBalance} sUSDC
                      </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 font-medium block">
                        Wallet Address
                      </span>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center gap-2 text-sm font-mono text-white hover:text-blue-400 transition-colors group"
                      >
                        <span>{formatAddress(address)}</span>
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </div>

                    {/* APR */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">
                          sUSDC APR
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">
                        {stats.apr}
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-sm">
                      sUSDC
                    </div>
                    <div className="text-3xl font-semibold text-white">
                      {usdcAmount || "0.00"} sUSDC
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

              {/* Connect/Stake Button */}
              {isConnected ? (
                <Button
                  onClick={handleStake}
                  disabled={
                    !usdcAmount || parseFloat(usdcAmount) <= 0 || isSubmitting
                  }
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? "Staking..." : "Stake Now"}
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}

              {/* Transaction Info */}
              <div className="mt-6 space-y-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exchange Rate</span>
                  <span className="text-white font-medium">
                    1 USDC = 1 sUSDC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network Fee</span>
                  <span className="text-white font-medium">~$0.92</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-1">
                    Reward Fee
                    <Info className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-white font-medium">10%</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-400">Total Staked</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.totalStaked}
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-400">Active Stakers</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.stakers}</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-400">Market Cap</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.marketCap}
                </p>
              </div>
            </div>

            {/* Info Banner */}
            <div className="p-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    How does it work?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    When you stake USDC, you receive sUSDC tokens that represent
                    your staked USDC plus all accrued rewards. Your sUSDC
                    balance automatically increases daily as you earn staking
                    rewards.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    Learn more about liquid staking
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-gray-300">
                Common Questions
              </h3>
              <div className="space-y-3">
                {faqItems.map((item, index) => {
                  const Icon = item.icon;
                  const isExpanded = expandedFaq === index;

                  return (
                    <div
                      key={index}
                      className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-700 transition-colors"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(isExpanded ? null : index)
                        }
                        className="w-full p-5 text-left flex items-start gap-3 hover:bg-slate-800/30 transition-colors"
                      >
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
