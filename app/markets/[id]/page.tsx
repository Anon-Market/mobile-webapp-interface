"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { interactionAMM } from '@/services/viemMarkets';
import { getPriceAMM } from '@/services/viemAMM';

// Composants factorisés
import MarketDetails from "@/components/market-page/MarketDetails";
import MarketOptions from "@/components/market-page/MarketOptions";
import MarketPosition from '@/components/market-page/MarketPosition';

interface Market {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  endDate: string;
  volume: string;
  type: 'binary' | 'multiple-choice';
  options: Array<{ label: string; odds: string }>;
}

interface Position {
  shares: number;
  option: string;
  purchasePrice: string;
  potentialWin: string;
}

export default function MarketPage() {
  const router = useRouter();

  // -- States pour les infos du marché --
  const [market, setMarket] = useState<Market | null>(null);
  const [previousPage, setPreviousPage] = useState<string>('/home');

  // -- States pour l'option sélectionnée et le nombre d'USDC --
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shares, setShares] = useState<number>(1);

  // -- État pour savoir si on est en train de charger les odds --
  const [loadingOdds, setLoadingOdds] = useState<boolean>(false);

  // -- Position de l’utilisateur sur ce marché (exemple) --
  const [userPosition, setUserPosition] = useState<Position | null>({
    shares: 2,
    option: "Yes",
    purchasePrice: "2.00",
    potentialWin: "4.00",
  });

  // Au montage, on récupère le market et la page précédente depuis localStorage
  useEffect(() => {
    try {
      const storedMarket = localStorage.getItem('selectedMarket');
      const storedPreviousPage = localStorage.getItem('previousPage');
      if (storedMarket) {
        setMarket(JSON.parse(storedMarket));
      }
      if (storedPreviousPage) {
        setPreviousPage(storedPreviousPage);
      }
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  }, []);

  // Dès qu’on a le market, on sélectionne par défaut la 1ère option (si pas déjà sélectionnée)
  // et on va chercher ses odds.
  useEffect(() => {
    if (market && market.options.length > 0 && !selectedOption) {
      const defaultOption = market.options[0].label;
      setSelectedOption(defaultOption);
      fetchAndUpdateOdds(defaultOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  /**
   * Incrémente ou décrémente le nombre de shares
   */
  const handleSharesChange = (increment: boolean) => {
    setShares(prev => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  /**
   * Met à jour les odds d'une option
   */
  const fetchAndUpdateOdds = async (label: string) => {
    if (!market) {
      console.error("Market data not available. Wait for it to load.");
      return;
    }
    setLoadingOdds(true);
    try {
      const voteId = label === "Yes" ? 0 : 1; // Ex. simple : 0 => Yes, 1 => No
      const odds = await getPriceAMM(voteId, market.id);

      console.log(`Updated odds for ${label}:`, odds);

      // odds peut être un tableau ou un BigInt => adaptons
      const updatedOdds = Array.isArray(odds) ? odds[0] : odds;
      const oddsAsString = String(updatedOdds);

      // Mise à jour de l'objet market dans le state
      setMarket(prevMarket => {
        if (!prevMarket) return null;
        const updatedOptions = prevMarket.options.map(option =>
          option.label === label ? { ...option, odds: oddsAsString } : option
        );
        return { ...prevMarket, options: updatedOptions };
      });
    } catch (error) {
      console.error('Failed to fetch odds:', error);
    } finally {
      setLoadingOdds(false);
    }
  };

  /**
   * Acheter (Buy) => interactionAMM puis call backend
   */
  const handleBuy = async () => {
    if (!selectedOption || !market) return;
    try {
      const marketId = market.id;
      const voteId = market.options.findIndex(
        (option) => option.label === selectedOption
      );
      const amountUsdc = shares;
      const claimed = 0;

      console.log("Paramètres InteractionAMM:", marketId, voteId, amountUsdc, claimed);

      const { ring, signature, message } = await interactionAMM(
        marketId,
        voteId,
        amountUsdc,
        claimed
      );

      console.log('InteractionAMM result:', { ring, signature, message });

      const requestBody = {
        message,
        signature: signature.toBase64(),
        inputAmount: amountUsdc,
        outcome: voteId,
        marketId,
      };

      console.log('Request body:', requestBody);

      // Appel backend
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('Backend response:', response);

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Backend error: ${errorDetails.error}`);
      }

      const responseData = await response.json();
      console.log('Transaction success:', responseData);
    } catch (error) {
      console.error('Error during interaction or backend call:', error);
    }
  };

  // On récupère les odds de l'option sélectionnée
  const selectedOdds = market?.options.find(opt => opt.label === selectedOption)?.odds;
  const totalCost = shares * (selectedOdds ? parseFloat(selectedOdds) : 0);

  if (!market) {
    return (
      <div className="max-w-4xl mx-auto pt-6 px-4">
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <div>Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-6 px-4 pb-24">
      {/* Bouton Back */}
      <button
        onClick={() => router.push(previousPage)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Market Details */}
      <MarketDetails market={market} />

      {/* Market Options + Buy */}
      <MarketOptions
        market={market}
        loadingOdds={loadingOdds}
        selectedOption={selectedOption}
        onSelectOption={async (label) => {
          setSelectedOption(label);
          await fetchAndUpdateOdds(label);
        }}
        shares={shares}
        handleSharesChange={handleSharesChange}
        totalCost={totalCost}
        handleBuy={handleBuy}
      />

      {/* Current Position */}
      {userPosition && (
        <MarketPosition
          market={market}
          userPosition={userPosition}
          onClaim={() => {
            console.log('Claiming position');
            // Ta logique de claim
          }}
        />
      )}
    </div>
  );
}
