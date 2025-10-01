import { Bitcoin } from "lucide-react";
import { AssetTable } from "../components/partial/AssetTable";

const assets = [
  {
    icon: <Bitcoin className="w-7 h-7 text-yellow-400" />,
    name: "uniBTC",
    badge: (
      <span className="bg-yellow-900/60 text-yellow-400 px-2 py-0.5 rounded text-xs font-bold">
        Bedrock
      </span>
    ),
    subtitle: "Bedrock",
    markets: "1 Markets",
    tvl: "$90.09M",
    volume: "$9,368",
    bestLong: "-100%",
    bestFixed: "1.19%",
  },
];

export function Table() {
  return (
    <div className="w-full flex flex-col gap-4">
      {assets.map((asset, idx) => (
        <AssetTable key={idx} {...asset} />
      ))}
    </div>
  );
}
