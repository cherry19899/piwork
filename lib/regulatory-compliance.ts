import { Timestamp } from 'firebase/firestore';

export interface UserEarnings {
  userId: string;
  region: string;
  year: number;
  month: number;
  grossEarnings: number; // Total Pi earned
  platformFees: number; // Platform charges
  networkFees: number; // Pi network fees
  netEarnings: number; // Gross - fees
  completedJobs: number;
  activeStatus: 'active' | 'inactive' | 'limited';
  lastUpdated: Timestamp;
}

export interface IncomeReport {
  id: string;
  userId: string;
  generatedDate: Timestamp;
  period: {
    startDate: Timestamp;
    endDate: Timestamp;
  };
  earnings: {
    totalGrossEarnings: number;
    platformFeeTotal: number;
    networkFeeTotal: number;
    totalNetEarnings: number;
    completedJobs: number;
    averageJobValue: number;
  };
  byCategory: Record<string, { jobs: number; earnings: number }>;
  byRegion?: string;
  taxLiability?: {
    estimatedTaxes: number;
    jurisdiction: string;
    disclaimer: string;
  };
  disclaimer: string;
}

export interface ComplianceRecord {
  userId: string;
  kycVerified: boolean;
  kycVerifiedAt?: Timestamp;
  termsAccepted: boolean;
  termsAcceptedAt: Timestamp;
  independentContractorConfirmed: boolean;
  taxResponsibilityAcknowledged: boolean;
  region: string;
  status: 'compliant' | 'pending_kyc' | 'flagged' | 'suspended';
  lastUpdated: Timestamp;
}

export interface PlatformClarification {
  id: string;
  type:
    | 'not_bank'
    | 'not_payment_system'
    | 'escrow_technical'
    | 'self_employed'
    | 'tax_responsibility';
  content: string;
  regions: string[];
  active: boolean;
}

export class RegulatoryComplianceService {
  /**
   * Generate income report for tax purposes
   * Note: This is informational only - user is responsible for taxes
   */
  static generateIncomeReport(
    userId: string,
    earnings: UserEarnings[],
    startDate: Timestamp,
    endDate: Timestamp,
    region: string
  ): IncomeReport {
    const reportEarnings = earnings.filter(
      e =>
        e.userId === userId &&
        e.lastUpdated.toMillis() >= startDate.toMillis() &&
        e.lastUpdated.toMillis() <= endDate.toMillis()
    );

    const totalGrossEarnings = reportEarnings.reduce(
      (sum, e) => sum + e.grossEarnings,
      0
    );
    const platformFeeTotal = reportEarnings.reduce(
      (sum, e) => sum + e.platformFees,
      0
    );
    const networkFeeTotal = reportEarnings.reduce(
      (sum, e) => sum + e.networkFees,
      0
    );
    const totalNetEarnings = reportEarnings.reduce(
      (sum, e) => sum + e.netEarnings,
      0
    );
    const completedJobs = reportEarnings.reduce(
      (sum, e) => sum + e.completedJobs,
      0
    );

    // Group by category (placeholder - would come from job data)
    const byCategory: Record<string, { jobs: number; earnings: number }> = {};

    return {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      generatedDate: Timestamp.now(),
      period: { startDate, endDate },
      earnings: {
        totalGrossEarnings,
        platformFeeTotal,
        networkFeeTotal,
        totalNetEarnings,
        completedJobs,
        averageJobValue:
          completedJobs > 0 ? totalGrossEarnings / completedJobs : 0,
      },
      byCategory,
      byRegion: region,
      disclaimer:
        'This report is provided for informational purposes only. Users are self-employed independent contractors responsible for all tax obligations in their jurisdiction. Piwork is not a tax advisor. Users must consult with local tax authorities to understand their tax liabilities.',
    };
  }

  /**
   * Create compliance record for user
   */
  static createComplianceRecord(
    userId: string,
    region: string
  ): ComplianceRecord {
    return {
      userId,
      kycVerified: false,
      termsAccepted: false,
      termsAcceptedAt: Timestamp.now(),
      independentContractorConfirmed: false,
      taxResponsibilityAcknowledged: false,
      region,
      status: 'pending_kyc',
      lastUpdated: Timestamp.now(),
    };
  }

  /**
   * Mark KYC as verified
   */
  static verifyKYC(record: ComplianceRecord): ComplianceRecord {
    return {
      ...record,
      kycVerified: true,
      kycVerifiedAt: Timestamp.now(),
      status: record.termsAccepted ? 'compliant' : 'pending_kyc',
      lastUpdated: Timestamp.now(),
    };
  }

