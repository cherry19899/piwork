export const PI_SDK_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_PI_API_KEY || 'demo-mode',
  version: 'v1',
  sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === 'true',
};

export const PI_PAYMENT_CONFIG = {
  minAmount: 1,
  maxAmount: 10000,
  defaultCurrency: 'pi',
  feePercentage: 2.5,
};

export const REGION_CONFIG = {
  regions: [
    {
      code: 'IN',
      name: 'India',
      language: 'hi',
      currency: 'pi',
      basePriceMultiplier: 0.8,
      jobCategories: ['writing', 'design', 'data-entry', 'transcription'],
    },
    {
      code: 'PH',
      name: 'Philippines',
      language: 'en',
      currency: 'pi',
      basePriceMultiplier: 0.9,
      jobCategories: ['writing', 'design', 'moderation', 'support'],
    },
    {
      code: 'BR',
      name: 'Brazil',
      language: 'pt',
      currency: 'pi',
      basePriceMultiplier: 1.0,
      jobCategories: ['writing', 'design', 'transcription', 'analysis'],
    },
    {
      code: 'NG',
      name: 'Nigeria',
      language: 'en',
      currency: 'pi',
      basePriceMultiplier: 0.7,
      jobCategories: ['writing', 'data-entry', 'moderation', 'support'],
    },
    {
      code: 'US',
      name: 'United States',
      language: 'en',
      currency: 'pi',
      basePriceMultiplier: 1.3,
      jobCategories: ['design', 'development', 'writing', 'analysis'],
    },
  ],
};

export const TRUST_CIRCLE_CONFIG = {
  minConnectionsToRate: 2,
  maxArbitratorsPerDispute: 3,
  arbitratorSelectionRadius: 'global', // Select arbitrators from different regions
};

export const REFERRAL_CONFIG = {
  referrerCommissionPercentage: 5,
  referrerCommissionDuration: 30, // days
  refereeDiscount: 0, // No discount, just loyalty building
  minimumReferralPayment: 1,
};

export const REPUTATION_CONFIG = {
  minScoreVisible: 4.0,
  maxScore: 5.0,
  decayRate: 0.001, // Slight decay per day without activity
  accumulationRate: 0.1, // Points gained per positive interaction
};
