"use client";

import { FC } from "react";
import { Market } from "@/types";

interface MarketDetailsProps {
  market: Market;
}

const MarketDetails: FC<MarketDetailsProps> = ({ market }) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">{market.title}</h1>
      <p className="text-gray-600 mb-6">{market.description}</p>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm text-gray-500">
          <span>End Date:</span>
          <span>{market.endDate}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Volume:</span>
          <span>{market.volume}</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold mb-4">Market Details</h3>
        <p className="text-sm text-gray-600">{market.longDescription}</p>
      </div>
    </div>
  );
};

export default MarketDetails;