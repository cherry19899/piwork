/**
 * Product Roadmap Tracker for Piwork
 * 12-month milestone plan with metrics and feature tracking
 */

export type MilestoneStatus = 'planning' | 'in-progress' | 'completed' | 'delayed' | 'blocked';

export interface Milestone {
  month: number;
  name: string;
  status: MilestoneStatus;
  targetDate: Date;
  completionDate?: Date;
  description: string;
  features: Feature[];
  metrics: MilestoneMetrics;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  estimatedDays: number;
  completedPercentage: number;
}

export interface MilestoneMetrics {
  targetUsers: number;
  targetDeals: number;
  targetValue: number; // in Pi
  actualUsers?: number;
  actualDeals?: number;
  actualValue?: number;
  expectedRevenue: number;
}

export interface RoadmapUpdate {
  timestamp: number;
  milestone: number;
  message: string;
  blockages?: string[];
  recommendations?: string[];
}

export const PIWORK_ROADMAP: Milestone[] = [
  {
    month: 1,
    name: "MVP Launch",
    status: "in-progress",
    targetDate: new Date('2025-01-31'),
    description: "Minimum Viable Product with core features: job posting, applications, payments, basic reviews",
    features: [
      {
        id: "f1-1",
        name: "Job Posting System",
        description: "Allow users to create and publish jobs",
        status: "completed",
        priority: "critical",
        estimatedDays: 7,
        completedPercentage: 100,
      },
      {
        id: "f1-2",
        name: "Two-Phase Payment System",
        description: "Secure escrow with approve/complete flow",
        status: "completed",
        priority: "critical",
        estimatedDays: 10,
        completedPercentage: 100,
      },
      {
        id: "f1-3",
        name: "Review & Rating System",
        description: "Weighted reviews with 0.1-2.0x multipliers",
        status: "completed",
        priority: "high",
        estimatedDays: 8,
        completedPercentage: 100,
      },
      {
        id: "f1-4",
        name: "Basic Chat",
        description: "Firebase-based messaging between users",
        status: "in-progress",
        priority: "high",
        estimatedDays: 5,
        completedPercentage: 80,
      },
    ],
    metrics: {
      targetUsers: 100,
      targetDeals: 100,
      targetValue: 500,
      expectedRevenue: 50,
    },
  },
  {
    month: 2,
    name: "Automation & Growth",
    status: "planning",
    targetDate: new Date('2025-02-28'),
    description: "Automate job matching, add first 1000 users through referral system",
    features: [
      {
        id: "f2-1",
        name: "Job Matching Algorithm",
        description: "Auto-match jobs to worker skills and history",
        status: "planned",
        priority: "high",
        estimatedDays: 12,
        completedPercentage: 0,
      },
      {
        id: "f2-2",
        name: "Referral Program",
        description: "5% base commission, tier scaling to 15%",
        status: "planned",
        priority: "critical",
        estimatedDays: 8,
        completedPercentage: 0,
      },
      {
        id: "f2-3",
        name: "Regional Pricing",
        description: "Auto-adjust prices for regional purchasing power",
        status: "planned",
        priority: "high",
        estimatedDays: 6,
        completedPercentage: 0,
      },
      {
        id: "f2-4",
        name: "Analytics Dashboard",
        description: "Real-time growth metrics and insights",
        status: "planned",
        priority: "medium",
        estimatedDays: 10,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 1000,
      targetDeals: 1000,
      targetValue: 5000,
      expectedRevenue: 500,
    },
  },
  {
    month: 3,
    name: "Arbitration & Trust",
    status: "planning",
    targetDate: new Date('2025-03-31'),
    description: "Advanced arbitration system, reputation weighting, trust circles",
    features: [
      {
        id: "f3-1",
        name: "Advanced Arbitration",
        description: "5 arbitrator selection, 48hr resolution, 10% commission",
        status: "planned",
        priority: "critical",
        estimatedDays: 15,
        completedPercentage: 0,
      },
      {
        id: "f3-2",
        name: "Weighted Reputation",
        description: "Variable review weights based on rater reputation",
        status: "planned",
        priority: "high",
        estimatedDays: 8,
        completedPercentage: 0,
      },
      {
        id: "f3-3",
        name: "Pi Social Circles",
        description: "Integration with Pi Network social features",
        status: "planned",
        priority: "high",
        estimatedDays: 12,
        completedPercentage: 0,
      },
      {
        id: "f3-4",
        name: "Joint Staking",
        description: "Circle members stake together for reputation bonus",
        status: "planned",
        priority: "medium",
        estimatedDays: 10,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 5000,
      targetDeals: 5000,
      targetValue: 25000,
      expectedRevenue: 2500,
    },
  },
  {
    month: 4,
    name: "Native Mobile App",
    status: "planning",
    targetDate: new Date('2025-04-30'),
    description: "Native Android app with offline support, optimized for 2G networks",
    features: [
      {
        id: "f4-1",
        name: "Native Android App",
        description: "React Native/Flutter app under 10MB APK",
        status: "planned",
        priority: "critical",
        estimatedDays: 20,
        completedPercentage: 0,
      },
      {
        id: "f4-2",
        name: "Offline Messaging",
        description: "Queue messages, sync when online",
        status: "planned",
        priority: "high",
        estimatedDays: 8,
        completedPercentage: 0,
      },
      {
        id: "f4-3",
        name: "Image Compression",
        description: "Auto-compress based on connection speed",
        status: "planned",
        priority: "high",
        estimatedDays: 6,
        completedPercentage: 0,
      },
      {
        id: "f4-4",
        name: "Push Notifications",
        description: "Real-time job alerts and messages",
        status: "planned",
        priority: "medium",
        estimatedDays: 5,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 15000,
      targetDeals: 20000,
      targetValue: 100000,
      expectedRevenue: 10000,
    },
  },
  {
    month: 5,
    name: "Regional Expansion",
    status: "planning",
    targetDate: new Date('2025-05-31'),
    description: "Scale to Philippines, Nigeria, Indonesia, Vietnam with localized support",
    features: [
      {
        id: "f5-1",
        name: "Regional Moderation",
        description: "Local moderators for each region",
        status: "planned",
        priority: "high",
        estimatedDays: 10,
        completedPercentage: 0,
      },
      {
        id: "f5-2",
        name: "Local Payment Methods",
        description: "Integration with regional wallets",
        status: "planned",
        priority: "high",
        estimatedDays: 15,
        completedPercentage: 0,
      },
      {
        id: "f5-3",
        name: "Language Support",
        description: "Full localization for 10+ languages",
        status: "planned",
        priority: "medium",
        estimatedDays: 12,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 50000,
      targetDeals: 100000,
      targetValue: 500000,
      expectedRevenue: 50000,
    },
  },
  {
    month: 6,
    name: "External Wallet Integration",
    status: "planning",
    targetDate: new Date('2025-06-30'),
    description: "Enable withdrawal to external wallets, multi-chain support",
    features: [
      {
        id: "f6-1",
        name: "External Wallet Withdrawal",
        description: "Users can withdraw earnings to external wallets",
        status: "planned",
        priority: "critical",
        estimatedDays: 12,
        completedPercentage: 0,
      },
      {
        id: "f6-2",
        name: "Multi-Chain Support",
        description: "Support Polygon, BSC, Ethereum for withdrawals",
        status: "planned",
        priority: "high",
        estimatedDays: 10,
        completedPercentage: 0,
      },
      {
        id: "f6-3",
        name: "Tax Report Integration",
        description: "Export to major tax software",
        status: "planned",
        priority: "medium",
        estimatedDays: 8,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 100000,
      targetDeals: 300000,
      targetValue: 1500000,
      expectedRevenue: 150000,
    },
  },
  {
    month: 12,
    name: "DAO Governance",
    status: "planning",
    targetDate: new Date('2025-12-31'),
    description: "Transition to community-governed DAO with token-based voting",
    features: [
      {
        id: "f12-1",
        name: "DAO Token Launch",
        description: "Governance token for platform decisions",
        status: "planned",
        priority: "critical",
        estimatedDays: 30,
        completedPercentage: 0,
      },
      {
        id: "f12-2",
        name: "Governance Voting",
        description: "Token holders vote on platform changes",
        status: "planned",
        priority: "high",
        estimatedDays: 15,
        completedPercentage: 0,
      },
      {
        id: "f12-3",
        name: "Community Treasury",
        description: "DAO-controlled funds for growth initiatives",
        status: "planned",
        priority: "high",
        estimatedDays: 12,
        completedPercentage: 0,
      },
      {
        id: "f12-4",
        name: "Decentralized Arbitration",
        description: "Community-selected arbitrators with DAO voting",
        status: "planned",
        priority: "medium",
        estimatedDays: 18,
        completedPercentage: 0,
      },
    ],
    metrics: {
      targetUsers: 1000000,
      targetDeals: 5000000,
      targetValue: 25000000,
      expectedRevenue: 2500000,
    },
  },
];

export class RoadmapTracker {
  private roadmap = PIWORK_ROADMAP;
  private updates: RoadmapUpdate[] = [];

  /**
   * Get current milestone
   */
  getCurrentMilestone(currentMonth: number): Milestone | undefined {
    return this.roadmap.find(m => m.month === currentMonth);
  }

  /**
   * Update milestone status
   */
  updateMilestoneStatus(month: number, status: MilestoneStatus, completionDate?: Date): void {
    const milestone = this.roadmap.find(m => m.month === month);
    if (milestone) {
      milestone.status = status;
      if (status === 'completed' && completionDate) {
        milestone.completionDate = completionDate;
      }
    }
  }

  /**
   * Update feature status
   */
  updateFeatureStatus(
    month: number,
    featureId: string,
    status: Feature['status'],
    completedPercentage: number
  ): void {
    const milestone = this.roadmap.find(m => m.month === month);
    if (milestone) {
      const feature = milestone.features.find(f => f.id === featureId);
      if (feature) {
        feature.status = status;
        feature.completedPercentage = completedPercentage;
      }
    }
  }

  /**
   * Record roadmap update
   */
  recordUpdate(month: number, message: string, blockages?: string[], recommendations?: string[]): void {
    this.updates.push({
      timestamp: Date.now(),
      milestone: month,
      message,
      blockages,
      recommendations,
    });
  }

  /**
   * Get completion percentage for milestone
   */
  getMilestoneProgress(month: number): number {
    const milestone = this.roadmap.find(m => m.month === month);
    if (!milestone) return 0;

    const avgCompletion =
      milestone.features.reduce((sum, f) => sum + f.completedPercentage, 0) /
      milestone.features.length;

    return avgCompletion;
  }

  /**
   * Get overall roadmap progress
   */
  getOverallProgress(): number {
    const completedMilestones = this.roadmap.filter(m => m.status === 'completed').length;
    return (completedMilestones / this.roadmap.length) * 100;
  }

  /**
   * Get roadmap with actuals vs targets
   */
  getRoadmapWithMetrics(): Milestone[] {
    return this.roadmap.map(milestone => ({
      ...milestone,
      metrics: {
        ...milestone.metrics,
        variance: {
          users: milestone.metrics.actualUsers
            ? ((milestone.metrics.actualUsers - milestone.metrics.targetUsers) /
                milestone.metrics.targetUsers) *
              100
            : null,
          deals: milestone.metrics.actualDeals
            ? ((milestone.metrics.actualDeals - milestone.metrics.targetDeals) /
                milestone.metrics.targetDeals) *
              100
            : null,
        },
      },
    }));
  }

  /**
   * Get recent updates
   */
  getRecentUpdates(limit: number = 10): RoadmapUpdate[] {
    return this.updates.slice(-limit).reverse();
  }
}

export const roadmapTracker = new RoadmapTracker();
