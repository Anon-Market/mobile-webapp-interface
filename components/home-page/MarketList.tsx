import { MarketCard } from "./MarketCard";

interface MarketListProps {
  markets: any[];
  onMarketClick: (market: any) => void;
}

export const MarketList = ({ markets, onMarketClick }: MarketListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {markets.map((market) => (
        <MarketCard key={market.id} market={market} onClick={onMarketClick} />
      ))}
    </div>
  );
};
