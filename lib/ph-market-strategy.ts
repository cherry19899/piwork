import { format } from 'date-fns';

export interface PhilippinesMarketData {
  piPioneers: number;
  unbankedPercentage: number;
  targetDemographics: string[];
  competitiveAdvantages: string[];
  initialTargetCities: string[];
  estimatedGrowthMonthly: number;
}

export interface PHCompetitiveAnalysis {
  competitor: string;
  platform: string;
  commission: number;
  bankingRequirement: boolean;
  paymentMethod: string;
  advantages: string[];
  weaknesses: string[];
}

export class PHMarketStrategy {
  static getMarketOverview(): PhilippinesMarketData {
    return {
      piPioneers: 12_000_000,
      unbankedPercentage: 0.70,
      targetDemographics: [
        'Virtual Assistants (VA)',
        'Call Center Agents',
        'Graphic Designers',
        'Content Creators',
        'Data Entry Specialists',
        'English Teachers',
        'Voice Artists'
      ],
      competitiveAdvantages: [
        'Direct payment to phone via Pi',
        'Zero banking requirement',
        'Lower fees than OnlineJobs.ph',
        'Instant Pi settlement',
        'Social circle trust verification',
        'No monthly membership fees'
      ],
      initialTargetCities: [
        'Metro Manila',
        'Cebu',
        'Davao',
        'Quezon City',
        'Makati'
      ],
      estimatedGrowthMonthly: 0.30
    };
  }

  static getCompetitiveComparison(): PHCompetitiveAnalysis[] {
    return [
      {
        competitor: 'OnlineJobs.ph',
        platform: 'Web-based',
        commission: 0.08,
        bankingRequirement: true,
        paymentMethod: 'Bank transfer',
        advantages: [
          'Established brand',
          'Large job pool',
          'Long history'
        ],
        weaknesses: [
          'Requires Philippine bank account',
          '8% commission',
          'PayPal/Wise required for withdrawal',
          'Slow payment processing',
          'No mobile-first experience'
        ]
      },
      {
        competitor: 'Upwork (Global)',
        platform: 'Web + Mobile',
        commission: 0.10,
        bankingRequirement: true,
        paymentMethod: 'PayPal/Wise',
        advantages: [
          'Global reach',
          'Strong payment infrastructure'
        ],
        weaknesses: [
          '10% commission',
          'Requires international payment method',
          'Banking infrastructure heavy',
          'Competitive for beginners',
          'Not mobile-optimized for low-end Android'
        ]
      },
      {
        competitor: 'Fiverr',
        platform: 'Web + Mobile',
        commission: 0.20,
        bankingRequirement: true,
        paymentMethod: 'PayPal/Wise',
        advantages: [
          'Popular brand',
          'Fixed pricing model'
        ],
        weaknesses: [
          '20% commission',
          'Requires bank account',
          'High competition',
          'Slow payment processing',
          'Not designed for emerging markets'
        ]
      }
    ];
  }

  static getPhilippineJobDemandTrends() {
    return {
      virtualAssistant: {
        demand: 'VERY_HIGH',
        avgRate: 150,
        clients: 'US/UK businesses',
        skills: ['Calendar management', 'Email', 'Data entry', 'Social media management']
      },
      callCenterServices: {
        demand: 'HIGH',
        avgRate: 120,
        clients: 'International companies',
        skills: ['Customer service', 'Technical support', 'Sales']
      },
      graphicDesign: {
        demand: 'HIGH',
        avgRate: 250,
        clients: 'Small businesses, startups',
        skills: ['Logo design', 'Social media graphics', 'Flyer design']
      },
      contentCreation: {
        demand: 'VERY_HIGH',
        avgRate: 180,
        clients: 'YouTubers, TikTokers, Instagram influencers',
        skills: ['Video editing', 'Thumbnail design', 'Caption writing']
      },
      englishTutoring: {
        demand: 'MEDIUM',
        avgRate: 100,
        clients: 'Students from other countries',
        skills: ['IELTS preparation', 'Conversational English', 'Business English']
      }
    };
  }

  static getPhMarketingChannels() {
    return [
      {
        channel: 'Facebook Groups',
        groups: [
          'Virtual Assistants Philippines',
          'Filipino Freelancers',
          'Online Jobs Philippines',
          'Work from Home Philippines'
        ],
        estimatedReach: 500_000
      },
      {
        channel: 'Telegram Communities',
        groups: [
          'Filipino Remote Workers',
          'Online Jobs PH',
          'VA Philippines Network'
        ],
        estimatedReach: 100_000
      },
      {
        channel: 'TikTok',
        content: [
          'VA success stories',
          'Quick micro-jobs',
          'Earning testimonials',
          'How-to freelance guides'
        ],
        estimatedReach: 2_000_000
      },
      {
        channel: 'YouTube',
        content: [
          'Tutorial videos',
          'Earnings reviews',
          'How to get started',
          'Interview with successful users'
        ],
        estimatedReach: 1_000_000
      }
    ];
  }

  static calculateMarketEntry() {
    const basePioneers = 12_000_000;
    const unbanked = basePioneers * 0.70;
    const targetAudience = unbanked * 0.15; // 15% interested in freelancing
    const month1Target = targetAudience * 0.01; // 1% signup in month 1
    const month3Projection = month1Target * 3.5; // 3.5x growth by month 3
    const month6Projection = month1Target * 15; // 15x growth by month 6

    return {
      totalPioneers: basePioneers,
      unbankedPopulation: Math.round(unbanked),
      potentialFreelancers: Math.round(targetAudience),
      month1SignupTarget: Math.round(month1Target),
      month3Projection: Math.round(month3Projection),
      month6Projection: Math.round(month6Projection),
      successMetrics: {
        avgDealsPerUser: 3.5,
        conversionRate: 0.12,
        retentionRate: 0.75
      }
    };
  }
}
