export interface SouthAsiaMarketConfig {
  country: 'BD' | 'PK';
  populationBillions: number;
  piPenetration: number;
  bankingAccess: number;
  internationalPlatformAccess: string;
}

export const bangladeshMarket = {
  countryCode: 'BD',
  population: 170000000,
  piPioneer: 8000000,
  bankingBarrier: 'HIGH',
  sanctionImpact: 'MODERATE',
  
  jobCategories: {
    transcription: { volume: 'HIGH', avgRate: 10, supplyGap: 'CRITICAL' },
    dataLabeling: { volume: 'VERY_HIGH', avgRate: 5, supplyGap: 'CRITICAL' },
    manualDataEntry: { volume: 'VERY_HIGH', avgRate: 8, supplyGap: 'HIGH' },
  },
  
  pricing: {
    multiplier: 0.35,
    perHourRate: 0.8,
    minJobValue: 3, // Pi, $0.03 USD
    targetMonthlyIncome: 150, // Pi per user
  },
  
  cryptoAdvantage: 'BYPASSES_SANCTIONS',
};

export const pakistanMarket = {
  countryCode: 'PK',
  population: 230000000,
  piPioneer: 6000000,
  bankingBarrier: 'VERY_HIGH',
  sanctionImpact: 'SEVERE',
  
  jobCategories: {
    transcription: { volume: 'HIGH', avgRate: 8, supplyGap: 'HIGH' },
    dataLabeling: { volume: 'HIGH', avgRate: 4, supplyGap: 'CRITICAL' },
    customerSupport: { volume: 'MEDIUM', avgRate: 12, supplyGap: 'MEDIUM' },
  },
  
  pricing: {
    multiplier: 0.4,
    perHourRate: 0.9,
    minJobValue: 2, // Pi
    targetMonthlyIncome: 120, // Pi per user
  },
  
  cryptoAdvantage: 'ONLY_VIABLE_OPTION',
};
