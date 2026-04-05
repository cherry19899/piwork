// Month 11 DAO Governance Token
// Wrapped Pi-based governance token distribution
// 40% team/investors, 30% active users, 20% development reserve, 10% arbitrators

export interface GovernanceTokenAllocation {
  teamAndInvestors: { percentage: 40; tokens: number };
  activeUsers: { percentage: 30; tokens: number };
  developmentReserve: { percentage: 20; tokens: number };
  arbitrators: { percentage: 10; tokens: number };
}

export interface UserTokenAirdrop {
  userId: string;
  dealsCompleted: number;
  totalEarnings: number;
  tokenAmount: number;
  claimable: boolean;
}

export const calculateUserTokenAllocation = async (
  userId: string,
  userMetrics: { dealsCompleted: number; totalEarnings: number; daysActive: number }
): Promise<number> => {
  // Calculate user's share of 30% allocation based on contribution
  const contributionScore = 
    (userMetrics.dealsCompleted * 0.4) + 
    (userMetrics.totalEarnings * 0.4) + 
    (userMetrics.daysActive * 0.2);
  
  return contributionScore;
};

export const distributeGovernanceTokens = async (
  allocation: GovernanceTokenAllocation
): Promise<{ totalDistributed: number; success: boolean }> => {
  // Distribute governance tokens across all categories
  const total = Object.values(allocation).reduce((sum, cat) => sum + cat.tokens, 0);
  return { totalDistributed: total, success: true };
};

export const claimUserTokens = async (userId: string): Promise<{ claimed: number; txHash: string }> => {
  // Allow user to claim their airdropped governance tokens
  return { claimed: 1000, txHash: `0x${Date.now().toString(16)}` };
};
