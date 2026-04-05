/**
 * Growth Analytics for Piwork
 * Real-time metrics for platform optimization
 * - Time to first application
 * - Average transaction value by region
 * - View to deal conversion
 * - Cancellation patterns
 * - Disputed category tracking
 */

export interface JobMetrics {
  jobId: string;
  publishedAt: number;
  firstApplicationAt?: number;
  viewCount: number;
  applicationCount: number;
  completionCount: number;
  avgRating?: number;
  category: string;
  region: string;
  price: number;
}

export interface RegionalAnalytics {
  region: string;
  totalJobs: number;
  totalDeals: number;
  averageCheckSize: number;
  conversionRate: number; // views to deals
  cancelRatio: number; // cancelled / completed
  topCategories: Array<{ category: string; count: number; revenue: number }>;
  averageTimeToFirstApp: number; // in minutes
}

export interface CancellationReason {
  jobId: string;
  reason: 'buyer_cancel' | 'seller_cancel' | 'dispute' | 'timeout' | 'other';
  details: string;
  timestamp: number;
}

export interface DisputedCategory {
  category: string;
  disputeCount: number;
  refundRate: number;
  averageDisputeValue: number;
  commonIssues: Array<{ issue: string; count: number }>;
}

export interface PlatformMetrics {
  timestamp: number;
  activeUsers: number;
  totalJobs: number;
  completedDeals: number;
  totalValue: number;
  averageDealValue: number;
  userRetention: number; // percentage
  netPromoterScore: number;
}

export class GrowthAnalytics {
  private jobMetrics = new Map<string, JobMetrics>();
  private regionalData = new Map<string, RegionalAnalytics>();
  private cancellations: CancellationReason[] = [];
  private disputedCategories = new Map<string, DisputedCategory>();
  private platformHistory: PlatformMetrics[] = [];

  /**
   * Track job view
   */
  trackJobView(jobId: string): void {
    const metrics = this.jobMetrics.get(jobId);
    if (metrics) {
      metrics.viewCount += 1;
    }
  }

  /**
   * Track job application
   */
  trackJobApplication(jobId: string): void {
    const metrics = this.jobMetrics.get(jobId);
    if (metrics) {
      metrics.applicationCount += 1;
      if (!metrics.firstApplicationAt) {
        metrics.firstApplicationAt = Date.now();
      }
    }
  }

  /**
   * Get time to first application in minutes
   */
  getTimeToFirstApp(jobId: string): number | null {
    const metrics = this.jobMetrics.get(jobId);
    if (!metrics || !metrics.firstApplicationAt) return null;

    return (metrics.firstApplicationAt - metrics.publishedAt) / (60 * 1000);
  }

  /**
   * Register job metrics
   */
  registerJobMetrics(metrics: JobMetrics): void {
    this.jobMetrics.set(metrics.jobId, {
      ...metrics,
      viewCount: 0,
      applicationCount: 0,
      completionCount: 0,
    });
  }

  /**
   * Complete job and update metrics
   */
  completeJob(jobId: string, rating: number): void {
    const metrics = this.jobMetrics.get(jobId);
    if (metrics) {
      metrics.completionCount += 1;
      metrics.avgRating = rating;

      // Update regional analytics
      this.updateRegionalAnalytics(metrics);
    }
  }

  /**
   * Track cancellation with reason
   */
  trackCancellation(
    jobId: string,
    reason: CancellationReason['reason'],
    details: string
  ): void {
    const cancellation: CancellationReason = {
      jobId,
      reason,
      details,
      timestamp: Date.now(),
    };
    this.cancellations.push(cancellation);

    // Update disputed categories if applicable
    const metrics = this.jobMetrics.get(jobId);
    if (metrics && (reason === 'dispute' || reason === 'timeout')) {
      this.updateDisputedCategory(metrics.category, details);
    }
  }

  /**
   * Get regional analytics
   */
  getRegionalAnalytics(region: string): RegionalAnalytics {
    return (
      this.regionalData.get(region) || {
        region,
        totalJobs: 0,
        totalDeals: 0,
        averageCheckSize: 0,
        conversionRate: 0,
        cancelRatio: 0,
        topCategories: [],
        averageTimeToFirstApp: 0,
      }
    );
  }

  private updateRegionalAnalytics(metrics: JobMetrics): void {
    const regional = this.regionalData.get(metrics.region) || {
      region: metrics.region,
      totalJobs: 0,
      totalDeals: 0,
      averageCheckSize: 0,
      conversionRate: 0,
      cancelRatio: 0,
      topCategories: [],
      averageTimeToFirstApp: 0,
    };

    regional.totalJobs += 1;
    regional.totalDeals += metrics.completionCount;

    // Calculate new average check size
    regional.averageCheckSize =
      (regional.averageCheckSize * regional.totalDeals + metrics.price) / (regional.totalDeals + 1);

    // Calculate conversion rate
    regional.conversionRate = regional.totalDeals / regional.totalJobs;

    // Update top categories
    const categoryIndex = regional.topCategories.findIndex(c => c.category === metrics.category);
    if (categoryIndex >= 0) {
      regional.topCategories[categoryIndex].count += 1;
      regional.topCategories[categoryIndex].revenue += metrics.price;
    } else {
      regional.topCategories.push({
        category: metrics.category,
        count: 1,
        revenue: metrics.price,
      });
    }

    regional.topCategories.sort((a, b) => b.count - a.count);

    this.regionalData.set(metrics.region, regional);
  }

