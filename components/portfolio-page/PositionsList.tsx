"use client";

import { Card, CardBody, Button } from "@nextui-org/react";
import { IProvider } from "@web3auth/base";

export type Position = {
  title: string;
  prediction: string;
  amount: string;
  odds: string;
  potentialWin: string;
  endDate: string;
  status: "active" | "won" | "lost";
};

interface PositionsListProps {
  positions: Position[];
  isCurrent: boolean;
  onPositionClick: (position: Position) => void;
  onClaim: (provider: IProvider) => Promise<void>;
  provider: IProvider | null;
}

export default function PositionsList({
  positions,
  isCurrent,
  onPositionClick,
  onClaim,
  provider
}: PositionsListProps) {
  // Gère le render pour chaque position
  return (
    <div className="grid grid-cols-1 gap-4 w-full">
      {positions.map((position, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-lg w-full">
          <CardBody className="p-4">
            <div
              className="cursor-pointer"
              onClick={() => onPositionClick(position)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold">{position.title}</h3>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ml-4 
                    ${
                      position.status === 'active'
                        ? 'text-primary'
                        : position.status === 'won'
                        ? 'text-green-600'
                        : position.status === 'lost'
                        ? 'text-red-600'
                        : ''
                    }`}
                >
                  {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prediction:</span>
                  <span className="font-medium ml-4">{position.prediction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium ml-4">{position.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Odds:</span>
                  <span className="font-medium ml-4">{position.odds}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Win:</span>
                  <span className="font-medium text-green-600 ml-4">
                    {position.potentialWin}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium ml-4">{position.endDate}</span>
                </div>
              </div>
            </div>

            {/* Bouton Claim - uniquement pour les positions "current" */}
            {isCurrent && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  color="primary"
                  variant="flat"
                  className="w-full"
                  onClick={() => {
                    if (provider) onClaim(provider);
                    else console.error('Error: Provider is not initialized.');
                  }}
                >
                  Claim Position
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}