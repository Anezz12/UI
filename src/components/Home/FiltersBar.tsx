"use client";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const handleClearFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
    setShowFilters(false);
  };

  return (
    <div className=" border-gray-800 pb-6 pt-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-[#1a1b26] border-gray-700 text-gray-300 hover:bg-[#252633] focus:ring-blue-500">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1b26] border-gray-700">
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-300 focus:bg-[#252633] focus:text-blue-500">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-blue-400 hover:text-blue-300 hover:bg-transparent text-sm px-0">
            Clear Filters
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search name or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1a1b26] border-gray-700 text-gray-300 placeholder:text-gray-500 rounded-lg text-sm w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
