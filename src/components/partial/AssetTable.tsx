"use client";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { AssetModal } from "./AssetModal";

export interface AssetTableProps {
  icon: React.ReactNode;
  name: string;
  badge?: React.ReactNode;
  subtitle?: string;
  markets: string;
  tvl: string;
  volume: string;
  bestLong: string;
  bestFixed: string;
}

export function AssetTable(props: AssetTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center bg-gray-500/15 rounded-md px-6 py-3 gap-4 shadow">
        {/* Icon & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            {props.icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-base">
              {props.name}
            </span>
            {props.badge}
          </div>
        </div>

        {/* Markets */}
        <div>
          <span className="bg-blue-900/60 text-blue-400 px-2 py-1 rounded-md text-xs font-semibold">
            {props.markets}
          </span>
        </div>

        {/* TVL & Volume */}
        <div className="text-blue-500 text-sm flex flex-col">
          <span>{props.tvl}</span>
          <span>{props.volume}</span>
        </div>

        {/* Best Long */}
        <div className="text-blue-500 text-sm">{props.bestLong}</div>

        {/* Best Fixed */}
        <div className="text-blue-500 text-sm">{props.bestFixed}</div>

        {/* External Link */}
        <div className="justify-self-end">
          <button
            onClick={openModal}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <ExternalLink className="h-4 w-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Modal */}
      <AssetModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-6">
          {/* Asset Icon & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              {props.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{props.name}</h3>
              <p className="text-white/60">{props.subtitle}</p>
            </div>
          </div>

          {/* Asset Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-500/15 rounded-lg p-4">
              <p className="text-white/60 text-sm">Liquidity Total TVL</p>
              <p className="text-white text-xl font-bold">{props.tvl}</p>
            </div>
            <div className="bg-gray-500/15 rounded-lg p-4">
              <p className="text-white/60 text-sm">24h Volume</p>
              <p className="text-blue-400 text-xl font-bold">{props.volume}</p>
            </div>
            <div className="bg-gray-500/15 rounded-lg p-4">
              <p className="text-white/60 text-sm">Long Yield APY (YT)</p>
              <p className="text-blue-400 text-xl font-bold">
                {props.bestLong}
              </p>
            </div>
            <div className="bg-gray-500/15 rounded-lg p-4">
              <p className="text-white/60 text-sm">Best Fixed (PT)</p>
              <p className="text-blue-400 text-xl font-bold">
                {props.bestFixed}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-4">
            <h4 className="text-white font-semibold mb-2">
              Market Information
            </h4>
            <p className="text-white/70 text-sm">
              {props.markets} • Volume: {props.volume}
            </p>
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
    </>
  );
}
