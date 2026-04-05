import { v4 as uuidv4 } from 'uuid';

export interface IndonesiaAgent {
  agentId: string;
  name: string;
  internetCafeName: string;
  city: string;
  province: string;
  location: {
    lat: number;
    lng: number;
  };
  operatingHours: {
    open: string;
    close: string;
  };
  phoneNumber: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  commissionsEarned: number;
  usersManaged: number;
  rating: number;
  verifiedSince: Date;
  kyc: {
    verified: boolean;
    idType: 'KTP' | 'SIM' | 'Passport';
    idNumber: string;
    verificationDate: Date;
  };
}

export interface InternetCafeWorker {
  workerId: string;
  agentId: string;
  name: string;
  piAccountLinked: boolean;
  piUsername?: string;
  trainingCompleted: boolean;
  dealsCompleted: number;
  rating: number;
  earnings: number;
  commissionToPlatform: number; // 5-15% based on volume
  commissionToAgent: number; // 10-30% to internet cafe agent
}

export interface IndonesiaJobTemplate {
  templateId: string;
  category: string;
  title: string;
  description: string;
  priceRange: { min: number; max: number };
  requiredSkills: string[];
  region: 'JAVA' | 'SUMATRA' | 'KALIMANTAN' | 'SULAWESI' | 'PAPUA' | 'BALI_NUSA';
  language: 'Indonesian' | 'English' | 'Both';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export class IndonesiaAgentSystem {
  static getMarketOverview() {
    return {
      population: 275_000_000,
      archipelago: {
        islands: 17_000,
        timeZones: 3,
        regions: 6
      },
      infrastructure: {
        internetPenetration: 0.45,
        mobileOnly: 0.80,
        internetCafes: 15000,
        averageSpeedMbps: 8.5
      },
      piPioneers: 3_000_000,
      targetFreelancers: 800_000,
      internetCafeWorkers: 500_000
    };
  }

  static createAgent(data: Partial<IndonesiaAgent>): IndonesiaAgent {
    return {
      agentId: uuidv4(),
      name: data.name || '',
      internetCafeName: data.internetCafeName || '',
      city: data.city || '',
      province: data.province || '',
      location: data.location || { lat: 0, lng: 0 },
      operatingHours: data.operatingHours || { open: '09:00', close: '20:00' },
      phoneNumber: data.phoneNumber || '',
      tier: data.tier || 'BRONZE',
      commissionsEarned: 0,
      usersManaged: 0,
      rating: 5.0,
      verifiedSince: new Date(),
      kyc: data.kyc || {
        verified: false,
        idType: 'KTP',
        idNumber: '',
        verificationDate: new Date()
      }
    };
  }

  static getAgentCommissionStructure() {
    return {
      BRONZE: {
        minDeals: 0,
        platformCommissionShare: 0.90,
        agentCommissionShare: 0.10,
        maxWorkers: 5,
        trainingSupport: 'Email only'
      },
      SILVER: {
        minDeals: 100,
        platformCommissionShare: 0.85,
        agentCommissionShare: 0.15,
        maxWorkers: 20,
        trainingSupport: 'Email + Monthly calls'
      },
      GOLD: {
        minDeals: 500,
        platformCommissionShare: 0.80,
        agentCommissionShare: 0.20,
        maxWorkers: 50,
        trainingSupport: 'Dedicated agent + Quarterly training'
      },
      PLATINUM: {
        minDeals: 2000,
        platformCommissionShare: 0.75,
        agentCommissionShare: 0.25,
        maxWorkers: 200,
        trainingSupport: 'Full-time agent + Custom solutions'
      }
    };
  }

  static calculateWorkerCommission(
    dealAmount: number,
    workerDealCount: number,
    agentTier: string
  ) {
    const platformShare = this.getAgentCommissionStructure()[agentTier as keyof typeof this.getAgentCommissionStructure()]?.platformCommissionShare || 0.90;
    const agentShare = 1 - platformShare;
    
    // Worker gets 85-100% of platform share based on history
    const workerTierMultiplier = workerDealCount < 10 ? 0.85 : workerDealCount < 50 ? 0.90 : 0.95;
    
    const workerEarnings = dealAmount * platformShare * workerTierMultiplier;
    const agentEarnings = dealAmount * agentShare;
    const platformEarnings = dealAmount - workerEarnings - agentEarnings;

    return {
      workerEarnings,
      agentEarnings,
      platformEarnings,
      breakdown: {
        worker: `${(workerTierMultiplier * platformShare * 100).toFixed(1)}%`,
        agent: `${(agentShare * 100).toFixed(1)}%`,
        platform: `${(platformEarnings / dealAmount * 100).toFixed(1)}%`
      }
    };
  }

  static getIndonesiaJobCategories(): IndonesiaJobTemplate[] {
    return [
      {
        templateId: 'id-translation-001',
        category: 'Translation',
        title: 'Indonesian to English Translation (Tourism)',
        description: 'Translate tourism website, hotel descriptions, tour guides',
        priceRange: { min: 100, max: 300 },
        requiredSkills: ['Fluent Indonesian', 'English writing', 'Tourism knowledge'],
        region: 'BALI_NUSA',
        language: 'Both',
        difficulty: 'INTERMEDIATE'
      },
      {
        templateId: 'id-design-001',
        category: 'Design',
        title: 'Cafe Menu Design',
        description: 'Design colorful menus for local cafes and restaurants',
        priceRange: { min: 150, max: 400 },
        requiredSkills: ['Graphic design', 'Canva/Figma', 'Food photography'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'INTERMEDIATE'
      },
      {
        templateId: 'id-smm-001',
        category: 'Social Media',
        title: 'Instagram Management for Micro-Influencers',
        description: 'Manage Instagram for micro-influencers (10K-100K followers)',
        priceRange: { min: 200, max: 500 },
        requiredSkills: ['Content strategy', 'Hashtag research', 'Engagement tactics'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'INTERMEDIATE'
      },
      {
        templateId: 'id-voice-001',
        category: 'Voice/Audio',
        title: 'Indonesian Voiceover for YouTube',
        description: 'Record voiceovers in Indonesian for YouTube videos',
        priceRange: { min: 80, max: 200 },
        requiredSkills: ['Clear Indonesian accent', 'Microphone', 'Audio editing'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'BEGINNER'
      },
      {
        templateId: 'id-data-001',
        category: 'Data Entry',
        title: 'Indonesian Business Database Entry',
        description: 'Enter Indonesian business info into Excel/Airtable',
        priceRange: { min: 60, max: 150 },
        requiredSkills: ['Excel', 'Data accuracy', 'Indonesian knowledge'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'BEGINNER'
      },
      {
        templateId: 'id-moderation-001',
        category: 'Moderation',
        title: 'Indonesian Comment Moderation',
        description: 'Moderate Indonesian comments on YouTube/Facebook',
        priceRange: { min: 50, max: 120 },
        requiredSkills: ['Indonesian fluency', 'Cultural awareness', 'Fast reading'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'BEGINNER'
      },
      {
        templateId: 'id-transcription-001',
        category: 'Transcription',
        title: 'Indonesian Podcast Transcription',
        description: 'Transcribe Indonesian podcasts and interviews',
        priceRange: { min: 70, max: 180 },
        requiredSkills: ['Typing speed', 'Indonesian fluency', 'Audio equipment'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'INTERMEDIATE'
      },
      {
        templateId: 'id-research-001',
        category: 'Research',
        title: 'Indonesian Market Research',
        description: 'Research Indonesian market trends, prices, competitors',
        priceRange: { min: 100, max: 300 },
        requiredSkills: ['Research skills', 'Indonesian knowledge', 'Data compilation'],
        region: 'JAVA',
        language: 'Indonesian',
        difficulty: 'INTERMEDIATE'
      }
    ];
  }

  static getRegionalMarketData() {
    return {
      JAVA: {
        population: 145_000_000,
        internetCafes: 8000,
        urbanization: 0.65,
        avgInternetSpeed: 10,
        demandedJobs: ['Design', 'Social Media', 'Content Creation']
      },
      SUMATRA: {
        population: 50_000_000,
        internetCafes: 3000,
        urbanization: 0.45,
        avgInternetSpeed: 6,
        demandedJobs: ['Translation', 'Data Entry', 'Moderation']
      },
      KALIMANTAN: {
        population: 20_000_000,
        internetCafes: 1500,
        urbanization: 0.35,
        avgInternetSpeed: 5,
        demandedJobs: ['Data Entry', 'Research']
      },
      SULAWESI: {
        population: 20_000_000,
        internetCafes: 1500,
        urbanization: 0.40,
        avgInternetSpeed: 6,
        demandedJobs: ['Voice Work', 'Transcription']
      },
      BALI_NUSA: {
        population: 14_000_000,
        internetCafes: 1200,
        urbanization: 0.50,
        avgInternetSpeed: 12,
        demandedJobs: ['Translation', 'Design', 'Tourism-related']
      },
      PAPUA: {
        population: 4_000_000,
        internetCafes: 300,
        urbanization: 0.25,
        avgInternetSpeed: 4,
        demandedJobs: ['Simple data entry', 'Moderation']
      }
    };
  }

  static getAgentTrainingProgram() {
    return {
      onboarding: [
        'Pi Network basics (30 min)',
        'KYC and verification process (15 min)',
        'Commission structure explanation (20 min)',
        'Platform tour (30 min)',
        'First worker setup (15 min)'
      ],
      monthlyTopics: [
        'New job categories available',
        'Fraud prevention and detection',
        'Worker management best practices',
        'Customer service excellence',
        'Scaling your team'
      ],
      certifications: [
        {
          name: 'Bronze Agent',
          requirements: '5+ deals completed',
          benefits: ['Commission tier', 'Priority support']
        },
        {
          name: 'Silver Agent',
          requirements: '100+ deals, 4.5+ rating',
          benefits: ['Higher commission', 'Training access']
        },
        {
          name: 'Gold Agent',
          requirements: '500+ deals, 4.8+ rating',
          benefits: ['Highest commission', 'Dedicated support']
        }
      ]
    };
  }

  static getIndonesiaPaymentIntegration() {
    return {
      piNetwork: {
        primary: true,
        instant: true,
        fee: 0,
        coverage: '100% of users with Pi account'
      },
      localOptions: [
        {
          name: 'GCash (for Philippines via SMS)',
          fee: 0.03,
          speed: 'Instant'
        },
        {
          name: 'OVO (Indonesia)',
          fee: 0.02,
          speed: '1-5 minutes'
        },
        {
          name: 'Dana (Indonesia)',
          fee: 0.02,
          speed: '1-5 minutes'
        },
        {
          name: 'Bank Transfer (BCA, Mandiri)',
          fee: 0.01,
          speed: '1-4 hours'
        }
      ],
      internetCafeWithdrawal: {
        method: 'Agent directly receives commission in Pi wallet',
        settlement: 'Daily or on-demand',
        minimumPayout: 50
      }
    };
  }
}
