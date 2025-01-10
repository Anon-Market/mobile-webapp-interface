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