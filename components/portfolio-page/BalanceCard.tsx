"use client";

import { Card, CardBody } from "@nextui-org/react";

interface BalanceCardProps {
  address: string | null;
  balance: string | null;
}

export default function BalanceCard({ address, balance }: BalanceCardProps) {
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Non connecté";
  const displayBalance = balance !== null ? `${balance} USDC` : "Chargement...";

  return (
    <Card className="bg-white/70 backdrop-blur-lg mb-6 w-full">
      <CardBody className="py-5">
        <div className="flex flex-col items-center gap-2 mb-2">
          {/* Adresse utilisateur */}
          <span className="text-sm text-gray-600">Adresse</span>
          <span className="text-md font-semibold">{shortAddress}</span>

          {/* Balance USDC */}
          <div className="text-lg font-bold mt-4">{displayBalance}</div>
        </div>
      </CardBody>
    </Card>
  );
}