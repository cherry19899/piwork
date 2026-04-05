import { format } from 'date-fns';

export interface NigeriaMarketData {
  populationMillion: number;
  youthPercentage: number;
  graduateUnemploymentRate: number;
  piPioneers: number;
  internetPenetration: number;
  primaryLanguages: string[];
  internetChallenges: string[];
}

export interface NigeriaJobCategory {
  name: string;
  demandLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  avgRate: number;
  requiredSkills: string[];
  offlineCapable: boolean;
  videoProof: boolean;
  localLanguageSupport: string[];
}

export interface OfflineChatQueue {
  messageId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
  synced: boolean;
  attachments: string[];
}

export class NigeriaMarketOptimization {
  static getMarketOverview(): NigeriaMarketData {
    return {
      populationMillion: 223,
      youthPercentage: 0.42,
      graduateUnemploymentRate: 0.40,
      piPioneers: 5_000_000,
      internetPenetration: 0.35,
      primaryLanguages: ['English', 'Pidgin English', 'Yoruba', 'Hausa'],
      internetChallenges: [
        'Unstable 4G/LTE connections',
        'High data costs',
        'Power outages affecting WiFi',
        'Peak hour congestion',
        'Rural areas with no coverage'
      ]
    };
  }

  static getNigeriaJobCategories(): NigeriaJobCategory[] {
    return [
      {
        name: 'TikTok Content Creation',
        demandLevel: 'CRITICAL',
        avgRate: 80,
        requiredSkills: [
          'Video editing',
          'Trending audio',
          'Hook creation',
          'Hashtag strategy'
        ],
        offlineCapable: false,
        videoProof: true,
        localLanguageSupport: ['English', 'Pidgin']
      },
      {
        name: 'Excel Data Processing',
        demandLevel: 'HIGH',
        avgRate: 60,
        requiredSkills: [
          'Excel formulas',
          'Data cleaning',
          'Pivot tables',
          'VLOOKUP'
        ],
        offlineCapable: true,
        videoProof: false,
        localLanguageSupport: ['English']
      },
      {
        name: 'Pidgin English Voiceover',
        demandLevel: 'CRITICAL',
        avgRate: 120,
        requiredSkills: [
          'Native Pidgin speaker',
          'Clear pronunciation',
          'Audio equipment',
          'Script interpretation'
        ],
        offlineCapable: false,
        videoProof: true,
        localLanguageSupport: ['Pidgin English']
      },
      {
        name: 'Instagram Content Curation',
        demandLevel: 'HIGH',
        avgRate: 90,
        requiredSkills: [
          'Content calendar',
          'Caption writing',
          'Engagement tactics',
          'Trend awareness'
        ],
        offlineCapable: false,
        videoProof: false,
        localLanguageSupport: ['English']
      },
      {
        name: 'YouTube Thumbnail Design',
        demandLevel: 'HIGH',
        avgRate: 150,
        requiredSkills: [
          'Photoshop/Canva',
          'A/B testing',
          'Color psychology',
          'CTR optimization'
        ],
        offlineCapable: false,
        videoProof: true,
        localLanguageSupport: ['English']
      },
      {
        name: 'Transcription (Pidgin)',
        demandLevel: 'MEDIUM',
        avgRate: 70,
        requiredSkills: [
          'Pidgin fluency',
          'Fast typing',
          'Attention to detail',
          'Audio equipment'
        ],
        offlineCapable: false,
        videoProof: false,
        localLanguageSupport: ['Pidgin English']
      },
      {
        name: 'Email List Building',
        demandLevel: 'MEDIUM',
        avgRate: 100,
        requiredSkills: [
          'Lead generation',
          'Email scraping',
          'Data validation',
          'CRM knowledge'
        ],
        offlineCapable: true,
        videoProof: false,
        localLanguageSupport: ['English']
      }
    ];
  }

  static getOfflineInternetStrategy() {
    return {
      challenge: 'Unstable internet (3G/2G fallback)',
      solution: 'Aggressive offline-first chat with queue management',
      implementation: {
        messageQueueing: {
          storage: 'IndexedDB',
          maxQueueSize: 1000,
          compressionEnabled: true,
          attachmentHandling: 'Base64 encode up to 5MB'
        },
        syncTriggers: [
          'Every 5 minutes when connected',
          'On manual refresh',
          'When connection upgraded to 4G',
          'Every 30 minutes in background'
        ],
        connectionStates: {
          offline: 'Queue locally, show offline badge',
          slowMobile: 'Compress text, defer attachments',
          mobile3g: 'Queue with priority system',
          wifi: 'Immediate sync, send queued messages'
        },
        retryLogic: {
          maxRetries: 10,
          backoffMultiplier: 1.5,
          maxWaitTime: 3600000 // 1 hour
        }
      }
    };
  }

