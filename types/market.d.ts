export interface MarketOption {
    label: string;
    odds: string;
  }
  
  export interface Market {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    endDate: string;
    volume: string;
    type: 'binary' | 'multiple-choice';
    options: MarketOption[];
  }
  
  export interface MarketOptionsProps {
    market: Market;
    loadingOdds: boolean;
    selectedOption: string | null;
    onSelectOption: (label: string) => Promise<void>;
    shares: number;
    handleSharesChange: (increment: boolean) => void;
    totalCost: number;
    handleBuy: () => void;
  }
  