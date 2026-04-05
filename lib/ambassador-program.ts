export class AmbassadorProgram {
  static calculateCommissionRate(referralCount: number): number {
    if (referralCount >= 500) return 0.15; // platinum
    if (referralCount >= 100) return 0.12; // gold
    if (referralCount >= 25) return 0.10; // silver
    return 0.10; // bronze - 10% base
  }

  static getTier(referralCount: number): string {
    if (referralCount >= 500) return 'platinum';
    if (referralCount >= 100) return 'gold';
    if (referralCount >= 25) return 'silver';
    return 'bronze';
  }

  static calculateEarnings(referralDealCount: number, avgDealValue: number, commissionRate: number): number {
    return referralDealCount * avgDealValue * commissionRate * 0.02; // 2% platform commission
  }
}
