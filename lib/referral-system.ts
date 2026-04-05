import { REFERRAL_CONFIG } from '@/lib/piwork-config';

export interface ReferralRecord {
  id: string;
  referrerId: string;
  refereeId: string;
  refereeType: 'requester' | 'worker';
  referralCode: string;
  commissionRate: number;
  commissionDuration: number; // days
  totalCommissionEarned: number;
  completedReferralDeals: number;
  status: 'pending' | 'active' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

export interface CommissionEarning {
  id: string;
  referralId: string;
  jobId: string;
  amount: number;
  earnedAt: Date;
}

export class ReferralSystem {
  static generateReferralCode(userId: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const userHash = userId.substring(0, 4).toUpperCase();
    return `PW${userHash}${timestamp}`;
  }

  static validateReferralCode(code: string): boolean {
    // Validate format: starts with PW, then 4 chars + timestamp
    return /^PW[A-Z0-9]{4}[A-Z0-9]+$/.test(code);
  }

  static calculateCommission(jobAmount: number, referralRecord: ReferralRecord): number {
    if (referralRecord.status !== 'active') {
      return 0;
    }

    const isExpired = new Date() > referralRecord.expiresAt;
    if (isExpired) {
      return 0;
    }

    const minimumMet = jobAmount >= REFERRAL_CONFIG.minimumReferralPayment;
    if (!minimumMet) {
      return 0;
    }

    return (jobAmount * referralRecord.commissionRate) / 100;
  }

  static shouldActivateFiveFreeDealsBenefit(referrerType: 'requester' | 'worker'): boolean {
    // When requester invites another requester, first 5 deals are commission-free
    // When worker invites another worker, gets % of earnings for a month
    return referrerType === 'requester';
  }

  static getCommissionDaysRemaining(referralRecord: ReferralRecord): number {
    const now = new Date();
    const expiryTime = referralRecord.expiresAt.getTime();
    const nowTime = now.getTime();

    if (expiryTime <= nowTime) {
      return 0;
    }

    const daysRemaining = (expiryTime - nowTime) / (1000 * 60 * 60 * 24);
    return Math.ceil(daysRemaining);
  }

  static createReferralRecord(
    referrerId: string,
    refereeId: string,
    refereeType: 'requester' | 'worker'
  ): ReferralRecord {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + REFERRAL_CONFIG.referrerCommissionDuration * 24 * 60 * 60 * 1000);

    return {
      id: 'ref_' + Math.random().toString(36).substr(2, 9),
      referrerId,
      refereeId,
      refereeType,
      referralCode: this.generateReferralCode(referrerId),
      commissionRate: REFERRAL_CONFIG.referrerCommissionPercentage,
      commissionDuration: REFERRAL_CONFIG.referrerCommissionDuration,
      totalCommissionEarned: 0,
      completedReferralDeals: 0,
      status: 'active',
      createdAt: now,
      expiresAt,
    };
  }
}
