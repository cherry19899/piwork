// Pi-to-Mobile-Credit Conversion System
// Handles real-time Pi exchange rates and mobile credit transfers

export interface ExchangeRate {
  piToUsd: number;
  usdToLocalCurrency: { [key: string]: number };
  timestamp: number;
  ttl: number; // time to live in seconds
}

export interface MobileCreditConversion {
  piAmount: number;
  exchangeRate: ExchangeRate;
  localCurrencyAmount: number;
  operatorCommission: number;
  piworkFee: number;
  userReceives: number;
  country: string;
  currency: string;
}

export class PiToMobileCreditService {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private piUsdRate: number = 0.0314; // Pi current market rate

  async getExchangeRates(): Promise<ExchangeRate> {
    const cached = this.exchangeRates.get('current');
    if (cached && cached.timestamp + cached.ttl > Date.now()) {
      return cached;
    }

    // Simulated real-time exchange rates
    const rates: ExchangeRate = {
      piToUsd: this.piUsdRate,
      usdToLocalCurrency: {
        XOF: 600, // 1 USD = 600 XOF (West African CFA franc)
        ETB: 55, // 1 USD = 55 ETB (Ethiopian Birr)
        PHP: 55, // 1 USD = 55 PHP (Philippine Peso)
        NGN: 1450, // 1 USD = 1450 NGN (Nigerian Naira)
        IDR: 16000, // 1 USD = 16000 IDR (Indonesian Rupiah)
      },
      timestamp: Date.now(),
      ttl: 60, // 1 minute cache
    };

    this.exchangeRates.set('current', rates);
    return rates;
  }

  async convertPiToMobileCredit(
    piAmount: number,
    country: string,
    currency: string,
    operatorId: string
  ): Promise<MobileCreditConversion> {
    const rates = await this.getExchangeRates();
    const usdAmount = piAmount * rates.piToUsd;
    const localCurrencyAmount = usdAmount * (rates.usdToLocalCurrency[currency] || 1);

    // Operator commission (varies 5-8%)
    const operatorCommission = localCurrencyAmount * 0.06;

    // PiWork platform fee (2%)
    const piworkFee = localCurrencyAmount * 0.02;

    const userReceives = localCurrencyAmount - operatorCommission - piworkFee;

    return {
      piAmount,
      exchangeRate: rates,
      localCurrencyAmount,
      operatorCommission,
      piworkFee,
      userReceives,
      country,
      currency,
    };
  }

  calculateAirtimeBonus(piAmount: number, country: string): number {
    // Promotional bonus for mobile credit purchases
    const bonusRates: { [key: string]: number } = {
      SN: 0.1, // 10% bonus in Senegal
      CI: 0.1, // 10% bonus in Ivory Coast
      ET: 0.05, // 5% bonus in Ethiopia
    };

    return piAmount * (bonusRates[country] || 0);
  }

  async processConversion(
    piAmount: number,
    phoneNumber: string,
    country: string,
    currency: string
  ): Promise<{
    success: boolean;
    creditAmount: number;
    transactionId: string;
    estimatedDelivery: number;
  }> {
    const conversion = await this.convertPiToMobileCredit(
      piAmount,
      country,
      currency,
      ''
    );

    const bonus = this.calculateAirtimeBonus(piAmount, country);
    const totalCredit = conversion.userReceives + bonus;

    return {
      success: true,
      creditAmount: totalCredit,
      transactionId: `pi-mc-${Date.now()}`,
      estimatedDelivery: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
  }
}
