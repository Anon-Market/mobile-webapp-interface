"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Input } from "@nextui-org/react";
import { Search, TrendingUp, Trophy, LandPlot } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/navigation/NavBar";
import { ChainSelector } from "@/components/ux/ChainSelector";
import { availableMarkets } from "@/data/mockMarkets";
import { fetchOddsForMarkets } from "@/components/home-page/fetchOdds";
import { MarketList } from "@/components/home-page/MarketList";

const initialMarketData = JSON.parse(JSON.stringify(availableMarkets));

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("finance");
  const [marketData, setMarketData] = useState(initialMarketData);
  const [oddsFetched, setOddsFetched] = useState(false);

  // Fonction pour récupérer les odds au chargement ou changement de catégorie
  useEffect(() => {
    async function updateOdds() {
      if (!oddsFetched) {
        const updatedMarkets = await fetchOddsForMarkets(marketData[selectedCategory]);
        setMarketData((prev: typeof initialMarketData) => ({
          ...prev,
          [selectedCategory]: updatedMarkets,
        }));
        setOddsFetched(true); // Empêche la boucle infinie
      }
    }

    updateOdds();
  }, [selectedCategory, oddsFetched, marketData]);

  // Gérer le clic sur un marché
  const handleMarketClick = (market: any) => {
    localStorage.setItem("selectedMarket", JSON.stringify(market));
    localStorage.setItem("previousPage", "/home");
    router.push(`/markets/${market.id}`);
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto pt-6 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AnonMarket</h1>
          <ChainSelector />
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <Input
            classNames={{
              input: "h-12",
              inputWrapper: "h-12 bg-white/70 backdrop-blur-lg",
            }}
            placeholder="Search markets..."
            startContent={<Search className="text-gray-400" />}
          />
        </div>

        {/* Catégories */}
        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={(key) => {
            setSelectedCategory(key.toString());
            setOddsFetched(false); // Reset oddsFetched pour refetch les odds
          }}
          className="mb-8"
        >
          <Tab
            key="finance"
            title={
              <div className="flex items-center gap-2">
                <TrendingUp size={18} />
                <span>Finance</span>
              </div>
            }
          />
          <Tab
            key="sports"
            title={
              <div className="flex items-center gap-2">
                <Trophy size={18} />
                <span>Sports</span>
              </div>
            }
          />
          <Tab
            key="politics"
            title={
              <div className="flex items-center gap-2">
                <LandPlot size={18} />
                <span>Politics</span>
              </div>
            }
          />
        </Tabs>

        {/* Liste des marchés */}
        <MarketList
          markets={marketData[selectedCategory]}
          onMarketClick={handleMarketClick}
        />
      </div>
    </>
  );
}