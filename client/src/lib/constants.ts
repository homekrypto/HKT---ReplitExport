export const HKT_CONFIG = {
  INITIAL_PRICE: 0.10,
  ANNUAL_GROWTH_RATE: 0.15,
  DEFAULT_MONTHLY_INVESTMENT: 106.83,
  DEFAULT_INVESTMENT_PERIOD: 36,
  TOTAL_INVESTMENT_PLAN: 3846,
  EXPECTED_FINAL_VALUE: 5300,
  EXPECTED_PROFIT: 1454,
  EXPECTED_ROI: 37.8,
  EXPECTED_TOKENS: 34816,
  CONTRACT_ADDRESS: "0x0de50324B6960B15A5ceD3D076aE314ac174Da2e", // Real HKT token contract
  UNISWAP_URL: "https://app.uniswap.org/#/swap"
};

export const INVESTMENT_PLAN_DATA = {
  totalInvested: 3846,
  finalHktPrice: 0.152,
  totalHktAccumulated: 34816,
  finalPortfolioValue: 5300,
  totalProfit: 1454,
  roi: 37.8
};

export const QUARTERLY_BREAKDOWN = [
  { year: 1, quarter: 1, hktPrice: 0.100, hktPurchased: 3204, totalHkt: 3204, portfolioValue: 320.40 },
  { year: 1, quarter: 2, hktPrice: 0.100, hktPurchased: 3204, totalHkt: 6408, portfolioValue: 640.80 },
  { year: 1, quarter: 3, hktPrice: 0.100, hktPurchased: 3204, totalHkt: 9612, portfolioValue: 961.20 },
  { year: 1, quarter: 4, hktPrice: 0.100, hktPurchased: 3204, totalHkt: 12816, portfolioValue: 1281.60 },
  { year: 2, quarter: 1, hktPrice: 0.115, hktPurchased: 2786, totalHkt: 15602, portfolioValue: 1794.23 },
  { year: 2, quarter: 2, hktPrice: 0.115, hktPurchased: 2786, totalHkt: 18388, portfolioValue: 2114.62 },
  { year: 2, quarter: 3, hktPrice: 0.115, hktPurchased: 2786, totalHkt: 21174, portfolioValue: 2435.01 },
  { year: 2, quarter: 4, hktPrice: 0.115, hktPurchased: 2786, totalHkt: 23960, portfolioValue: 2755.40 },
  { year: 3, quarter: 1, hktPrice: 0.132, hktPurchased: 2422, totalHkt: 26382, portfolioValue: 3482.42 },
  { year: 3, quarter: 2, hktPrice: 0.132, hktPurchased: 2422, totalHkt: 28804, portfolioValue: 3802.13 },
  { year: 3, quarter: 3, hktPrice: 0.132, hktPurchased: 2422, totalHkt: 31226, portfolioValue: 4121.83 },
  { year: 3, quarter: 4, hktPrice: 0.152, hktPurchased: 2108, totalHkt: 33334, portfolioValue: 5066.77 }
];
