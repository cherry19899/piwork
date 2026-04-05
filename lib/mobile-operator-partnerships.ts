// Mobile Operator Partnership System for Piwork
// Enables Pi-to-mobile-credit conversion across African markets

export interface MobileOperator {
  id: string;
  name: string;
  countries: string[];
  apiEndpoint: string;
  commission: number;
  minTransfer: number;
  maxTransfer: number;
  instantTransfer: boolean;
  currencies: string[];
}

export interface MobilePartnershipConfig {
  operatorId: string;
  piAmount: number;
  phoneNumber: string;
  country: string;
  transferType: 'airtime' | 'data' | 'bundle';
  exchangeRate: number;
  fee: number;
  totalCost: number;
}

export class MobileOperatorPartnershipService {
  private operators: Map<string, MobileOperator> = new Map();

  constructor() {
    this.initializeOperators();
  }

  private initializeOperators() {
    const operators: MobileOperator[] = [
      {
        id: 'orange-senegal',
        name: 'Orange Senegal',
        countries: ['SN'],
        apiEndpoint: 'https://api.orange.sn/mobile-credit',
        commission: 0.05,
        minTransfer: 500,
        maxTransfer: 50000,
        instantTransfer: true,
        currencies: ['XOF'],
      },
      {
        id: 'mtn-senegal',
        name: 'MTN Senegal',
        countries: ['SN'],
        apiEndpoint: 'https://api.mtn.sn/airtime',
        commission: 0.06,
        minTransfer: 500,
        maxTransfer: 75000,
        instantTransfer: true,
        currencies: ['XOF'],
      },
      {
        id: 'orange-ci',
        name: 'Orange Côte d\'Ivoire',
        countries: ['CI'],
        apiEndpoint: 'https://api.orange.ci/mobile-credit',
        commission: 0.05,
        minTransfer: 500,
        maxTransfer: 50000,
        instantTransfer: true,
        currencies: ['XOF'],
      },
      {
        id: 'mtn-ci',
        name: 'MTN Côte d\'Ivoire',
        countries: ['CI'],
        apiEndpoint: 'https://api.mtn.ci/airtime',
        commission: 0.06,
        minTransfer: 500,
        maxTransfer: 75000,
        instantTransfer: true,
        currencies: ['XOF'],
      },
      {
        id: 'ethio-telecom',
        name: 'Ethio Telecom',
        countries: ['ET'],
        apiEndpoint: 'https://api.ethiotelecom.et/mobile-credit',
        commission: 0.07,
        minTransfer: 5,
        maxTransfer: 10000,
        instantTransfer: false,
        currencies: ['ETB'],
      },
      {
        id: 'vodafone-et',
        name: 'Vodafone Ethiopia',
        countries: ['ET'],
        apiEndpoint: 'https://api.vodafone.et/airtime',
        commission: 0.08,
        minTransfer: 5,
        maxTransfer: 15000,
        instantTransfer: false,
        currencies: ['ETB'],
      },
    ];

    operators.forEach((op) => this.operators.set(op.id, op));
  }

  getOperatorsByCountry(countryCode: string): MobileOperator[] {
    return Array.from(this.operators.values()).filter((op) =>
      op.countries.includes(countryCode)
    );
  }

  calculateTransferCost(config: MobilePartnershipConfig): MobilePartnershipConfig {
    const operator = this.operators.get(config.operatorId);
    if (!operator) throw new Error('Operator not found');

    const fee = config.piAmount * operator.commission;
    return {
      ...config,
      fee,
      totalCost: config.piAmount + fee,
    };
  }

  async initiateTransfer(config: MobilePartnershipConfig): Promise<{
    transactionId: string;
    status: string;
    timestamp: number;
  }> {
    // Simulated API call to mobile operator
    return {
      transactionId: `tx-${Date.now()}`,
      status: 'pending',
      timestamp: Date.now(),
    };
  }
}
