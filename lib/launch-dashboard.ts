import { Timestamp } from 'firebase/firestore';

export type RegionName = 'philippines' | 'nigeria' | 'indonesia' | 'vietnam';

export interface RegionalLaunchMetrics {
  region: RegionName;
  seedJobs: number; // Target: 10 real jobs
  completedJobs: number;
  totalUsers: number;
  activeWorkers: number;
  activeClients: number;
  totalEarnings: number;
  testimonials: VideoTestimonial[];
  socialMediaReach: number;
  piNetworkUsers: number; // Estimated Pi users in region
  launchStatus: 'planning' | 'seeding' | 'active' | 'scaling';
  startDate?: Timestamp;
  targetUsers: number; // Growth target
  growthRate: number; // % monthly growth
}

export interface VideoTestimonial {
  id: string;
  userId: string;
  userName: string;
  jobTitle: string;
  videoUrl: string;
  duration: number; // seconds
  earnings: number; // Pi earned
  completedJobs: number;
  rating: number; // 1-5
  feedback: string;
  recordedAt: Timestamp;
  postedAt: Timestamp;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'local';
  region: RegionName;
  views: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SeedJob {
  id: string;
  region: RegionName;
  title: string;
  description: string;
  category: string;
  piAmount: number;
  createdBy: 'platform' | string; // 'platform' for seed jobs
  acceptedBy?: string;
  completedBy?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  deadline: Timestamp;
  isTestimonialJob: boolean; // If true, worker records video
  priority: number; // 1-10
}

export interface SocialMediaCampaign {
  id: string;
  region: RegionName;
  platform: 'facebook_groups' | 'telegram' | 'whatsapp' | 'local_forums';
  targetGroups: string[]; // Group names/IDs
  content: {
    title: string;
    description: string;
    testimonialVideos: string[]; // Video URLs
    jobExamples: SeedJob[];
  };
  launchDate: Timestamp;
  status: 'planned' | 'active' | 'completed';
  reach: number;
  conversions: number;
  signups: number;
}

export interface RegionalStrategy {
  region: RegionName;
  piNetworkSaturation: number; // % of population with Pi
  averageJobValue: number; // Adjusted for region
  focusCategories: string[];
  socialMediaStrategy: string;
  influencers: string[]; // Local influencer contacts
  marketGap: string; // What service gap we fill
  competitiveSituation: string;
  estimatedLaunchCost: number; // In Pi
  targetMonthlyGrowth: number; // %
}

export class LaunchDashboardService {
  static readonly PRIORITY_REGIONS: RegionName[] = [
    'philippines',
    'nigeria',
    'indonesia',
    'vietnam',
  ];

  static readonly REGIONAL_STRATEGIES: Record<RegionName, RegionalStrategy> = {
    philippines: {
      region: 'philippines',
      piNetworkSaturation: 0.35, // 35% have Pi
      averageJobValue: 25, // Pi
      focusCategories: [
        'writing',
        'customer_support',
        'data_entry',
        'social_media',
        'moderation',
      ],
      socialMediaStrategy:
        'Facebook groups + Instagram + TikTok (high youth population)',
      influencers: [
        'OFW groups',
        'Tech communities',
        'Freelancer networks',
      ],
      marketGap: 'Low-cost freelance platform for emerging market',
      competitiveSituation: 'Upwork exists but high fees, Fiverr competition low',
      estimatedLaunchCost: 500,
      targetMonthlyGrowth: 15,
    },
    nigeria: {
      region: 'nigeria',
      piNetworkSaturation: 0.28,
      averageJobValue: 20,
      focusCategories: [
        'writing',
        'design',
        'transcription',
        'data_entry',
        'analysis',
      ],
      socialMediaStrategy:
        'WhatsApp + Telegram + Facebook (strong creator economy)',
      influencers: [
        'Content creator communities',
        'Tech hubs',
        'Freelancer groups',
      ],
      marketGap: 'Local payment solution for creators',
      competitiveSituation: 'Fiverr popular but Payoneer fees high',
      estimatedLaunchCost: 400,
      targetMonthlyGrowth: 12,
    },
    indonesia: {
      region: 'indonesia',
      piNetworkSaturation: 0.32,
      averageJobValue: 22,
      focusCategories: [
        'design',
        'writing',
        'development',
        'translation',
        'moderation',
      ],
      socialMediaStrategy:
        'Telegram + Instagram + Local forums (tech-savvy youth)',
      influencers: [
        'Tech startups',
        'Digital nomad communities',
        'Designer groups',
      ],
      marketGap: 'Crypto-native freelance platform',
      competitiveSituation: 'Limited local solutions, global platforms dominant',
      estimatedLaunchCost: 450,
      targetMonthlyGrowth: 14,
    },
    vietnam: {
      region: 'vietnam',
      piNetworkSaturation: 0.3,
      averageJobValue: 18,
      focusCategories: [
        'translation',
        'writing',
        'data_entry',
        'support',
        'testing',
      ],
      socialMediaStrategy:
        'Facebook + Zalo + Local groups (mobile-first internet)',
      influencers: [
        'Freelancer networks',
        'Tech communities',
        'Student groups',
      ],
      marketGap: 'Mobile-first crypto jobs platform',
      competitiveSituation: 'Strong local platforms, gap for crypto integration',
      estimatedLaunchCost: 350,
      targetMonthlyGrowth: 11,
    },
  };

