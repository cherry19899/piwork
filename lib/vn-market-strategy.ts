export interface VietnamMarketConfig {
  countryCode: 'VN';
  populationWithPi: 2500000;
  averageSalaryUSD: 3000;
  currencyControl: 'STRICT';
  strategy: 'INTERNAL_ECONOMY';
}

export const vietnamMarketStrategy = {
  currencyControlBypass: true,
  piOnlyTransactions: true,
  noFiatConversion: true,
  internalEconomyFocus: true,
};
