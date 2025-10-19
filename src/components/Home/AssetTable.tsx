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
  pools: number;
  bestFixedAPY: number;
  markets: Market[];
  marketsCount: number;
  address: `0x${string}`;
  status?: string;
  focus?: string;
  description?: string;
}

interface AssetTableProps {
  assets: Asset[];
  expandedAssets: string[];
  toggleAssetExpansion: (assetId: string) => void;
  selectedPilotId?: string;
  onSelectPilot?: (asset: Asset) => void;
}

type SortField = "name" | "markets" | "tvl" | "bestLong" | "bestFixed";
type SortDirection = "asc" | "desc" | null;

export function AssetTable({
  assets,
  expandedAssets,
  toggleAssetExpansion,
  selectedPilotId,
  onSelectPilot,
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
      <div className="space-y-2 md:px-0">
        {/* Desktop Table Header */}
        <div className="hidden md:grid w-full grid-cols-[2fr_1fr_1fr_auto] items-center bg-gray-800/50 rounded-t-xl px-6 py-4 gap-4 border-b border-gray-700/50">
          {/* Name Column */}
          <div
            className="group cursor-pointer flex items-center text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("name")}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Asset Name
            </span>
            {getSortIcon("name")}
          </div>

          {/* Markets Column */}
          <div
            className="group cursor-pointer flex items-center justify-start text-gray-400 hover:text-gray-200 transition-colors"
            onClick={() => handleSort("markets")}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Markets
            </span>
            {getSortIcon("markets")}
          </div>

          {/* Actions Column */}
          <div className="flex items-center justify-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Actions
            </span>
          </div>
        </div>

        {/* Table Body */}
        {assets.map((asset) => {
          const isSelected = selectedPilotId === asset.id;
          const isExpanded = expandedAssets.includes(asset.id);

          return (
            <div key={asset.id} className="space-y-2">
              {/* Desktop Row */}
              <div
                className={`hidden md:grid w-full grid-cols-[2fr_1fr_1fr_auto] items-center rounded-md px-6 py-3 gap-4 shadow transition-colors ${
                  isSelected
                    ? "bg-cyan-500/15 border border-cyan-500/40"
                    : "bg-gray-500/15 hover:bg-gray-500/20 border border-transparent"
                }`}
              >
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
                <div className="flex justify-start">
                  <span className="bg-blue-900/60 text-blue-400 px-2 py-1 rounded-md text-xs font-semibold">
                    {asset.marketsCount || asset.pools} Markets
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-start">
                  <button
                    onClick={() => openModal(asset)}
                    className="hover:bg-white/10 p-2 rounded-xl transition-colors"
                    title="View Details"
                  >
                    <ExternalLink className="h-4 w-4 text-white/60" />
                  </button>
                  {asset.markets && asset.markets.length > 0 && (
                    <button
                      onClick={() => toggleAssetExpansion(asset.id)}
                      className="hover:bg-white/10 p-2 rounded-xl transition-colors"
                      title={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-white/60" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/60" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Card */}
              <div
                className={`md:hidden rounded-xl p-4 shadow ${
                  isSelected
                    ? "bg-cyan-500/15 border border-cyan-500/40"
                    : "bg-gray-500/15"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <Image
                        src={asset.logo}
                        alt={asset.name}
                        className="w-7 h-7"
                        height={28}
                        width={28}
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-base">
                          {asset.name}
                        </span>
                        <span className="text-white/60 text-sm">
                          {asset.symbol}
                        </span>
                      </div>
                      <span className="bg-purple-900/60 text-purple-400 px-2 py-0.5 rounded text-xs inline-block w-fit">
                        {asset.chain}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(asset)}
                    className="hover:bg-white/10 p-2 rounded-xl transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4 text-white/60" />
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-800/30 rounded-xl p-2.5">
                    <p className="text-gray-400 text-xs mb-1">Markets</p>
                    <p className="text-blue-400 text-sm font-medium">
                      {asset.marketsCount || asset.pools}
                    </p>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-2.5">
                    <p className="text-gray-400 text-xs mb-1">Fixed APY (PT)</p>
                    <p className="text-blue-500 text-sm font-medium">
                      {asset.bestFixedAPY}%
                    </p>
                  </div>
                </div>

                {/* Expand Button */}
                {asset.markets && asset.markets.length > 0 && (
                  <button
                    onClick={() => toggleAssetExpansion(asset.id)}
                    className="w-full bg-gray-800/40 hover:bg-gray-800/60 py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-white/80 text-sm"
                  >
                    {isExpanded ? "Hide Markets" : "Show Markets"}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>

              {/* Expanded Markets - Works for both Desktop and Mobile */}
              {isExpanded && asset.markets && asset.markets.length > 0 && (
                <div className="md:ml-16 space-y-1">
                  {asset.markets.map((market) => (
                    <div
                      key={market.id}
                      className="bg-gray-500/10 hover:bg-gray-500/15 rounded-md px-4 md:px-6 py-2 md:py-2 text-sm text-white/80 transition-colors"
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:flex justify-between items-center">
                        <span>{market.name}</span>
                        <div className="flex gap-4">
                          <span className="text-blue-400">{market.tvl}</span>
                          <span className="text-green-400">{market.apy}</span>
                        </div>
                      </div>
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <p className="font-medium mb-1">{market.name}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-400">
                            TVL: {market.tvl}
                          </span>
                          <span className="text-green-400">
                            APY: {market.apy}
                          </span>
                        </div>
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
                {selectedAsset.status && (
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mt-1">
                    {selectedAsset.status}
                  </p>
                )}
              </div>
            </div>

            {/* Asset Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-500/15 rounded-xl p-4">
                <p className="text-white/60 text-sm">Best Fixed (PT)</p>
                <p className="text-blue-400 text-xl font-bold">
                  {selectedAsset.bestFixedAPY}%
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-500/15 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">
                Market Information
              </h4>
              <div className="space-y-1 text-white/70 text-sm">
                <p>Total Pools: {selectedAsset.pools}</p>
                <p>Category: {selectedAsset.category}</p>
                {selectedAsset.focus && <p>Focus: {selectedAsset.focus}</p>}
                <p className="break-words">
                  Address:{" "}
                  <span className="font-mono text-xs text-white">
                    {selectedAsset.address}
                  </span>
                </p>
                {selectedAsset.description && (
                  <p className="pt-2 text-white/60">
                    {selectedAsset.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 py-3 px-6 hover:from-blue-700 text-white font-medium text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={() => {
                  onSelectPilot?.(selectedAsset);
                  closeModal();
                }}
                disabled={selectedPilotId === selectedAsset.id}
              >
                {selectedPilotId === selectedAsset.id
                  ? "Selected Pilot"
                  : "Select Pilot"}
              </button>
              <button
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(selectedAsset.address).catch(
                      (error) => {
                        console.error("Failed to copy pilot address", error);
                      }
                    );
                  }
                }}
              >
                Copy Address
              </button>
            </div>
          </div>
        </AssetModal>
      )}
    </>
  );
}
