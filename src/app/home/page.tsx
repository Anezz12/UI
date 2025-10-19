"use client";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SuperclusterAnimation from "@/components/SpaceGalaxy";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Total Value Locked", value: "$8.69M" },
    { label: "Active Users", value: "569K+" },
    { label: "Current APR", value: "3.3%" },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Liquid Savings",
      description:
        "Stake your USDC and receive sUSDC tokens that remain fully liquid across DeFi.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Instant Liquidity",
      description:
        "No lock-up periods. Your sUSDC stays tradable with complete flexibility.",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Secure & Audited",
      description:
        "Built with OpenZeppelin standards, integrated with Aave V3 and Morpho Blue.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  const steps = [
    { title: "Deposit USDC", desc: "Stake any amount with no minimum" },
    { title: "Receive sUSDC", desc: "Get liquid tokens that accrue yields" },
    { title: "Use Across DeFi", desc: "Deploy while earning rewards" },
  ];

  return (
    <div className=" text-white overflow-hidden">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-start">
        <div className="grid lg:grid-cols-2 -mt-14 gap-12 items-center">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold mb-">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Liquid <br /> Stablecoin
              </span>
              <br />
              <span className="text-white">Savings Protocol</span>
            </h1>

            <p className="text-xl md:text-2xl text-start text-slate-400 max-w-3xl mb-12 mt-4">
              Earn yields on your USDC while maintaining full liquidity and
              composability across DeFi ecosystems
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button className="h-16 px-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-lg rounded-xl transition-colors duration-300 transform">
                Deposit Now
              </Button>
              <Button
                variant="outline"
                className="h-16 px-10 bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:text-blue-500 text-white font-medium text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Read Docs
              </Button>
            </div>
          </div>
          <div className="flex justify-end items-end">
            <SuperclusterAnimation />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
              style={{
                opacity: Math.max(0, 1 - scrollY / 10000),
                transform: `translateY(${scrollY * 0.01}px)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 transition-opacity duration-300" />
              <div className="relative bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-xl">
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Why{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              SuperCluster
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built for the next generation of DeFi users who demand both yield
            and flexibility
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 transition-all duration-500`}
                />
                <div className="relative bg-slate-900/50 border border-slate-800  rounded-xl p-8 backdrop-blur-xl hover:border-white/20 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Traditional savings sacrifice liquidity
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-6">
            When you deposit funds to earn yields, your assets become locked or
            limited in use. Liquid staking protocols focus only on ETH, leaving
            stablecoin holders behind.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed">
            Billions in stablecoins sit idle, earning minimal returns with
            limited control.
          </p>
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Earn while staying{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              100% liquid
            </span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-6">
            SuperCluster provides true liquid stablecoin savings. Your sUSDC
            remains fully tradable and composable across DeFi.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900/30 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">No Lock-ups</h4>
                <p className="text-slate-400">Withdraw anytime, instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900/30 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">
                  Full Composability
                </h4>
                <p className="text-slate-400">Use sUSDC across any protocol</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900/30 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">
                  Auto-Compounding
                </h4>
                <p className="text-slate-400">Yields accrue automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Battle-Tested{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Technology
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built on proven foundations with security at the core
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-10 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-8 text-white">
              Core Infrastructure
            </h3>
            <div className="space-y-6">
              {[
                "Foundry & Solidity for maximum security",
                "OpenZeppelin smart contract standards",
                "Rebasing token mechanism",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-md font-semibold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-slate-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-gray-800 rounded-xl p-10 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-8 text-white">
              Protocol Integration
            </h3>
            <div className="space-y-6">
              {[
                "Aave V3 lending optimization",
                "Morpho Blue peer-to-peer efficiency",
                "Modular architecture for expansion",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-md font-semibold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-slate-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              SuperCluster
            </h3>
            <p className="text-slate-400 leading-relaxed max-w-md">
              The liquid stablecoin savings protocol enabling productive and
              flexible DeFi participation for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                App
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Docs
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Security
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Audits
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Twitter
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Discord
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                GitHub
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Blog
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-slate-400">
          © 2025 SuperCluster Protocol. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
