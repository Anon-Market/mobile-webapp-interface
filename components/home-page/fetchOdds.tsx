import { getPriceAMM } from "@/services/viemAMM";
import { MarketOption } from "@/types"

export const fetchOddsForMarkets = async (markets: any[]) => {
  const updatedMarkets = await Promise.all(
    markets.map(async (market) => {
      const updatedOptions = await Promise.all(
        market.options.map(async (option: MarketOption) => {
          let voteId = 0;
          if (option.label.toLowerCase() === "yes") voteId = 0;
          else if (option.label.toLowerCase() === "no") voteId = 1;

          const odds = await getPriceAMM(voteId, market.id);
          const finalOdds = Array.isArray(odds) ? odds[0] : odds;

          return {
            ...option,
            odds: Number(finalOdds),
          };
        })
      );
      return {
        ...market,
        options: updatedOptions,
      };
    })
  );

  return updatedMarkets;
};

// Récupère les odds pour toutes les options d'un marché donné
export const fetchOddsForSingleMarket = async (market: any) => {
    const updatedOptions = await Promise.all(
      market.options.map(async (option: any) => {
        const voteId =
          option.label.toLowerCase() === "yes"
            ? 0
            : option.label.toLowerCase() === "no"
            ? 1
            : 0; // Adapte si nécessaire pour d'autres options
  
        const odds = await getPriceAMM(voteId, market.id);
        const finalOdds = Array.isArray(odds) ? odds[0] : odds;
  
        return {
          ...option,
          odds: Number(finalOdds),
        };
      })
    );
  
    return {
      ...market,
      options: updatedOptions,
    };
  };