  static getNigeriaPricingStrategy() {
    return {
      basePriceMultiplier: 0.65, // 65% of US rates
      powerParity: 0.45, // Adjusted for purchasing power
      graduateUnemploymentAdjustment: 0.80, // Lower prices to capture unemployment market
      tieringSystem: {
        beginner: {
          multiplier: 0.50,
          minRating: 0,
          maxDealsPerDay: 3
        },
        intermediate: {
          multiplier: 0.75,
          minRating: 3.5,
          maxDealsPerDay: 8
        },
        experienced: {
          multiplier: 1.0,
          minRating: 4.5,
          maxDealsPerDay: 15
        }
      },
      recommendedPriceRanges: {
        dataEntry: { low: 30, high: 80 },
        contentCreation: { low: 60, high: 200 },
        voiceover: { low: 80, high: 150 },
        design: { low: 100, high: 400 }
      }
    };
  }

  static getNigeriaMarketingStrategy() {
    return {
      primaryChannels: [
        {
          platform: 'WhatsApp Groups',
          reach: 3_000_000,
          groups: [
            'Nigerian Freelancers',
            'Remote Work Nigeria',
            'TikTok Creators Nigeria',
            'Side Hustle Network'
          ],
          strategy: 'Daily tips, earnings screenshots, success stories'
        },
        {
          platform: 'Facebook Groups',
          reach: 2_500_000,
          groups: [
            'Work from Home Nigeria',
            'Nigerian Online Workers',
            'Digital Marketing Nigeria',
            'Content Creators Hub'
          ],
          strategy: 'Educational posts, Q&A, weekly challenges'
        },
        {
          platform: 'TikTok',
          reach: 5_000_000,
          content: [
            'Earnings reviews (Pidgin)',
            'Before/after stories',
            'Quick tips in Pidgin',
            'Day-in-life content creator',
            'How to earn 10,000 NGN/day'
          ],
          strategy: 'Viral growth, influencer partnerships'
        },
        {
          platform: 'Instagram Reels',
          reach: 1_500_000,
          content: [
            'Success testimonials',
            'Skill tutorials',
            'Payment proofs',
            'Beginner guides'
          ],
          strategy: 'Engagement, community building'
        }
      ],
      localInfluencers: [
        'Tech YouTubers (500K+)',
        'TikTok creators (100K+)',
        'LinkedIn professionals',
        'WhatsApp group admins'
      ],
      estimatedMonth1Reach: 500_000,
      estimatedMonth3Signups: 50_000
    };
  }

  static getInternetInfrastructureOptimization() {
    return {
      imageSizes: {
        thumbnail: { width: 120, height: 120, quality: 40 },
        card: { width: 300, height: 200, quality: 50 },
        profile: { width: 200, height: 200, quality: 60 },
        fullscreen: { width: 600, height: 800, quality: 70 }
      },
      dataLimits: {
        chatPage: '2MB max',
        jobListing: '1.5MB max',
        profilePage: '1.2MB max',
        totalAppDaily: '50MB max for moderate user'
      },
      compressionStrategy: {
        images: 'WebP format with JPEG fallback',
        text: 'Gzip compression',
        api: 'Only send changed data (Delta sync)',
        cache: 'Aggressive HTTP caching headers'
      },
      offlineFirstApproach: {
        database: 'SQLite.js for offline data',
        syncQueue: 'Track all actions locally',
        conflictResolution: 'Last-write-wins',
        bandwidth: 'Only sync on 3G+ speeds'
      }
    };
  }

  static getPaymentOptimization() {
    return {
      challenge: 'Many users without traditional banks',
      solution: 'Direct Pi Network payment + local payment gateway fallback',
      piPayment: {
        primary: true,
        instantSettlement: true,
        noFeeForWithdrawal: true,
        minimumPayout: 10
      },
      fallbackGateways: [
        {
          name: 'Flutterwave',
          coverage: 'Moble money (MTN, Airtel)',
          fee: 0.025,
          speed: 'Instant'
        },
        {
          name: 'Paystack',
          coverage: 'Bank account, card',
          fee: 0.015,
          speed: '2-4 hours'
        }
      ],
      escrow: {
        feePercentage: 0,
        holdingPeriod: 48,
        autoRelease: true
      }
    };
  }
}
