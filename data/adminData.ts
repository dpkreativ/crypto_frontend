export interface PortfolioItem {
  symbol: string;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  portfolio: PortfolioItem[];
}

export const MARKET_PRICES: Record<string, number> = {
  BTC: 45000.0,
  ETH: 2500.0,
  XRP: 0.6,
  LTC: 85.0,
  ADA: 0.55,
  SOL: 110.0,
  DOT: 7.5,
};

// Initial users were removed as we now fetch from real backend API.
