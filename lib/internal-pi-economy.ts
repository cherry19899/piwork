export interface PiEconomyTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'PAYMENT' | 'TIP' | 'REFUND' | 'REWARD' | 'MARKETPLACE';
  description: string;
  timestamp: number;
  status: 'PENDING' | 'CONFIRMED' | 'REVERSED';
}

export interface InternalEconomyConfig {
  currencyCode: 'PI';
  noFiatConversion: true;
  internalOnly: true;
  allowWithdrawal: false;
  allowDeposit: false;
}

export class InternalPiEconomy {
  private transactions: Map<string, PiEconomyTransaction[]> = new Map();
  private wallets: Map<string, number> = new Map();

  // User earns Pi through work
  recordEarnings(userId: string, amount: number, reason: string): void {
    const current = this.wallets.get(userId) || 0;
    this.wallets.set(userId, current + amount);
  }

  // User spends Pi on platform features
  recordSpending(
    userId: string,
    amount: number,
    type: 'JOB_BOOST' | 'URGENT_FLAG' | 'PORTFOLIO_CHECK' | 'PRO_SUBSCRIPTION',
  ): void {
    const current = this.wallets.get(userId) || 0;
    if (current < amount) throw new Error('Insufficient Pi balance');
    this.wallets.set(userId, current - amount);
  }

  // Transfer Pi to another user (payment for job)
  transferPi(from: string, to: string, amount: number): void {
    const fromBalance = this.wallets.get(from) || 0;
    if (fromBalance < amount) throw new Error('Insufficient balance');

    this.wallets.set(from, fromBalance - amount);
    const toBalance = this.wallets.get(to) || 0;
    this.wallets.set(to, toBalance + amount);
  }

  // Get wallet balance
  getBalance(userId: string): number {
    return this.wallets.get(userId) || 0;
  }

  // No fiat conversion allowed
  getWithdrawalOptions(): string[] {
    return ['RESTRICTED', 'INTERNAL_USE_ONLY'];
  }

  // Circular economy incentives
  getSpendingBonus(userId: string, spendAmount: number): number {
    // Users who spend Pi get 5% bonus added back for next purchase
    return Math.floor(spendAmount * 0.05);
  }

  // Network effects - more Pi in circulation = higher value perception
  calculateNetworkMultiplier(totalUsersWithPi: number): number {
    // Metcalfe's law: n^2 effect
    return Math.min(1 + totalUsersWithPi / 1000000, 2.5);
  }
}

export const internalEconomyRules = {
  earningChannels: [
    'COMPLETED_JOBS',
    'REFERRAL_COMMISSIONS',
    'JOINT_STAKING_REWARDS',
    'ARBITRATION_FEES',
    'PLATFORM_BONUSES',
  ],
  
  spendingChannels: [
    { type: 'JOB_BOOST', amount: 5, duration: 24 },
    { type: 'URGENT_FLAG', amount: 3, duration: 12 },
    { type: 'PORTFOLIO_VERIFICATION', amount: 10, oneTime: true },
    { type: 'PRO_SUBSCRIPTION', amount: 100, duration: 30 * 24 * 60 },
  ],
  
  noFiatConversion: 'PERMANENT',
  noExternalWithdrawal: 'PERMANENT',
  circularEconomyFocus: true,
};
