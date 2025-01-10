import { Card, CardBody } from "@nextui-org/react";

interface MarketCardProps {
  market: any;
  onClick: (market: any) => void;
}

export const MarketCard = ({ market, onClick }: MarketCardProps) => {
  const yesOdds = Number(market.options[0].odds).toFixed(3);
  const noOdds = Number(market.options[1].odds).toFixed(3);

  return (
    <Card
      isPressable
      isHoverable
      className="bg-white/70 backdrop-blur-lg hover:bg-white/80 transition-all cursor-pointer w-full"
      onPress={() => onClick(market)}
    >
      <CardBody className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{market.title}</h3>
          <span className="text-primary font-semibold whitespace-nowrap ml-4">
            {yesOdds} / {noOdds}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{market.description}</p>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Ends: {market.endDate}</span>
          <span className="ml-4">Volume: {market.volume}</span>
        </div>
      </CardBody>
    </Card>
  );
};