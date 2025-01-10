import { NextResponse, NextRequest } from 'next/server';
import { createPublicClient, http, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';

import { usdcTokenAbi, usdcTokenAddress } from '@/constants/contracts';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing address param" }, { status: 400 });
    }

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(RPC_URL),
    });

    const rawBalance = await publicClient.readContract({
      address: usdcTokenAddress,
      abi: usdcTokenAbi,
      functionName: "balanceOf",
      args: [address],
    }) as bigint;

    const balance = formatUnits(rawBalance, 6);

    return NextResponse.json({ address, balance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
