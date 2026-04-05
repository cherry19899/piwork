// Latin America Market Strategy
// Mexico: 10.5M Pi pioneers, 6% monthly inflation
// Colombia: 4.8M Pi pioneers, high remittance culture
// Argentina: 3.2M Pi pioneers, 200%+ annual inflation (stablecoin critical)

export interface LatamMarketConfig {
  country: 'mx' | 'co' | 'ar';
  population: number;
  piPioneers: number;
  inflationRate: number;
  currencyRisk: 'low' | 'medium' | 'high';
  stablecoinPreference: 'USDC' | 'USDT' | 'DAI';
}

export const latamMarkets: Record<string, LatamMarketConfig> = {
  mexico: {
    country: 'mx',
    population: 128000000,
    piPioneers: 10500000,
    inflationRate: 0.06,
    currencyRisk: 'medium',
    stablecoinPreference: 'USDC',
  },
  colombia: {
    country: 'co',
    population: 52000000,
    piPioneers: 4800000,
    inflationRate: 0.08,
    currencyRisk: 'medium',
    stablecoinPreference: 'USDT',
  },
  argentina: {
    country: 'ar',
    population: 46000000,
    piPioneers: 3200000,
    inflationRate: 2.0,
    currencyRisk: 'high',
    stablecoinPreference: 'USDC',
  },
};

export const latamJobCategories = {
  translation: ['Spanish→English', 'English→Spanish', 'Portuguese→Spanish'],
  design: ['US Latino Market Design', 'Cultural Localization', 'Spanish UI/UX'],
  voiceover: ['Spanish Narration', 'Accent-Neutral Spanish', 'Regional Spanish'],
  content: ['Latino Culture Content', 'Spanish SEO', 'Latam Market Research'],
};

export const latamPricingMultipliers = {
  mexico: 0.45,
  colombia: 0.38,
  argentina: 0.35,
};
