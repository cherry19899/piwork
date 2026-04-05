// Ethiopia Market Strategy for Piwork
// Fastest growing African economy with 120M population

export interface EthiopiaMarketProfile {
  population: number;
  piPioneers: number;
  mobileInternet: number;
  urbanPopulation: number;
  primaryOperators: string[];
  language: string;
  currency: string;
  economyGrowthRate: number;
  challenge: string;
}

export class EthiopiaMarketStrategy {
  readonly profile: EthiopiaMarketProfile = {
    population: 123.4e6,
    piPioneers: 8.5e6,
    mobileInternet: 18e6,
    urbanPopulation: 35e6,
    primaryOperators: ['Ethio Telecom', 'Vodafone Ethiopia'],
    language: 'Amharic',
    currency: 'ETB',
    economyGrowthRate: 0.11, // 11% annual growth
    challenge: 'Government-controlled telecom, limited operators',
  };

  getMarketCharacteristics() {
    return {
      demographic: 'Young population (67% under 25)',
      employmentRate: '5-8% unemployment among youth',
      internetSpeed: 'Improving, but limited in rural areas',
      entrepreneurship: 'High (small business culture)',
      remittances: 5.5e9, // USD annual, second source of income after agriculture
    };
  }

  getJobTemplates() {
    return [
      {
        category: 'Basic Photography',
        title: 'Photo Tagging for Archives',
        description: 'Organize and tag historical or business photo archives',
        estimatedTime: '2 hours',
        basePay: 150, // ETB
        targetIndustry: 'archives and digitization',
      },
      {
        category: 'Simple Design',
        title: 'Local Business Banners',
        description: 'Design simple banners for local Amharic businesses',
        estimatedTime: '2 hours',
        basePay: 200,
        targetIndustry: 'local commerce',
      },
      {
        category: 'Voice Recording',
        title: 'Amharic Voiceovers',
        description: 'Record Amharic narration for local media projects',
        estimatedTime: '3 hours',
        basePay: 300,
        targetIndustry: 'media and broadcasting',
      },
      {
        category: 'Audio Transcription',
        title: 'Amharic Transcription',
        description: 'Transcribe Amharic audio to text (meetings, interviews)',
        estimatedTime: '4 hours',
        basePay: 250,
        targetIndustry: 'business and journalism',
      },
    ];
  }

  getMobileOperatorStrategy() {
    return {
      ethioTelecom: {
        partnershipType: 'government-approved',
        commission: 0.08,
        challenge: 'Approval process can take 2-3 months',
        benefit: 'Access to 68% of mobile subscribers',
        strategy: 'Regulatory compliance and local partnerships required',
      },
      vodafone: {
        partnershipType: 'commercial',
        commission: 0.09,
        challenge: 'Limited to urban areas',
        benefit: 'Faster approval, modern payment infrastructure',
        strategy: 'Focus on Addis Ababa metropolitan area initially',
      },
    };
  }

  getGrowthProjections() {
    return {
      month1: {
        users: 300,
        dailyDeals: 30,
        averageCheckETB: 1200,
        note: 'Slower start due to approval process',
      },
      month3: { users: 2000, dailyDeals: 200, averageCheckETB: 1400 },
      month6: { users: 10000, dailyDeals: 1000, averageCheckETB: 1600 },
      month12: { users: 50000, dailyDeals: 5000, averageCheckETB: 1800 },
    };
  }

  getMarketingStrategy() {
    return [
      {
        channel: 'Addis Ababa tech meetups',
        reach: 5000,
        cost: 'organic',
      },
      {
        channel: 'University partnerships (AAU, Addis Science)',
        reach: 15000,
        cost: 'sponsorship',
      },
      {
        channel: 'Ethiopian diaspora communities (TikTok, WhatsApp)',
        reach: 100000,
        cost: 'organic',
      },
      {
        channel: 'SMS campaigns (Ethio Telecom partnership)',
        reach: 500000,
        cost: '5 ETB per 1000 SMS',
      },
    ];
  }

  getLocalPartnerships() {
    return [
      'Ethiopian Software Association',
      'Addis Ababa Chamber of Commerce',
      'Tech startups (iCog Labs, Lablet)',
      'NGOs (local employment initiatives)',
    ];
  }

  getChallengesAndSolutions() {
    return [
      {
        challenge: 'Limited internet infrastructure outside urban areas',
        solution:
          'Offline-first app design, SMS-based onboarding for rural users',
      },
      {
        challenge: 'Limited digital payment penetration',
        solution: 'Mobile credit integration with Ethio Telecom',
      },
      {
        challenge: 'Government control of telecom',
        solution: 'Compliance-first approach, official partnerships',
      },
      {
        challenge: 'Language barrier (Amharic dominant)',
        solution: 'Full Amharic UI, local customer support',
      },
    ];
  }
}