  private updateDisputedCategory(category: string, issue: string): void {
    const disputed = this.disputedCategories.get(category) || {
      category,
      disputeCount: 0,
      refundRate: 0,
      averageDisputeValue: 0,
      commonIssues: [],
    };

    disputed.disputeCount += 1;

    // Track common issues
    const issueIndex = disputed.commonIssues.findIndex(i => i.issue === issue);
    if (issueIndex >= 0) {
      disputed.commonIssues[issueIndex].count += 1;
    } else {
      disputed.commonIssues.push({ issue, count: 1 });
    }

    disputed.commonIssues.sort((a, b) => b.count - a.count);
    this.disputedCategories.set(category, disputed);
  }

  /**
   * Get view to deal conversion analysis
   */
  getConversionAnalysis(region: string): {
    totalViews: number;
    totalApplied: number;
    totalCompleted: number;
    viewToApply: number;
    applyToComplete: number;
  } {
    const regional = this.getRegionalAnalytics(region);
    const jobsInRegion = Array.from(this.jobMetrics.values()).filter(m => m.region === region);

    const totalViews = jobsInRegion.reduce((sum, m) => sum + m.viewCount, 0);
    const totalApplied = jobsInRegion.reduce((sum, m) => sum + m.applicationCount, 0);
    const totalCompleted = jobsInRegion.reduce((sum, m) => sum + m.completionCount, 0);

    return {
      totalViews,
      totalApplied,
      totalCompleted,
      viewToApply: totalViews > 0 ? totalApplied / totalViews : 0,
      applyToComplete: totalApplied > 0 ? totalCompleted / totalApplied : 0,
    };
  }

  /**
   * Get disputed categories ranking
   */
  getDisputedCategories(): DisputedCategory[] {
    return Array.from(this.disputedCategories.values()).sort((a, b) => b.disputeCount - a.disputeCount);
  }

  /**
   * Get cancellation patterns
   */
  getCancellationReasons(): {
    reason: CancellationReason['reason'];
    count: number;
    percentage: number;
  }[] {
    const total = this.cancellations.length;
    const grouped = this.cancellations.reduce(
      (acc, c) => {
        const existing = acc.find(r => r.reason === c.reason);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ reason: c.reason, count: 1 });
        }
        return acc;
      },
      [] as Array<{ reason: CancellationReason['reason']; count: number }>
    );

    return grouped.map(g => ({
      ...g,
      percentage: (g.count / total) * 100,
    }));
  }

  /**
   * Record platform metrics snapshot
   */
  recordPlatformMetrics(
    activeUsers: number,
    totalJobs: number,
    completedDeals: number,
    totalValue: number
  ): void {
    const metrics: PlatformMetrics = {
      timestamp: Date.now(),
      activeUsers,
      totalJobs,
      completedDeals,
      totalValue,
      averageDealValue: completedDeals > 0 ? totalValue / completedDeals : 0,
      userRetention: 0, // Calculated separately
      netPromoterScore: 0, // Calculated from reviews
    };

    this.platformHistory.push(metrics);
  }

  /**
   * Get growth trends
   */
  getGrowthTrends(days: number = 30): {
    userGrowth: number;
    dealGrowth: number;
    valueGrowth: number;
    trend: 'up' | 'down' | 'stable';
  } {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const recentMetrics = this.platformHistory.filter(m => m.timestamp > cutoff);
    if (recentMetrics.length < 2) {
      return { userGrowth: 0, dealGrowth: 0, valueGrowth: 0, trend: 'stable' };
    }

    const first = recentMetrics[0];
    const last = recentMetrics[recentMetrics.length - 1];

    const userGrowth = ((last.activeUsers - first.activeUsers) / first.activeUsers) * 100;
    const dealGrowth = ((last.completedDeals - first.completedDeals) / first.completedDeals) * 100;
    const valueGrowth = ((last.totalValue - first.totalValue) / first.totalValue) * 100;

    const avgGrowth = (userGrowth + dealGrowth + valueGrowth) / 3;
    const trend = avgGrowth > 10 ? 'up' : avgGrowth < -10 ? 'down' : 'stable';

    return { userGrowth, dealGrowth, valueGrowth, trend };
  }

  /**
   * Get metrics history
   */
  getMetricsHistory(): PlatformMetrics[] {
    return [...this.platformHistory];
  }
}

export const growthAnalytics = new GrowthAnalytics();
