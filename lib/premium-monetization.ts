export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  cost: number; // in Pi
  type: 'one-time' | 'subscription';
  enabled: boolean;
}

export interface JobBoost {
  id: string;
  jobId: string;
  type: 'listing' | 'urgent' | 'featured';
  cost: number;
  duration: number; // in hours
  appliedAt: number;
  expiresAt: number;
}

export interface ProSubscription {
  userId: string;
  tier: 'free' | 'pro';
  startDate: number;
  endDate: number;
  autoRenew: boolean;
  monthlyPrice: number; // 100 Pi
  features: {
    zeroCommission: boolean;
    trustBadge: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    customProfile: boolean;
  };
}

export interface PortfolioVerification {
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  cost: number; // 10 Pi
  notes?: string;
}

// Premium Features Definition
export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  BOOST_LISTING: {
    id: 'boost_listing',
    name: 'Boost Job Listing',
    description: 'Push your job to the top of search results for 24 hours',
    cost: 5,
    type: 'one-time',
    enabled: true,
  },
  URGENT_FLAG: {
    id: 'urgent_flag',
    name: 'Mark as Urgent',
    description: 'Display job with red urgent indicator for 12 hours',
    cost: 3,
    type: 'one-time',
    enabled: true,
  },
  PORTFOLIO_VERIFICATION: {
    id: 'portfolio_verification',
    name: 'Portfolio Verification',
    description: 'Have moderator verify your portfolio and display verification badge',
    cost: 10,
    type: 'one-time',
    enabled: true,
  },
  PRO_SUBSCRIPTION: {
    id: 'pro_subscription',
    name: 'Pro Subscription',
    description: 'Monthly subscription with zero commission and trust badge',
    cost: 100,
    type: 'subscription',
    enabled: true,
  },
};

// Calculate fee for a job
export function calculateJobFee(
  jobAmount: number,
  isUserProMember: boolean,
  isPlatformProMember: boolean
): { platformFee: number; netAmount: number } {
  let feePercentage = 0.1; // 10% default fee

  if (isUserProMember) {
    feePercentage = 0; // Pro members pay zero commission
  } else if (isPlatformProMember) {
    feePercentage = 0.05; // 5% fee if platform member
  }

  const platformFee = Math.round(jobAmount * feePercentage * 100) / 100;
  const netAmount = jobAmount - platformFee;

  return { platformFee, netAmount };
}

// Apply boost to a job
export function applyBoost(
  jobId: string,
  boostType: 'listing' | 'urgent' | 'featured'
): JobBoost {
  const durations: Record<string, number> = {
    listing: 24 * 60 * 60 * 1000, // 24 hours
    urgent: 12 * 60 * 60 * 1000, // 12 hours
    featured: 48 * 60 * 60 * 1000, // 48 hours
  };

  const costs: Record<string, number> = {
    listing: 5,
    urgent: 3,
    featured: 10,
  };

  const now = Date.now();
  return {
    id: `${jobId}-${boostType}-${now}`,
    jobId,
    type: boostType,
    cost: costs[boostType],
    duration: durations[boostType],
    appliedAt: now,
    expiresAt: now + durations[boostType],
  };
}

// Check if boost is active
export function isBoostActive(boost: JobBoost): boolean {
  return Date.now() < boost.expiresAt;
}

// Calculate Pro subscription benefits
export function getProSubscriptionBenefits(): ProSubscription['features'] {
  return {
    zeroCommission: true,
    trustBadge: true,
    prioritySupport: true,
    advancedAnalytics: true,
    customProfile: true,
  };
}

// Check if user is active Pro member
export function isActiveProMember(subscription: ProSubscription | null): boolean {
  if (!subscription) return false;
  return subscription.tier === 'pro' && Date.now() < subscription.endDate;
}

// Calculate Pro subscription renewal date
export function calculateProRenewalDate(currentEndDate: number): number {
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  return currentEndDate + THIRTY_DAYS;
}

// Portfolio verification flow
export function createPortfolioVerificationRequest(userId: string): PortfolioVerification {
  return {
    userId,
    status: 'pending',
    requestedAt: Date.now(),
    cost: 10,
  };
}

// Estimate earnings with different membership tiers
export function estimateMonthlyEarnings(
  totalJobsValue: number,
  userTier: 'free' | 'pro'
): {
  gross: number;
  fees: number;
  net: number;
  proSavings?: number;
} {
  const freeTierResult = calculateJobFee(totalJobsValue, false, false);
  const proTierResult = calculateJobFee(totalJobsValue, true, false);

  if (userTier === 'free') {
    return {
      gross: totalJobsValue,
      fees: freeTierResult.platformFee,
      net: freeTierResult.netAmount,
    };
  } else {
    return {
      gross: totalJobsValue,
      fees: proTierResult.platformFee,
      net: proTierResult.netAmount,
      proSavings: freeTierResult.platformFee - proTierResult.platformFee,
    };
  }
}

// Revenue breakdown for platform
export function calculatePlatformRevenue(
  totalEarnings: number,
  numFreeUsers: number,
  numProUsers: number
): {
  fromFeePercentage: number;
  fromProSubscriptions: number;
  fromBoosts: number;
  fromVerifications: number;
  total: number;
} {
  const averageFeePercentage = (totalEarnings * 0.1) * 0.7; // 70% of users are free
  const proSubscriptionRevenue = numProUsers * 100; // 100 Pi per month
  const avgBoosts = (numFreeUsers + numProUsers) * 0.2; // 20% use boosts
  const boostRevenue = avgBoosts * 5; // Average 5 Pi per boost
  const avgVerifications = (numFreeUsers + numProUsers) * 0.05; // 5% verify portfolio
  const verificationRevenue = avgVerifications * 10; // 10 Pi per verification

  return {
    fromFeePercentage: Math.round(averageFeePercentage),
    fromProSubscriptions: Math.round(proSubscriptionRevenue),
    fromBoosts: Math.round(boostRevenue),
    fromVerifications: Math.round(verificationRevenue),
    total: Math.round(
      averageFeePercentage + proSubscriptionRevenue + boostRevenue + verificationRevenue
    ),
  };
}
