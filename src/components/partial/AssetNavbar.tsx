"use client";
import React, { useState } from "react";
import {
  WalletIcon,
  Bars3Icon,
  ClipboardDocumentIcon,
  ArrowTopRightOnSquareIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface NavLink {
  name: string;
  href: string;
  active?: boolean;
  dropdown?: { label: string; items: { name: string; href: string }[] };
}

interface NavbarProps {
  links: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [error, setError] = useState<string | null>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      setError(null);
      await open();
    } catch (error) {
      setError("Failed to connect wallet. Please try again.");
      console.error("Wallet connection error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-500/15 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 flex items-center"
          onClick={() => setMenuOpen((v) => !v)}>
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Nav links */}
        <div className="hidden md:flex gap-6 items-center flex-1">
          {links.map((link) =>
            link.dropdown ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger
                  className={`text-md font-medium transition-colors outline-hidden duration-200 px-1 py-0.5 rounded-md hover:text-white flex items-center gap-1 ${
                    link.active ? "font-bold text-white" : "text-white/80"
                  }`}>
                  {link.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/95 border shadow-lg border-gray-500/10">
                  {link.dropdown.items.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className="block px-2 py-1 text-white/80 hover:bg-gray-600/10 cursor-pointer">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-md font-medium transition-colors duration-200 px-1 py-0.5 rounded-md ${
                  link.active
                    ? "font-bold text-white"
                    : "text-white/80 hover:text-white"
                }`}>
                {link.name}
              </Link>
            )
          )}
        </div>

        {/* Spacer for desktop */}
        <div className="flex-1 hidden md:block" />

        {/* Connect Wallet button */}
        {isConnected && address ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="px-4 py-2 rounded-full bg-gray-500/10 cursor-pointer text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{formatAddress(address)}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900/95 border shadow-lg border-gray-500/10">
              {/* Copy */}
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
                className="flex items-center gap-2 text-white/80 hover:bg-gray-600/10 cursor-pointer">
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy Address
              </DropdownMenuItem>
              {/* Open in Etherscan */}
              <DropdownMenuItem
                onClick={() => {
                  window.open(
                    `https://etherscan.io/address/${address}`,
                    "_blank"
                  );
                }}
                className="flex items-center gap-2 text-white/80 hover:bg-gray-600/10 cursor-pointer">
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Open in Etherscan
              </DropdownMenuItem>
              {/* Disconnect */}
              <DropdownMenuItem
                onClick={() => disconnect()}
                className="flex items-center gap-2 text-white/80 hover:bg-gray-600/10 cursor-pointer">
                <PowerIcon className="w-4 h-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col items-end">
            <button onClick={handleConnect} disabled={isConnecting}>
              <div className="flex items-center">
                <div className="px-4 py-2 rounded-full bg-gray-500/10 cursor-pointer text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                  <WalletIcon className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </span>
                </div>
              </div>
            </button>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900/90 px-4 py-2 absolute top-full left-0 w-full z-50 flex flex-col gap-2">
          {links.map((link) =>
            link.dropdown ? (
              <DropdownMenu key={link.name}>
                <DropdownMenuTrigger
                  className={`text-md font-medium transition-colors duration-200 px-2 py-2 rounded-md hover:text-white flex items-center gap-1 ${
                    link.active ? "font-bold text-white" : "text-white/80"
                  }`}>
                  {link.name}
                  <span className="text-xs">▼</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900/90 border border-white/10">
                  {link.dropdown.items.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className="block px-2 py-1 text-white/80 hover:text-white">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-md font-medium transition-colors duration-200 px-2 py-2 rounded-md ${
                  link.active
                    ? "font-bold text-white"
                    : "text-white/80 hover:text-white"
                }`}>
                {link.name}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}
