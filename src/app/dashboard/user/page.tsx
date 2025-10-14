"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardUserPage() {
  const [assets] = useState([
    {
      id: 1,
      name: "PT USDC 20-10-2025",
      amount: 1000,
      price: 1000,
      redeemDate: "20-10-2025",
    },
    {
      id: 2,
      name: "PT ETH 15-11-2025",
      amount: 500,
      price: 1500,
      redeemDate: "15-11-2025",
    },
    {
      id: 3,
      name: "PT DAI 30-09-2025",
      amount: 2000,
      price: 2000,
      redeemDate: "30-09-2025",
    },
  ]);

  const [positions] = useState([
    {
      id: 1,
      name: "YT USDC 20-10-2025",
      amount: 1000,
      price: 50,
    },
    {
      id: 2,
      name: "YT ETH 15-11-2025",
      amount: 800,
      price: 75,
    },
    {
      id: 3,
      name: "YT DAI 30-09-2025",
      amount: 1500,
      price: 45,
    },
  ]);

  const walletAddress = "0xMEMEK";

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-4 border-white/20">
            <AvatarFallback className="bg-gray-500/30 backdrop-blur-lg text-white text-2xl font-bold">
              DU
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Dashboard User
            </h1>
            <p className="text-white/60 font-mono">Address: {walletAddress}</p>
          </div>
        </div>

        {/* Assets Section */}
        <Card className="bg-gray-500/15 backdrop-blur-lg border-gray-500/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-500/20">
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">
                      Assets
                    </th>
                    <th className="text-right py-3 px-4 text-white/80 font-semibold">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-white/80 font-semibold">
                      Price
                    </th>
                    <th className="text-right py-3 px-4 text-white/80 font-semibold">
                      Redeem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-gray-500/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">
                          {asset.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white">
                          {asset.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-400 font-semibold">
                          ${asset.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white/60">
                          {asset.redeemDate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center p-4 bg-white/5 rounded-lg border border-gray-500/10">
              <span className="text-white font-semibold text-lg">
                Total Value:
              </span>
              <span className="text-green-400 font-bold text-xl">
                $
                {assets
                  .reduce((sum, asset) => sum + asset.price, 0)
                  .toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Positions Section */}
        <Card className="bg-gray-500/15 backdrop-blur-lg border-gray-500/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-500/20">
                    <th className="text-left py-3 px-4 text-white/80 font-semibold">
                      Positions
                    </th>
                    <th className="text-right py-3 px-4 text-white/80 font-semibold">
                      Amount
                    </th>
                    <th className="text-right py-3 px-4 text-white/80 font-semibold">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr
                      key={position.id}
                      className="border-b border-gray-500/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">
                          {position.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white">
                          {position.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-green-400 font-semibold">
                          ${position.price.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-between items-center p-4 bg-white/5 rounded-lg border border-gray-500/10">
              <span className="text-white font-semibold text-lg">
                Total Positions Value:
              </span>
              <span className="text-green-400 font-bold text-xl">
                $
                {positions
                  .reduce(
                    (sum, pos) => sum + (pos.amount * pos.price) / 1000,
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
