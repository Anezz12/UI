"use client";
import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FiltersBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const CATEGORIES = [
  "All Categories",
  "DeFi",
  "NFT",
  "Gaming",
  "Infrastructure",
];

export function FiltersBar({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setShowFilters,
}: FiltersBarProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleClearFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
    setShowFilters(false);
  };

  return (
    <div className="border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="px-4 py-2 rounded-lg bg-[#1a1b26] text-gray-300 hover:bg-[#252633] transition-colors flex items-center gap-2">
              {selectedCategory}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full mt-1 left-0 bg-[#1a1b26] border border-gray-700 rounded-lg shadow-lg z-10 min-w-[160px]">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#252633] transition-colors text-gray-300 first:rounded-t-lg last:rounded-b-lg">
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
            Clear Filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1a1b26] rounded-lg text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
