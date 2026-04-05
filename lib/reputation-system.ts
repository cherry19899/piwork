import { REPUTATION_CONFIG, TRUST_CIRCLE_CONFIG } from '@/lib/piwork-config';

export interface ReputationRecord {
  id: string;
  userId: string;
  ratedBy: string;
  score: number; // 1-5
  category: 'quality' | 'timeliness' | 'communication' | 'professionalism';
  jobId: string;
  comment?: string;
  timestamp: Date;
}

export interface DisputeArbitration {
  id: string;
  jobId: string;
  requester: string;
  worker: string;
  arbitrators: string[];
  votes: Record<string, 'requester' | 'worker' | 'abstain'>;
  resolution: 'requester' | 'worker' | 'split' | 'pending';
  createdAt: Date;
  resolvedAt?: Date;
}

export class ReputationSystem {
  static calculateUserReputation(records: ReputationRecord[]): number {
    if (records.length === 0) return 0;

    const totalScore = records.reduce((sum, record) => sum + record.score, 0);
    const averageScore = totalScore / records.length;

    // Apply decay if not actively working
    const daysSinceLastActivity = this.getDaysSinceLastActivity(records);
    const decayFactor = 1 - (daysSinceLastActivity * REPUTATION_CONFIG.decayRate);
    const decayedScore = averageScore * Math.max(decayFactor, 0.5); // Min 50% score retention

    return Math.round(decayedScore * 100) / 100;
  }

  static getDaysSinceLastActivity(records: ReputationRecord[]): number {
    if (records.length === 0) return 0;
    const lastActivity = new Date(Math.max(...records.map(r => r.timestamp.getTime())));
    const now = new Date();
    return (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
  }

  static isReputationVisible(score: number): boolean {
    return score >= REPUTATION_CONFIG.minScoreVisible;
  }

  static getRatingCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      quality: 'Work Quality',
      timeliness: 'Timeliness',
      communication: 'Communication',
      professionalism: 'Professionalism',
    };
    return categoryMap[category] || category;
  }
}

export class TrustCircleSystem {
  static selectArbitrators(
    allUsers: string[],
    userRegion: string,
    requiredCount: number = TRUST_CIRCLE_CONFIG.maxArbitratorsPerDispute
  ): string[] {
    // Select arbitrators from different regions to prevent collusion
    const selectedArbitrators: string[] = [];

    // In production, this would:
    // 1. Filter users with minimum rating threshold
    // 2. Ensure geographic diversity (different regions)
    // 3. Randomize selection for fairness
    // 4. Check KYC verification status

    return selectedArbitrators.slice(0, requiredCount);
  }

  static isUserInTrustCircle(userId: string, connections: any[]): boolean {
    // Direct connection (friend)
    if (connections.some(c => c.userId === userId && c.trustLevel === 'friend')) {
      return true;
    }

    // Friend of friend
    if (connections.some(c => c.trustLevel === 'friend')) {
      // In production, would check second-degree connections
      return true;
    }

    return false;
  }

  static calculateConnectionStrength(connection: any): number {
    const baseStrength: Record<string, number> = {
      friend: 1.0,
      friend_of_friend: 0.6,
      verified: 0.8,
    };

    const trustScore = baseStrength[connection.trustLevel] || 0;
    const bonusForMutualConnections = connection.mutualConnections * 0.1;

    return Math.min(trustScore + bonusForMutualConnections, 1.0);
  }
}
