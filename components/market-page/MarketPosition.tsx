"use client";

import { FC } from "react";
import { Button } from "@nextui-org/react";
import { Market } from "@/types";

interface Position {
  shares: number;
  option: string;
  purchasePrice: string;
  potentialWin: string;
}

interface MarketPositionProps {
  market: Market;
  userPosition: Position;
  onClaim: () => void;
}

const MarketPosition: FC<MarketPositionProps> = ({
  market,
  userPosition,
  onClaim,
}) => {
  const isMarketEnded = market.endDate && new Date(market.endDate) < new Date();

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Your Current Position</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Option:</span>
          <span className="font-medium">{userPosition.option}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shares:</span>
          <span className="font-medium">{userPosition.shares}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Purchase Price:</span>
          <span className="font-medium">${userPosition.purchasePrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Potential Win:</span>
          <span className="font-medium text-green-600">
            ${userPosition.potentialWin}
          </span>
        </div>
      </div>

      {isMarketEnded && (
        <Button
          color="primary"
          variant="flat"
          className="w-full mt-4"
          onClick={onClaim}
        >
          Claim Position
        </Button>
      )}
    </div>
  );
};

export default MarketPosition;