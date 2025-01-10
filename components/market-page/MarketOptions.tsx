"use client";

import { FC } from "react";
import { Button } from "@nextui-org/react";
import { Minus, Plus } from "lucide-react";
import { MarketOptionsProps } from "@/types";

const MarketOptions: FC<MarketOptionsProps> = ({
  market,
  loadingOdds,
  selectedOption,
  onSelectOption,
  shares,
  handleSharesChange,
  totalshares,
  handleBuy,
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mb-6">
      {/* Options de vote (Yes/No) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {market.options.map((option) => (
          <Button
            key={option.label}
            size="lg"
            className="h-14"
            color="primary"
            variant={selectedOption === option.label ? "solid" : "bordered"}
            onClick={() => onSelectOption(option.label)}
          >
            <div className="flex flex-col">
              <span>{option.label}</span>
              <span className="text-sm opacity-80">
                {loadingOdds && selectedOption === option.label
                  ? "Loading..."
                  : option.odds}
              </span>
            </div>
          </Button>
        ))}
      </div>

      {/* Contrôle du nombre d'USDC (shares) */}
      {selectedOption && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Number of USDC</h3>
          <div className="flex items-center justify-center gap-4">
            <Button
              isIconOnly
              variant="bordered"
              onClick={() => handleSharesChange(false)}
              className="h-12 w-12"
            >
              <Minus size={20} />
            </Button>

            <span className="text-2xl font-semibold min-w-[60px] text-center">
              {shares}
            </span>

            <Button
              isIconOnly
              variant="bordered"
              onClick={() => handleSharesChange(true)}
              className="h-12 w-12"
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="text-center mt-2 text-gray-600">
            Shares: {totalshares.toFixed(4)}
          </div>
        </div>
      )}

      {/* Bouton Buy */}
      {selectedOption && (
        <Button
          color="primary"
          size="lg"
          className="w-full h-14"
          onClick={handleBuy}
        >
          Buy {shares} Dollar{shares > 1 ? 's' : ''} of {selectedOption}
        </Button>
      )}
    </div>
  );
};

export default MarketOptions;