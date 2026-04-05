import { Timestamp } from 'firebase/firestore';

export type DisputeStatus = 'open' | 'assigned' | 'in_review' | 'resolved' | 'appealed';
export type ArbitrationVote = 'client' | 'worker' | 'partial' | 'abstain';

export interface Arbitrator {
  id: string;
  userId: string;
  rating: number;
  completedCases: number;
  region: string;
  languages: string[];
  specialties: string[];
  availability: boolean;
  lastCaseAt?: Timestamp;
  successRate: number;
  totalEarnings: number;
}

export interface DisputeCase {
  id: string;
  paymentId: string;
  jobId: string;
  clientId: string;
  workerId: string;
  openedBy: 'client' | 'worker';
  reason: string;
  description: string;
  evidence: string[];
  status: DisputeStatus;
  amount: number;
  createdAt: Timestamp;
  resolutionDeadline: Timestamp;
  assignedArbitrators: ArbitratorAssignment[];
  confirmedArbitrators: string[]; // First 3 confirmed arbitrator IDs
  votes: ArbitrationVote[];
  resolution?: DisputeResolution;
  appealedFrom?: string;
}

export interface ArbitratorAssignment {
  arbitratorId: string;
  assignedAt: Timestamp;
  confirmedAt?: Timestamp;
  status: 'pending' | 'confirmed' | 'declined';
  reason?: string;
}

export interface DisputeResolution {
  decidedAt: Timestamp;
  decidedBy: string[]; // Arbitrator IDs
  votes: Map<string, ArbitrationVote>;
  finalDecision: 'client_wins' | 'worker_wins' | 'partial_refund';
  piDistribution: {
    client: number;
    worker: number;
    platform: number;
  };
  reasoning: string;
  arbitratorEarnings: number; // 10% of disputed amount
}

export interface ArbitratorEarning {
  arbitratorId: string;
  caseId: string;
  amount: number;
  earnedAt: Timestamp;
}

export class AdvancedArbitrationService {
  private static readonly RESOLUTION_DEADLINE_HOURS = 48;
  private static readonly ARBITRATORS_TO_FIND = 5;
  private static readonly CONFIRMED_ARBITRATORS_NEEDED = 3;
  private static readonly MIN_ARBITRATOR_RATING = 4.5;
  private static readonly MIN_ARBITRATOR_CASES = 50;
  private static readonly ARBITRATOR_COMMISSION = 0.1; // 10%