  /**
   * Initialize regional launch metrics
   */
  static initializeRegionalMetrics(
    region: RegionName
  ): RegionalLaunchMetrics {
    const strategy = this.REGIONAL_STRATEGIES[region];
    return {
      region,
      seedJobs: 0,
      completedJobs: 0,
      totalUsers: 0,
      activeWorkers: 0,
      activeClients: 0,
      totalEarnings: 0,
      testimonials: [],
      socialMediaReach: 0,
      piNetworkUsers: Math.floor(
        100000000 * strategy.piNetworkSaturation
      ), // Rough estimate
      launchStatus: 'planning',
      targetUsers: 10000,
      growthRate: 0,
    };
  }

  /**
   * Create seed job for regional launch
   */
  static createSeedJob(
    region: RegionName,
    title: string,
    description: string,
    category: string,
    piAmount: number,
    isTestimonialJob: boolean = false,
    priority: number = 5
  ): SeedJob {
    const now = Timestamp.now();
    const deadline = new Timestamp(
      now.seconds + 7 * 24 * 60 * 60, // 7 days
      now.nanoseconds
    );

    return {
      id: `seed_${region}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      region,
      title,
      description,
      category,
      piAmount,
      createdBy: 'platform',
      status: 'open',
      createdAt: now,
      deadline,
      isTestimonialJob,
      priority,
    };
  }

  /**
   * Record video testimonial from job completion
   */
  static recordTestimonial(
    userId: string,
    userName: string,
    jobTitle: string,
    videoUrl: string,
    duration: number,
    earnings: number,
    completedJobs: number,
    rating: number,
    feedback: string,
    platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'local',
    region: RegionName
  ): VideoTestimonial {
    return {
      id: `testimonial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      jobTitle,
      videoUrl,
      duration,
      earnings,
      completedJobs,
      rating,
      feedback,
      recordedAt: Timestamp.now(),
      postedAt: Timestamp.now(),
      platform,
      region,
      views: 0,
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
      },
    };
  }

  /**
   * Create social media campaign for regional launch
   */
  static createCampaign(
    region: RegionName,
    platform: 'facebook_groups' | 'telegram' | 'whatsapp' | 'local_forums',
    targetGroups: string[],
    testimonialVideos: string[],
    seedJobs: SeedJob[]
  ): SocialMediaCampaign {
    return {
      id: `campaign_${region}_${Date.now()}`,
      region,
      platform,
      targetGroups,
      content: {
        title: `Earn Pi with Piwork in ${region}`,
        description: `Join ${this.REGIONAL_STRATEGIES[region].piNetworkUsers.toLocaleString()} potential workers. First 10 jobs available now.`,
        testimonialVideos,
        jobExamples: seedJobs.slice(0, 3),
      },
      launchDate: Timestamp.now(),
      status: 'planned',
      reach: 0,
      conversions: 0,
      signups: 0,
    };
  }

  /**
   * Calculate launch readiness score (0-100)
   */
  static calculateLaunchReadiness(metrics: RegionalLaunchMetrics): number {
    let score = 0;

    // Seed jobs completed: 30 points
    score += Math.min(
      30,
      (metrics.completedJobs / metrics.seedJobs) * 30
    );

    // Testimonials recorded: 20 points
    score += Math.min(20, (metrics.testimonials.length / 3) * 20);

    // Social media reach: 25 points
    score +=
      Math.min(25, (metrics.socialMediaReach / 50000) * 25);

    // Active community: 25 points
    score +=
      Math.min(25, (metrics.activeWorkers / 100) * 25);

    return Math.round(score);
  }

  /**
   * Get regional launch checklist
   */
  static getLaunchChecklist(region: RegionName): string[] {
    return [
      'Find 10 real jobs manually in regional market',
      'Complete jobs and verify quality on platform',
      'Record 3-5 video testimonials from workers',
      'Post testimonials to YouTube/TikTok/Instagram',
      'Create 5+ social media posts with examples',
      `Post to ${this.REGIONAL_STRATEGIES[region].socialMediaStrategy}`,
      `Contact ${this.REGIONAL_STRATEGIES[region].influencers.length} potential influencers`,
      'Achieve $50+ in platform volume',
      'Get 20+ sign-ups from regional campaign',
      'Establish first 5 client-worker relationships',
      'Document success stories and metrics',
      'Plan Phase 2: retention and growth targeting',
    ];
  }

  /**
   * Calculate estimated reach and ROI
   */
  static estimateReachAndROI(
    campaign: SocialMediaCampaign
  ): {
    estimatedReach: number;
    estimatedSignups: number;
    estimatedROI: number;
  } {
    const platformMultipliers: Record<
      'facebook_groups' | 'telegram' | 'whatsapp' | 'local_forums',
      number
    > = {
      facebook_groups: 5000,
      telegram: 3000,
      whatsapp: 2000,
      local_forums: 1000,
    };

    const baseReach = platformMultipliers[campaign.platform];
    const reach = baseReach * campaign.targetGroups.length;
    const conversionRate = 0.02; // 2% conversion
    const signups = Math.round(reach * conversionRate);
    const jobValue = 25; // Average job value in Pi
    const expectedJobs = signups * 0.5; // 50% of signups complete jobs
    const roi = (expectedJobs * jobValue * 0.05) / 500; // 5% platform fee, $500 cost

    return {
      estimatedReach: reach,
      estimatedSignups: signups,
      estimatedROI: Math.round(roi * 100),
    };
  }
}
