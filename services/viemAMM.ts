import { http, createPublicClient } from 'viem'
import { mainnet, polygonAmoy, sepolia } from 'viem/chains'

import { contractAddress_AMM, contractABI_AMM } from '@/components/constants';

export const getPriceAMM = async (voteId: number, marketid: number
): Promise<string> => {
    try {

        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(),
        });

        // Lire les données du contrat via Viem
        const data = await publicClient.readContract({
            abi: contractABI_AMM,
            address: contractAddress_AMM,
            functionName: 'priceForOutcome',
            args: [voteId, marketid],
        });

        console.log('data', data);

        const rawValue = data as BigInt;
        const formattedValue = Number(rawValue) / 10 ** 18; // Convertir de wei à ether

        console.log(`Formatted value: ${formattedValue}`);

        // Retourner sous forme de chaîne de caractères pour respecter l'interface
        return formattedValue.toFixed(5); // Exemple : "0.52"
    } catch (error) {
        console.error('Error fetching deposit public keys:', error);
        throw error;
    }
};