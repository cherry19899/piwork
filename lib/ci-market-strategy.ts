// Ivory Coast Market Strategy for Piwork
// Largest West African economy with 8.5M mobile internet users

export interface IvoryCoastMarketProfile {
  population: number;
  piPioneers: number;
  mobileInternet: number;
  gdp: number;
  primaryOperators: string[];
  language: string;
  currency: string;
  serviceDemand: {
    photography: number;
    simpleDesign: number;
    voiceRecording: number;
    dataEntry: number;
  };
}

export class IvoryCoastMarketStrategy {
  readonly profile: IvoryCoastMarketProfile = {
    population: 27.5e6,
    piPioneers: 4.2e6,
    mobileInternet: 8.5e6,
    gdp: 70e9, // USD
    primaryOperators: ['Orange CI', 'MTN CI', 'Koobee', 'Moov CI'],
    language: 'French',
    currency: 'XOF',
    serviceDemand: {
      photography: 0.2,
      simpleDesign: 0.35,
      voiceRecording: 0.2,
      dataEntry: 0.25,
    },
  };

  getMarketOpportunity() {
    return {
      economicSize: 'Largest in West Africa',
      tourismIndustry: 1.2e6, // annual tourists
      designDemand: 'Growing for tourism websites and hospitality',
      creativeClass: 85000, // estimated creatives
    };
  }

  getJobTemplates() {
    return [
      {
        category: 'Tourism Design',
        title: 'Hotel Website Images',
        description: 'Optimize and edit photos for tourism business websites',
        estimatedTime: '1 hour',
        basePay: 12000, // XOF
        targetIndustry: 'hospitality',
      },
      {
        category: 'Social Media Design',
        title: 'Instagram & Facebook Posts',
        description: 'Create social media graphics for local businesses',
        estimatedTime: '1.5 hours',
        basePay: 14000,
        targetIndustry: 'retail and commerce',
      },
      {
        category: 'Data Entry',
        title: 'Tourism Database Entry',
        description: 'Input hotel and restaurant data into Excel spreadsheets',
        estimatedTime: '2 hours',
        basePay: 10000,
        targetIndustry: 'tourism boards',
      },
      {
        category: 'Voiceover',
        title: 'French Voiceovers',
        description: 'Native French speaker voiceovers for tourism content',
        estimatedTime: '3 hours',
        basePay: 18000,
        targetIndustry: 'travel agencies and hotels',
      },
    ];
  }

  getMobileOperatorStrategy() {
    return {
      orangeCI: {
        partnershipType: 'volume-based',
        commission: 0.075,
        targetUsers: 2.5e6,
        benefit: '2-hour customer support priority',
      },
      mtnCI: {
        partnershipType: 'tiered',
        commission: 0.065,
        targetUsers: 1.5e6,
        benefit: 'Marketing support and co-branding',
      },
    };
  }

  getGrowthProjections() {
    return {
      month1: { users: 800, dailyDeals: 80, averageCheckXOF: 3000 },
      month3: { users: 8000, dailyDeals: 800, averageCheckXOF: 3500 },
      month6: { users: 40000, dailyDeals: 4000, averageCheckXOF: 4000 },
      month12: { users: 150000, dailyDeals: 15000, averageCheckXOF: 4500 },
    };
  }

  getTourismCollaborations() {
    return [
      'Ivory Coast Tourism Board',
      'Hotel Owners Association (AHOTCI)',
      'Chamber of Commerce Abidjan',
      'Creative Industry Federation',
    ];
  }
}
