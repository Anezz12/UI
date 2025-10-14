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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StakePage() {
  const [ethAmount, setEthAmount] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleMaxClick = () => {
    setEthAmount("0.0");
  };

  const stats = {
    apr: "3.3%",
    totalStaked: "8,691,541.703 ETH",
    stakers: "569,385",
    marketCap: "$35,031,698,430",
  };

  const faqItems = [
    {
      question: "What is liquid staking?",
      answer:
        "Liquid staking allows you to stake your ETH and receive a tokenized version (stETH) that represents your staked ETH plus staking rewards. Unlike traditional staking, you can use stETH in DeFi applications while still earning staking rewards.",
      icon: Info,
    },
    {
      question: "How do I receive my staking rewards?",
      answer:
        "Your stETH balance automatically increases daily to reflect your staking rewards. The token is a rebase token, meaning the amount in your wallet grows over time as rewards are earned. You can also track your rewards through the dashboard.",
      icon: TrendingUp,
    },
    {
      question: "Can I unstake my ETH at any time?",
      answer:
        "Yes, you can unstake your ETH at any time. However, there may be a withdrawal queue depending on network conditions. The unstaking process typically takes 1-5 days. You can also swap your stETH for ETH on decentralized exchanges for instant liquidity.",
      icon: Zap,
    },
    {
      question: "What are the risks of staking?",
      answer:
        "The main risks include smart contract risk, slashing risk (validators can lose a portion of stake for misbehavior), and market risk (the value of ETH/stETH can fluctuate). Our protocol has been audited by multiple security firms, and we maintain insurance coverage to mitigate these risks.",
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
        "No, there is no minimum amount required to stake. You can stake any amount of ETH you wish, making it accessible for everyone regardless of their holdings.",
      icon: Info,
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section - Enhanced */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              Liquid Staking Protocol
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Stake & Earn Rewards
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Stake your ETH and receive stETH while earning competitive rewards
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
                8.69M ETH
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
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-xl">
                        Ξ
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={ethAmount}
                        onChange={(e) => setEthAmount(e.target.value)}
                        className="bg-transparent border-none text-3xl font-semibold focus-visible:ring-0 p-0 h-auto text-white placeholder:text-slate-600"
                      />
                    </div>
                    <button
                      onClick={handleMaxClick}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-sm transition-colors">
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* You will receive */}
              <div className="mb-8">
                <label className="text-sm text-slate-400 mb-2 block">
                  You will receive
                </label>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                      st
                    </div>
                    <div className="text-3xl font-semibold text-white">
                      {ethAmount || "0.00"} stETH
                    </div>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40">
                Connect Wallet
              </Button>

              {/* Transaction Info */}
              <div className="mt-6 space-y-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exchange Rate</span>
                  <span className="text-white font-medium">
                    1 ETH = 1 stETH
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Network Fee</span>
                  <span className="text-white font-medium">$0.92</span>
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

            {/* Info Banner */}
            <div className="p-5 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Why Stake with Us?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Stake ETH and receive stETH tokens that represent your
                    staked ETH plus all accrued rewards. Your stETH balance
                    automatically increases daily, and you can use it across
                    DeFi while earning staking yields.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">
                  Protocol Statistics
                </h3>
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  View on Etherscan
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-slate-400 text-xs">APR</span>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {stats.apr}
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-slate-400 text-xs block mb-2">
                    Total Staked
                  </span>
                  <div className="text-2xl font-bold text-white truncate">
                    {stats.totalStaked}
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-slate-400 text-xs block mb-2">
                    Stakers
                  </span>
                  <div className="text-2xl font-bold text-cyan-400">
                    {stats.stakers}
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
                  <span className="text-slate-400 text-xs block mb-2">
                    Market Cap
                  </span>
                  <div className="text-xl font-bold text-white truncate">
                    {stats.marketCap}
                  </div>
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
