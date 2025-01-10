"use client";

import Image from "next/image";
import { Card, CardBody } from "@nextui-org/react";

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="bg-white/70 backdrop-blur-lg mb-6 w-full">
      <CardBody className="py-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 relative">
            <Image
              src="/usdc.png"
              alt="USDC"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-3xl font-bold">${balance}</span>
        </div>
      </CardBody>
    </Card>
  );
}