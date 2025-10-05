"use client";
import { useState } from "react";
import { CardDemo } from "@/components/Card";
import { AssetTable } from "@/components/Home/AssetTable";
import { FiltersBar } from "@/components/Home/FiltersBar";

const mockAssets = [
  {
    id: "1",
    name: "Uniswap",
    symbol: "UNI",
    chain: "Ethereum",
    logo: "/usde.svg",
    category: "DeFi",
    totalLiquidity: 1000000,
    tvl: "$1.5B",
    volume24h: "$500M",
    apy: "12.5%",
    pools: 150,
    totalTVL: 1500000000,
    total24hVol: 500000000,
    bestLongYieldAPY: 12.5,
    bestFixedAPY: 10.0,
    markets: [],
    marketsCount: 0,
  },
  {
    id: "2",
    name: "OpenSea",
    symbol: "OS",
    chain: "Ethereum",
    logo: "/usde.svg",
    category: "NFT",
    totalLiquidity: 2000000,
    tvl: "$2.0B",
    volume24h: "$300M",
    apy: "8.2%",
    pools: 75,
    totalTVL: 2000000000,
    total24hVol: 300000000,
    bestLongYieldAPY: 8.2,
    bestFixedAPY: 7.5,
    markets: [],
    marketsCount: 0,
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [expandedAssets, setExpandedAssets] = useState<string[]>([]);

  const toggleAssetExpansion = (assetId: string) => {
    setExpandedAssets((prev) => {
      if (prev.includes(assetId)) {
        return prev.filter((id) => id !== assetId);
      } else {
        return [...prev, assetId];
      }
    });
  };

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      asset.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <CardDemo />
        <CardDemo />
        <CardDemo />
      </div>
      {/* <div className="mt-12">
        <Table />
      </div> */}
      <div>
        <FiltersBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <AssetTable
          assets={filteredAssets}
          expandedAssets={expandedAssets}
          toggleAssetExpansion={toggleAssetExpansion}
        />
      </div>
    </div>
  );
}
