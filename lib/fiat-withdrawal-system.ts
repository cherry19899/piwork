// Global Fiat Withdrawal System
// Available in Month 6+ roadmap milestone
// Enables Eastern Europe and other markets to withdraw in local currency

export type WithdrawalMethod = 'bank_transfer' | 'e_wallet' | 'stablecoin' | 'cash_pickup';
export type WithdrawalCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'MXN' | 'BRL' | 'ZAR' | 'INR' | 'PHP' | 'NGN' | 'IDR' | 'VND';

export interface FiatWithdrawalProvider {
  name: string;
  method: WithdrawalMethod;
  supportedCurrencies: WithdrawalCurrency[];
  minWithdrawal: number; // in USD equivalent
  maxWithdrawal: number; // daily limit
  fee: number; // percentage
  processingTime: string; // '1-2 hours', '1-3 days', etc
  regions: string[];
}

export const fiatWithdrawalProviders: FiatWithdrawalProvider[] = [
  {
    name: 'Wise (TransferWise)',
    method: 'bank_transfer',
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'MXN', 'BRL'],
    minWithdrawal: 5,
    maxWithdrawal: 50000,
    fee: 0.005,
    processingTime: '1-3 days',
    regions: ['Eastern Europe', 'Latin America', 'MENA', 'South Asia'],
  },
  {
    name: 'Stripe Connect',
    method: 'bank_transfer',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN'],
    minWithdrawal: 10,
    maxWithdrawal: 100000,
    fee: 0.01,
    processingTime: '2-3 days',
    regions: ['Eastern Europe', 'Latin America'],
  },
  {
    name: 'Google Pay / Apple Pay',
    method: 'e_wallet',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'PHP', 'MXN'],
    minWithdrawal: 1,
    maxWithdrawal: 10000,
    fee: 0.015,
    processingTime: 'Instant',
    regions: ['Philippines', 'India', 'Egypt', 'Nigeria'],
  },
  {
    name: 'Local Bank Partnerships',
    method: 'bank_transfer',
    supportedCurrencies: ['NGN', 'IDR', 'VND', 'ZAR', 'INR'],
    minWithdrawal: 50,
    maxWithdrawal: 5000,
    fee: 0.02,
    processingTime: '1-2 days',
    regions: ['Nigeria', 'Indonesia', 'Vietnam', 'South Africa', 'India'],
  },
];

export interface FiatWithdrawalRequest {
  userId: string;
  amount: number; // in Pi
  targetCurrency: WithdrawalCurrency;
  method: WithdrawalMethod;
  provider: string;
  bankAccount?: string;
  walletAddress?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface FiatConversionRate {
  piToUsd: number;
  usdToCurrency: number;
  effectiveRate: number;
  fee: number;
  totalReceived: number;
  lastUpdated: Date;
}

export function calculateFiatWithdrawal(
  piAmount: number,
  targetCurrency: WithdrawalCurrency,
  provider: FiatWithdrawalProvider,
  exchangeRates: Record<WithdrawalCurrency, number>
): FiatConversionRate {
  const piToUsd = 0.03; // Mock: 1 Pi = $0.03
  const usdEquivalent = piAmount * piToUsd;
  const fee = usdEquivalent * provider.fee;
  const exchangeRate = exchangeRates[targetCurrency] || 1.0;
  
  const usdToLocalCurrency = usdEquivalent - fee;
  const totalInLocalCurrency = usdToLocalCurrency * exchangeRate;
  
  return {
    piToUsd,
    usdToCurrency: exchangeRate,
    effectiveRate: (totalInLocalCurrency / piAmount),
    fee,
    totalReceived: totalInLocalCurrency,
    lastUpdated: new Date(),
  };
}

// Regional withdrawal preferences
export const regionalWithdrawalPreferences = {
  'Eastern Europe': { preferred: ['bank_transfer', 'e_wallet'], currencies: ['EUR', 'USD'] },
  'Latin America': { preferred: ['bank_transfer', 'stablecoin'], currencies: ['USD', 'MXN', 'BRL'] },
  'West Africa': { preferred: ['bank_transfer', 'mobile_money'], currencies: ['NGN', 'USD'] },
  'South Asia': { preferred: ['bank_transfer', 'e_wallet'], currencies: ['INR', 'USD'] },
  'Southeast Asia': { preferred: ['e_wallet', 'bank_transfer'], currencies: ['PHP', 'IDR', 'VND'] },
  'MENA': { preferred: ['bank_transfer', 'e_wallet'], currencies: ['USD', 'EUR'] },
};

// Month 6 Roadmap: External wallet integration enables fiat conversion
// Future expansion: Direct SEPA transfers, ACH, local bank partnerships across 50+ countries
