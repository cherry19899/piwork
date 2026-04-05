/**
 * Pi Network Social Circles Integration
 * - Display invited contacts on platform
 * - Priority feed for circle members
 * - Trust multipliers for direct connections
 */

export interface PiContact {
  id: string;
  piUsername: string;
  displayName: string;
  avatar?: string;
  onPiwork: boolean;
  joinedAt?: number;
  relationship: 'invited' | 'first_degree' | 'second_degree';
}

export interface SocialCircleMetrics {
  totalContacts: number;
  onPlatform: number;
  activeDeals: number;
  totalDealsInCircle: number;
  trustScore: number;
}

export interface CirclePriority {
  jobId: string;
  publishedAt: number;
  circlePriority: number; // 0-10 scale
  circleBonuses: {
    searchRank: number; // +20% visibility
    displayPosition: number; // +5 positions in feed
    trustMultiplier: number; // +1.5x trust factor
  };
}

export interface StakingCircle {
  circleId: string;
  members: string[];
  stakedAmount: number;
  stakingPeriod: number; // in days
  reputationBonus: number;
  createdAt: number;
  totalEarningsInCircle: number;
}

export class PiSocialCirclesService {
  private circles = new Map<string, PiContact[]>();
  private platformUsers = new Map<string, { joinedAt: number; reputation: number }>();
  private circlePriorities = new Map<string, CirclePriority[]>();
  private stakingCircles = new Map<string, StakingCircle>();

  /**
   * Sync user's Pi Network contacts with Piwork
   */
  async syncPiContacts(userId: string, piContacts: PiContact[]): Promise<void> {
    // Mark invited contacts who joined
    const updatedContacts = piContacts.map(contact => ({
      ...contact,
      onPiwork: this.platformUsers.has(contact.id),
      joinedAt: this.platformUsers.get(contact.id)?.joinedAt,
    }));

    this.circles.set(userId, updatedContacts);
  }

  /**
   * Get circle members already on platform
   */
  getCircleOnPlatform(userId: string): PiContact[] {
    const userCircle = this.circles.get(userId) || [];
    return userCircle.filter(c => c.onPiwork).sort((a, b) => {
      if (!a.joinedAt || !b.joinedAt) return 0;
      return b.joinedAt - a.joinedAt;
    });
  }

  /**
   * Get social circle metrics
   */
  getCircleMetrics(userId: string): SocialCircleMetrics {
    const userCircle = this.circles.get(userId) || [];
    const onPlatform = userCircle.filter(c => c.onPiwork).length;

    return {
      totalContacts: userCircle.length,
      onPlatform,
      activeDeals: this.calculateActiveDealsInCircle(userId),
      totalDealsInCircle: this.calculateTotalDealsInCircle(userId),
      trustScore: this.calculateCircleTrustScore(userId),
    };
  }

  private calculateActiveDealsInCircle(userId: string): number {
    // Get all deals by circle members
    return Math.floor(Math.random() * 50); // Placeholder
  }

  private calculateTotalDealsInCircle(userId: string): number {
    return Math.floor(Math.random() * 500); // Placeholder
  }

  private calculateCircleTrustScore(userId: string): number {
    const userCircle = this.circles.get(userId) || [];
    const onPlatform = userCircle.filter(c => c.onPiwork);

    // Calculate based on circle reputation and engagement
    let score = 0;
    for (const contact of onPlatform) {
      const reputation = this.platformUsers.get(contact.id)?.reputation || 0;
      score += reputation * 0.1; // Weight by reputation
    }

    return Math.min(100, score + onPlatform.length * 2);
  }

  /**
   * Apply circle priority to job feed
   */
  applyCirclePriority(userId: string, jobId: string, position: number): CirclePriority {
    const userCircle = this.circles.get(userId) || [];
    const circleMemberCount = userCircle.filter(c => c.onPiwork).length;

    // Base priority increases with circle size
    const basePriority = Math.min(10, circleMemberCount / 5);

    const priority: CirclePriority = {
      jobId,
      publishedAt: Date.now(),
      circlePriority: basePriority,
      circleBonuses: {
        searchRank: 20, // +20% visibility in search
        displayPosition: Math.min(5, Math.floor(circleMemberCount / 10)),
        trustMultiplier: 1.5,
      },
    };

    const jobPriorities = this.circlePriorities.get(userId) || [];
    jobPriorities.push(priority);
    this.circlePriorities.set(userId, jobPriorities);

    return priority;
  }

  /**
   * Get feed with circle priority boost
   */
  getFeedWithCirclePriority(userId: string, allJobs: any[]): any[] {
    const userCircle = this.circles.get(userId) || [];
    const onPlatformIds = new Set(userCircle.filter(c => c.onPiwork).map(c => c.id));

    // Sort jobs by: circle member posted -> direct feed match -> time
    return allJobs.sort((a, b) => {
      const aByCircle = onPlatformIds.has(a.authorId) ? 1 : 0;
      const bByCircle = onPlatformIds.has(b.authorId) ? 1 : 0;

      if (aByCircle !== bByCircle) return bByCircle - aByCircle;
      return b.publishedAt - a.publishedAt;
    });
  }

  /**
   * Register user as on platform
   */
  registerUserOnPlatform(userId: string, piUsername: string): void {
    this.platformUsers.set(userId, {
      joinedAt: Date.now(),
      reputation: 0,
    });
  }

  /**
   * Create joint staking circle
   */
  createStakingCircle(
    circleId: string,
    members: string[],
    stakingAmount: number,
    stakingPeriod: number
  ): StakingCircle {
    const circle: StakingCircle = {
      circleId,
      members,
      stakedAmount: stakingAmount * members.length,
      stakingPeriod,
      reputationBonus: Math.min(50, members.length * 5), // 5% per member, max 50%
      createdAt: Date.now(),
      totalEarningsInCircle: 0,
    };

    this.stakingCircles.set(circleId, circle);
    return circle;
  }

  /**
   * Get staking circle info
   */
  getStakingCircle(circleId: string): StakingCircle | undefined {
    return this.stakingCircles.get(circleId);
  }

  /**
   * Update circle earnings
   */
  updateCircleEarnings(circleId: string, earnings: number): void {
    const circle = this.stakingCircles.get(circleId);
    if (circle) {
      circle.totalEarningsInCircle += earnings;
    }
  }

  /**
   * Calculate circle bonus multiplier for reputation
   */
  getCircleReputationBonus(userId: string): number {
    const userStakingCircles = Array.from(this.stakingCircles.values()).filter(c =>
      c.members.includes(userId)
    );

    if (userStakingCircles.length === 0) return 1;

    // Bonus stacks: 1x (no circle), 1.15x (1 circle), 1.30x (2+ circles)
    const totalBonus = userStakingCircles.reduce((sum, circle) => {
      return sum + circle.reputationBonus / 100;
    }, 0);

    return 1 + Math.min(totalBonus, 0.3); // Max 30% bonus
  }
}

export const piSocialCirclesService = new PiSocialCirclesService();
