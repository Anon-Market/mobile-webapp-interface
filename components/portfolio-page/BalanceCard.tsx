"use client";

import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

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
        <div className="flex flex-row justify-evenly items-center w-full gap-6">
          {/* Bloc Adresse */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600">Adresse</span>
            <span className="text-md font-semibold">{shortAddress}</span>
          </div>

          {/* Bloc Balance USDC */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600">Balance</span>
            <div className="flex items-center gap-2 mt-1">
              {/* Logo USDC */}
              <Image
                src="/usdc.png"
                alt="USDC Icon"
                width={24}
                height={24}
              />
              <span className="text-md font-semibold">{displayBalance}</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