  /**
   * Accept platform terms and acknowledge independent contractor status
   */
  static acceptTermsAndConditions(record: ComplianceRecord): ComplianceRecord {
    return {
      ...record,
      termsAccepted: true,
      independentContractorConfirmed: true,
      taxResponsibilityAcknowledged: true,
      termsAcceptedAt: Timestamp.now(),
      status: record.kycVerified ? 'compliant' : 'pending_kyc',
      lastUpdated: Timestamp.now(),
    };
  }

  /**
   * Get clarifications for specific region
   */
  static getComplianceClarifications(region: string): PlatformClarification[] {
    const clarifications: PlatformClarification[] = [
      {
        id: 'not_bank',
        type: 'not_bank',
        content:
          'Piwork is not a bank or banking service. We do not hold deposits, provide accounts, or conduct banking operations. Users maintain control of their Pi cryptocurrency.',
        regions: ['all'],
        active: true,
      },
      {
        id: 'not_payment_system',
        type: 'not_payment_system',
        content:
          'Piwork is not a payment system operator. We provide technical escrow functionality to facilitate peer-to-peer transactions on the Pi Network blockchain.',
        regions: ['all'],
        active: true,
      },
      {
        id: 'escrow_technical',
        type: 'escrow_technical',
        content:
          'Escrow is a technical feature of the platform, not a financial service. Pi is locked contractually, not stored by Piwork.',
        regions: ['all'],
        active: true,
      },
      {
        id: 'self_employed',
        type: 'self_employed',
        content:
          'Users are self-employed independent contractors. You are not employees of Piwork or job requesters. You are responsible for all employment taxes, social security contributions, and other obligations in your jurisdiction.',
        regions: ['all'],
        active: true,
      },
      {
        id: 'tax_responsibility',
        type: 'tax_responsibility',
        content:
          'Tax compliance is your responsibility. Piwork provides income reports for informational purposes only. You must report all earnings to relevant tax authorities and comply with local tax laws.',
        regions: ['all'],
        active: true,
      },
    ];

    return clarifications.filter(
      c => c.active && (c.regions.includes(region) || c.regions.includes('all'))
    );
  }

  /**
   * Check if user is compliant
   */
  static isUserCompliant(record: ComplianceRecord): boolean {
    return (
      record.status === 'compliant' &&
      record.kycVerified &&
      record.termsAccepted &&
      record.independentContractorConfirmed &&
      record.taxResponsibilityAcknowledged
    );
  }

  /**
   * Track monthly earnings for reporting
   */
  static recordMonthlyEarnings(
    userId: string,
    region: string,
    grossEarnings: number,
    platformFees: number,
    networkFees: number,
    completedJobs: number,
    month: number,
    year: number
  ): UserEarnings {
    return {
      userId,
      region,
      year,
      month,
      grossEarnings,
      platformFees,
      networkFees,
      netEarnings: grossEarnings - platformFees - networkFees,
      completedJobs,
      activeStatus: 'active',
      lastUpdated: Timestamp.now(),
    };
  }

  /**
   * Export earnings data for tax filing
   */
  static exportEarningsData(
    report: IncomeReport
  ): {
    csv: string;
    json: object;
  } {
    const json = {
      reportId: report.id,
      userId: report.userId,
      period: {
        start: report.period.startDate.toDate().toISOString(),
        end: report.period.endDate.toDate().toISOString(),
      },
      earnings: report.earnings,
      disclaimer: report.disclaimer,
    };

    const csv = [
      'Piwork Income Report',
      `Generated: ${report.generatedDate.toDate().toISOString()}`,
      `Period: ${report.period.startDate.toDate().toLocaleDateString()} - ${report.period.endDate.toDate().toLocaleDateString()}`,
      '',
      'Earnings Summary',
      `Total Gross Earnings (Pi),${report.earnings.totalGrossEarnings}`,
      `Platform Fees,${report.earnings.platformFeeTotal}`,
      `Network Fees,${report.earnings.networkFeeTotal}`,
      `Total Net Earnings (Pi),${report.earnings.totalNetEarnings}`,
      `Completed Jobs,${report.earnings.completedJobs}`,
      `Average Job Value (Pi),${report.earnings.averageJobValue.toFixed(2)}`,
      '',
      'Disclaimer',
      report.disclaimer,
    ].join('\n');

    return { csv, json };
  }
}
