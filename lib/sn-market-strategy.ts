// Senegal Market Strategy for Piwork
// West Africa francophone market with strong mobile penetration

export interface SenegalMarketProfile {
  population: number;
  piPioneers: number;
  mobileInternet: number;
  primaryOperators: string[];
  language: string;
  currency: string;
  serviceDemand: {
    photography: number;
    simpleDesign: number;
    voiceRecording: number;
    transcription: number;
  };
}

export class SenegalMarketStrategy {
  readonly profile: SenegalMarketProfile = {
    population: 17.7e6,
    piPioneers: 2.8e6,
    mobileInternet: 7.5e6,
    primaryOperators: ['Orange Senegal', 'MTN Senegal', 'Sonatel'],
    language: 'French/Wolof',
    currency: 'XOF',
    serviceDemand: {
      photography: 0.25,
      simpleDesign: 0.3,
      voiceRecording: 0.25,
      transcription: 0.2,
    },
  };

  getGrowthProjections() {
    return {
      month1: { users: 500, dailyDeals: 50, avirageCheckXOF: 2500 },
      month3: { users: 5000, dailyDeals: 500, avirageCheckXOF: 3000 },
      month6: { users: 25000, dailyDeals: 2500, avirageCheckXOF: 3500 },
    };
  }

  getJobTemplates() {
    return [
      {
        category: 'Photography',
        title: 'Product Photo Enhancement',
        description: 'Adjust lighting, crop, simple edits for local businesses',
        estimatedTime: '30 min',
        basePay: 8000, // XOF
        samples: ['clothing', 'furniture', 'food'],
      },
      {
        category: 'Simple Design',
        title: 'Social Media Graphics',
        description: 'Design Instagram posts for local shops (Canva templates okay)',
        estimatedTime: '1 hour',
        basePay: 10000,
        samples: ['restaurant', 'salon', 'boutique'],
      },
      {
        category: 'Voice Recording',
        title: 'Voiceover Recordings',
        description: 'Record French/Wolof voiceovers for local content creators',
        estimatedTime: '2 hours',
        basePay: 15000,
        samples: ['ads', 'tutorials', 'announcements'],
      },
    ];
  }

  getMobileOperatorStrategy() {
    return {
      orangeSenegal: {
        partnershipType: 'revenue-share',
        commission: 0.08,
        targetUsers: 1.2e6,
        incentive: 'Free data bundle with each 5 transfers',
      },
      mtnSenegal: {
        partnershipType: 'commission',
        commission: 0.07,
        targetUsers: 0.8e6,
        incentive: 'Loyalty points program',
      },
    };
  }

  getMarketingChannels() {
    return [
      { channel: 'WhatsApp Groups', reach: 500000, cost: 'organic' },
      { channel: 'Facebook Groups', reach: 300000, cost: 'organic' },
      { channel: 'Influencer Partnerships', reach: 250000, cost: '50k XOF' },
      { channel: 'Radio Ads', reach: 1000000, cost: '500k XOF' },
      { channel: 'SMS Campaigns', reach: 2000000, cost: '10k XOF per 1000' },
    ];
  }
}
