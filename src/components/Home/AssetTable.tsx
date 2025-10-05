"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { AssetModal } from "../partial/AssetModal";
import Image from "next/image";

interface Market {
  id: string;
  name: string;
  tvl: string;
  apy: string;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  logo: string;
  category: string;
  totalLiquidity: number;
  tvl: string;
  volume24h: string;
  apy: string;
  pools: number;
  totalTVL: number;
  total24hVol: number;
  bestLongYieldAPY: number;
  bestFixedAPY: number;
  markets: Market[];
  marketsCount: number;
}

interface AssetTableProps {
  assets: Asset[];
  expandedAssets: string[];
  toggleAssetExpansion: (assetId: string) => void;
}

type SortField = "name" | "markets" | "tvl" | "bestLong" | "bestFixed";
type SortDirection = "asc" | "desc" | null;

export function AssetTable({
  assets,
  expandedAssets,
  toggleAssetExpansion,
}: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const openModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
      );
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="w-3 h-3 ml-1" />;
    }
    return <ArrowDown className="w-3 h-3 ml-1" />;
  };

  return (
    <>
      <div className="space-y-2">
        {/* Table Header */}
        <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center bg-gray-800/50 rounded-t-xl px-6 py-3 gap-4 border-b border-gray-700/50">
          {/* Name Column */}
          <div
            className="group cursor-pointer flex items-center text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("name")}>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Asset Name
            </span>
            {getSortIcon("name")}
          </div>

          {/* Markets Column */}
          <div
            className="group cursor-pointer flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("markets")}>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Markets
            </span>
            {getSortIcon("markets")}
          </div>

          {/* TVL & Volume Column */}
          <div
            className="group cursor-pointer flex items-center justify-end text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("tvl")}>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold uppercase tracking-wider">
                TVL
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                24H Volume
              </span>
            </div>
            {getSortIcon("tvl")}
          </div>

          {/* Best Long APY Column */}
          <div
            className="group cursor-pointer flex items-center justify-end text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("bestLong")}>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Long APY
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">YT</span>
            </div>
            {getSortIcon("bestLong")}
          </div>

          {/* Best Fixed APY Column */}
          <div
            className="group cursor-pointer flex items-center justify-end text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("bestFixed")}>
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Fixed APY
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">PT</span>
            </div>
            {getSortIcon("bestFixed")}
          </div>

          {/* Actions Column */}
          <div className="flex items-center justify-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Actions
            </span>
          </div>
        </div>

        {/* Table Body */}
        {assets.map((asset) => {
          const isExpanded = expandedAssets.includes(asset.id);

          return (
            <div key={asset.id} className="space-y-2">
              {/* Main Row */}
              <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center bg-gray-500/15 hover:bg-gray-500/20 rounded-md px-6 py-3 gap-4 shadow transition-colors">
                {/* Icon & Name */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    <Image
                      src={asset.logo}
                      alt={asset.name}
                      className="w-6 h-6"
                      height={24}
                      width={24}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base">
                      {asset.name}
                    </span>
                    <span className="text-white/60 text-sm">
                      {asset.symbol}
                    </span>
                    <span className="bg-purple-900/60 text-purple-400 px-2 py-0.5 rounded text-xs">
                      {asset.chain}
                    </span>
                  </div>
                </div>

                {/* Markets */}
                <div className="flex justify-center">
                  <span className="bg-blue-900/60 text-blue-400 px-2 py-1 rounded-md text-xs font-semibold">
                    {asset.marketsCount || asset.pools} Markets
                  </span>
                </div>

                {/* TVL & Volume */}
                <div className="text-right">
                  <div className="text-blue-500 text-sm font-medium">
                    {asset.tvl}
                  </div>
                  <div className="text-white/60 text-xs mt-0.5">
                    {asset.volume24h}
                  </div>
                </div>

                {/* Best Long */}
                <div className="text-right">
                  <div className="text-blue-500 text-sm font-medium">
                    {asset.bestLongYieldAPY}%
                  </div>
                </div>

                {/* Best Fixed */}
                <div className="text-right">
                  <div className="text-blue-500 text-sm font-medium">
                    {asset.bestFixedAPY}%
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-self-end">
                  <button
                    onClick={() => openModal(asset)}
                    className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                    title="View Details">
                    <ExternalLink className="h-4 w-4 text-white/60" />
                  </button>
                  {asset.markets && asset.markets.length > 0 && (
                    <button
                      onClick={() => toggleAssetExpansion(asset.id)}
                      className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                      title={isExpanded ? "Collapse" : "Expand"}>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-white/60" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/60" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Markets */}
              {isExpanded && asset.markets && asset.markets.length > 0 && (
                <div className="ml-16 space-y-1">
                  {asset.markets.map((market) => (
                    <div
                      key={market.id}
                      className="bg-gray-500/10 hover:bg-gray-500/15 rounded-md px-6 py-2 text-sm text-white/80 flex justify-between items-center transition-colors">
                      <span>{market.name}</span>
                      <div className="flex gap-4">
                        <span className="text-blue-400">{market.tvl}</span>
                        <span className="text-green-400">{market.apy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAsset && (
        <AssetModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="space-y-6">
            {/* Asset Icon & Name */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <Image
                  src={selectedAsset.logo}
                  alt={selectedAsset.name}
                  className="w-10 h-10"
                  height={40}
                  width={40}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedAsset.name}
                </h3>
                <p className="text-white/60">
                  {selectedAsset.symbol} • {selectedAsset.chain} •{" "}
                  {selectedAsset.category}
                </p>
              </div>
            </div>

            {/* Asset Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-500/15 rounded-lg p-4">
                <p className="text-white/60 text-sm">Liquidity Total TVL</p>
                <p className="text-white text-xl font-bold">
                  {selectedAsset.tvl}
                </p>
              </div>
              <div className="bg-gray-500/15 rounded-lg p-4">
                <p className="text-white/60 text-sm">24h Volume</p>
                <p className="text-blue-400 text-xl font-bold">
                  {selectedAsset.volume24h}
                </p>
              </div>
              <div className="bg-gray-500/15 rounded-lg p-4">
                <p className="text-white/60 text-sm">Long Yield APY (YT)</p>
                <p className="text-blue-400 text-xl font-bold">
                  {selectedAsset.bestLongYieldAPY}%
                </p>
              </div>
              <div className="bg-gray-500/15 rounded-lg p-4">
                <p className="text-white/60 text-sm">Best Fixed (PT)</p>
                <p className="text-blue-400 text-xl font-bold">
                  {selectedAsset.bestFixedAPY}%
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-500/15 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">
                Market Information
              </h4>
              <div className="space-y-1 text-white/70 text-sm">
                <p>Total Pools: {selectedAsset.pools}</p>
                <p>Category: {selectedAsset.category}</p>
                <p>Average APY: {selectedAsset.apy}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-900 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Trade
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                View More
              </button>
            </div>
          </div>
        </AssetModal>
      )}
    </>
  );
}