  /**
   * Create a new dispute case
   */
  static createDisputeCase(
    paymentId: string,
    jobId: string,
    clientId: string,
    workerId: string,
    openedBy: 'client' | 'worker',
    reason: string,
    description: string,
    amount: number
  ): DisputeCase {
    const now = Timestamp.now();
    const resolutionDeadline = new Timestamp(
      now.seconds + this.RESOLUTION_DEADLINE_HOURS * 60 * 60,
      now.nanoseconds
    );

    return {
      id: `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentId,
      jobId,
      clientId,
      workerId,
      openedBy,
      reason,
      description,
      evidence: [],
      status: 'open',
      amount,
      createdAt: now,
      resolutionDeadline,
      assignedArbitrators: [],
      confirmedArbitrators: [],
      votes: [],
    };
  }

  /**
   * Find available arbitrators based on criteria
   * - Rating >= 4.5
   * - 50+ completed cases
   * - Different region than client/worker to prevent collusion
   * - Currently available
   */
  static findEligibleArbitrators(
    allArbitrators: Arbitrator[],
    clientRegion: string,
    workerRegion: string,
    usedArbitratorIds: string[] = []
  ): Arbitrator[] {
    return allArbitrators
      .filter(
        arb =>
          arb.rating >= this.MIN_ARBITRATOR_RATING &&
          arb.completedCases >= this.MIN_ARBITRATOR_CASES &&
          arb.availability &&
          arb.region !== clientRegion &&
          arb.region !== workerRegion &&
          !usedArbitratorIds.includes(arb.id)
      )
      .sort((a, b) => {
        // Sort by: success rate (desc) → rating (desc) → completed cases (desc)
        if (b.successRate !== a.successRate) {
          return b.successRate - a.successRate;
        }
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.completedCases - a.completedCases;
      })
      .slice(0, this.ARBITRATORS_TO_FIND);
  }

  /**
   * Assign arbitrators to a dispute
   */
  static assignArbitrators(
    dispute: DisputeCase,
    eligibleArbitrators: Arbitrator[]
  ): DisputeCase {
    const assignments: ArbitratorAssignment[] = eligibleArbitrators.map(arb => ({
      arbitratorId: arb.id,
      assignedAt: Timestamp.now(),
      status: 'pending',
    }));

    return {
      ...dispute,
      assignedArbitrators: assignments,
      status: 'assigned',
    };
  }

  /**
   * Arbitrator confirms they will hear the case
   * First 3 confirmed arbitrators proceed
   */
  static confirmArbitrator(
    dispute: DisputeCase,
    arbitratorId: string
  ): DisputeCase {
    // Update assignment status
    const updatedAssignments = dispute.assignedArbitrators.map(a =>
      a.arbitratorId === arbitratorId
        ? { ...a, status: 'confirmed' as const, confirmedAt: Timestamp.now() }
        : a
    );

    // Add to confirmed list if not already at limit
    let confirmedArbitrators = [...dispute.confirmedArbitrators];
    if (
      confirmedArbitrators.length < this.CONFIRMED_ARBITRATORS_NEEDED &&
      !confirmedArbitrators.includes(arbitratorId)
    ) {
      confirmedArbitrators.push(arbitratorId);
    }

    return {
      ...dispute,
      assignedArbitrators: updatedAssignments,
      confirmedArbitrators,
      status:
        confirmedArbitrators.length === this.CONFIRMED_ARBITRATORS_NEEDED
          ? 'in_review'
          : 'assigned',
    };
  }

  /**
   * Arbitrator declines case
   */
  static declineArbitrator(
    dispute: DisputeCase,
    arbitratorId: string,
    reason: string
  ): DisputeCase {
    const updatedAssignments = dispute.assignedArbitrators.map(a =>
      a.arbitratorId === arbitratorId
        ? { ...a, status: 'declined' as const, reason }
        : a
    );

    return {
      ...dispute,
      assignedArbitrators: updatedAssignments,
    };
  }

  /**
   * Record arbitrator vote
   */
  static recordVote(
    dispute: DisputeCase,
    arbitratorId: string,
    vote: ArbitrationVote
  ): DisputeCase {
    // Only confirmed arbitrators can vote
    if (!dispute.confirmedArbitrators.includes(arbitratorId)) {
      throw new Error('Only confirmed arbitrators can vote');
    }

    return {
      ...dispute,
      votes: [...dispute.votes, vote],
    };
  }

  /**
   * Resolve dispute based on majority vote
   */
  static resolveDispute(
    dispute: DisputeCase,
    arbitratorIds: string[]
  ): DisputeCase {
    if (dispute.votes.length < this.CONFIRMED_ARBITRATORS_NEEDED) {
      throw new Error('Not all arbitrators have voted');
    }

    // Count votes
    const votes = dispute.votes;
    const clientWins = votes.filter(v => v === 'client').length;
    const workerWins = votes.filter(v => v === 'worker').length;
    const partialVotes = votes.filter(v => v === 'partial').length;

    let finalDecision: 'client_wins' | 'worker_wins' | 'partial_refund';
    let piDistribution: { client: number; worker: number; platform: number };

    // Majority vote determines outcome
    if (clientWins > workerWins) {
      finalDecision = 'client_wins';
      piDistribution = {
        client: dispute.amount,
        worker: 0,
        platform: 0,
      };
    } else if (workerWins > clientWins) {
      finalDecision = 'worker_wins';
      piDistribution = {
        client: 0,
        worker: dispute.amount,
        platform: 0,
      };
    } else {
      // Partial refund if split or tie
      finalDecision = 'partial_refund';
      const half = dispute.amount / 2;
      piDistribution = {
        client: half,
        worker: half,
        platform: 0,
      };
    }

    const arbitratorEarnings = dispute.amount * this.ARBITRATOR_COMMISSION;
    const resolution: DisputeResolution = {
      decidedAt: Timestamp.now(),
      decidedBy: arbitratorIds,
      votes: new Map(arbitratorIds.map((id, i) => [id, votes[i]])),
      finalDecision,
      piDistribution,
      reasoning: `Resolved by majority vote: ${clientWins} for client, ${workerWins} for worker, ${partialVotes} partial`,
      arbitratorEarnings,
    };

    return {
      ...dispute,
      status: 'resolved',
      resolution,
    };
  }

  /**
   * Check if resolution deadline has passed
   */
  static isDeadlinePassed(dispute: DisputeCase): boolean {
    return Timestamp.now().toMillis() > dispute.resolutionDeadline.toMillis();
  }

  /**
   * Calculate arbitrator earnings for a case
   */
  static calculateArbitratorEarning(
    disputeAmount: number,
    arbitratorsCount: number
  ): number {
    return (disputeAmount * this.ARBITRATOR_COMMISSION) / arbitratorsCount;
  }
}
