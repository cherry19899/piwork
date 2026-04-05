export interface RegionalDemandMetrics {
  region: 'PH' | 'NG' | 'ID' | 'VN';
  timestamp: Date;
  jobCategory: string;
  postings: number;
  completedDeals: number;
  avgTimeToFirstBid: number; // minutes
  conversionRate: number; // 0-1
  avgDealValue: number;
  demandTrend: 'RISING' | 'STABLE' | 'FALLING';
  supplyTrend: 'RISING' | 'STABLE' | 'FALLING';
  competitiveness: number; // 0-100 (higher = more competitive)
}

export interface RegionalHealthScore {
  region: 'PH' | 'NG' | 'ID' | 'VN';
  totalUsers: number;
  activeUsers: number;
  totalDeals: number;
  successRate: number;
  avgRating: number;
  retentionRate: number;
  giniCoefficient: number; // income inequality (0-1)
  timestamp: Date;
}

export class RegionalDemandAnalytics {
  static analyzePhilippinesDemand() {
    return {
      topCategories: [
        {
          category: 'Virtual Assistant',
          demand: 'VERY_HIGH',
          supply: 'HIGH',
          competitiveness: 75,
          avgRate: 120,
          timeToFirstBid: 15,
          trend: { demand: 'RISING', supply: 'RISING' }
        },
        {
          category: 'Graphic Design',
          demand: 'HIGH',
          supply: 'HIGH',
          competitiveness: 80,
          avgRate: 200,
          timeToFirstBid: 20,
          trend: { demand: 'RISING', supply: 'RISING' }
        },
        {
          category: 'Content Creation',
          demand: 'HIGH',
          supply: 'MEDIUM',
          competitiveness: 65,
          avgRate: 150,
          timeToFirstBid: 10,
          trend: { demand: 'RISING', supply: 'STABLE' }
        },
        {
          category: 'Transcription',
          demand: 'MEDIUM',
          supply: 'MEDIUM',
          competitiveness: 55,
          avgRate: 80,
          timeToFirstBid: 25,
          trend: { demand: 'STABLE', supply: 'RISING' }
        }
      ],
      marginAnalysis: {
        timeZoneAdvantage: 'UTC+8 covers Asian and European working hours',
        languageAdvantage: 'Fluent English for global market',
        costAdvantage: 'Lower living costs enable competitive pricing',
        supplyRisk: 'High VA supply from OnlineJobs.ph exodus'
      },
      seaonality: {
        peakMonths: ['November', 'December', 'January'], // holiday season + new projects
        slowMonths: ['July', 'August'],
        reason: 'School/summer season'
      },
      growthPotential: {
        untappedVAsInCountry: 500_000,
        currentPiworkPenetration: 0.001, // 0.1%
        monthlyGrowthTarget: 0.30 // 30% month-over-month
      }
    };
  }

  static analyzeNigeriaDemand() {
    return {
      topCategories: [
        {
          category: 'TikTok Content Creation',
          demand: 'CRITICAL',
          supply: 'MEDIUM',
          competitiveness: 45,
          avgRate: 100,
          timeToFirstBid: 8,
          trend: { demand: 'RAPIDLY_RISING', supply: 'STABLE' }
        },
        {
          category: 'Excel Data Processing',
          demand: 'HIGH',
          supply: 'MEDIUM',
          competitiveness: 50,
          avgRate: 70,
          timeToFirstBid: 12,
          trend: { demand: 'RISING', supply: 'RISING' }
        },
        {
          category: 'Pidgin Voiceover',
          demand: 'CRITICAL',
          supply: 'LOW',
          competitiveness: 30,
          avgRate: 130,
          timeToFirstBid: 5,
          trend: { demand: 'RISING', supply: 'STABLE' }
        },
        {
          category: 'Instagram Content Curation',
          demand: 'HIGH',
          supply: 'MEDIUM',
          competitiveness: 60,
          avgRate: 90,
          timeToFirstBid: 10,
          trend: { demand: 'RISING', supply: 'RISING' }
        }
      ],
      unemploymentOpportunity: {
        graduateUnemployment: 0.40,
        targetablePopulation: 2_000_000,
        averageDesiredIncome: 50_000, // NGN/month
        piworkPotentialIncome: 3000 // NGN/day at scale
      },
      internetChallenges: {
        unstableBandwidth: true,
        costOfData: 'High (₦40-50/GB)',
        solution: 'Offline-first app with sync on reconnect',
        estimatedAdoptionLift: 0.40 // 40% more adoption with offline
      },
      culturalFactors: {
        socialProof: 'Video testimonials critical',
        languagePreference: 'Pidgin English builds trust',
        paymentTrust: 'Pi Network cryptocurrency familiarity: 45%'
      }
    };
  }

  static analyzeIndonesiaDemand() {
    return {
      topCategories: [
        {
          category: 'Indonesian-English Translation',
          demand: 'HIGH',
          supply: 'LOW',
          competitiveness: 40,
          avgRate: 150,
          timeToFirstBid: 8,
          trend: { demand: 'RISING', supply: 'STABLE' },
          seasonality: 'High in Oct-Dec (tourism peak)'
        },
        {
          category: 'Cafe/SMM Design',
          demand: 'MEDIUM',
          supply: 'MEDIUM',
          competitiveness: 55,
          avgRate: 200,
          timeToFirstBid: 15,
          trend: { demand: 'STABLE', supply: 'RISING' }
        },
        {
          category: 'Instagram Management',
          demand: 'HIGH',
          supply: 'LOW',
          competitiveness: 35,
          avgRate: 300,
          timeToFirstBid: 5,
          trend: { demand: 'RISING', supply: 'RISING' }
        },
        {
          category: 'Data Entry (Regional)',
          demand: 'MEDIUM',
          supply: 'MEDIUM',
          competitiveness: 50,
          avgRate: 60,
          timeToFirstBid: 20,
          trend: { demand: 'STABLE', supply: 'STABLE' }
        }
      ],
      archipelagoFactors: {
        regions: ['JAVA (high)', 'SUMATRA (medium)', 'BALI (tourism)', 'EASTERN (low)'],
        internetCafeStrategy: 'Agents handle 5-10 workers each',
        commissionStructure: 'Platform 75%, Agent 20%, Worker 85% of agent share',
        potentialWorkers: 500_000
      },
      agentSystemBenefit: {
        problem: 'Many areas lack reliable personal internet',
        solution: 'Internet cafe agents manage workers',
        expectedAdoption: 0.30, // 30% of initial users through agents
        agentNetworkGrowth: 'Start with 100 agents, scale to 5000'
      },
      touristMarketOpportunity: {
        annualTourists: 12_000_000,
        translationNeed: 'Hotel/attraction descriptions',
        designNeed: 'Menu boards, signs, marketing materials',
        potentialGNI: 50_000_000 // potential annual marketplace volume
      }
    };
  }

  static calculateRegionalHealthScore(metrics: any): RegionalHealthScore {
    const activeUsersRatio = metrics.activeUsers / metrics.totalUsers;
    const dealsPerUser = metrics.totalDeals / metrics.totalUsers;
    const successRateByDisputes = (metrics.totalDeals - metrics.disputes) / metrics.totalDeals;
    
    // Gini coefficient: measure income inequality (0 = perfect equality, 1 = perfect inequality)
    // Calculate from earnings distribution
    const gini = this.calculateGiniCoefficient(metrics.earningsDistribution);

    return {
      region: metrics.region,
      totalUsers: metrics.totalUsers,
      activeUsers: Math.round(metrics.totalUsers * activeUsersRatio),
      totalDeals: metrics.totalDeals,
      successRate: successRateByDisputes,
      avgRating: metrics.avgRating,
      retentionRate: this.calculateRetention(metrics),
      giniCoefficient: gini,
      timestamp: new Date()
    };
  }

  private static calculateGiniCoefficient(distribution: number[]): number {
    if (distribution.length === 0) return 0;
    
    const sorted = [...distribution].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    if (sum === 0) return 0;
    
    const numerator = sorted.reduce((sum, val, i) => sum + (2 * (i + 1) - n - 1) * val, 0);
    const gini = numerator / (n * sum);
    
    return Math.max(0, Math.min(1, gini));
  }

  private static calculateRetention(metrics: any): number {
    // Users active in last 30 days / users from 60 days ago
    return (metrics.activeInLast30Days || 0) / (metrics.activeIn30to60Days || 1);
  }

  static predictDemandTrend(category: string, region: string, historicalData: any[]) {
    if (historicalData.length < 2) return 'STABLE';
    
    const recent = historicalData.slice(-7); // Last 7 days
    const previous = historicalData.slice(-14, -7); // Previous 7 days
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    const changePercent = (recentAvg - prevAvg) / prevAvg;
    
    if (changePercent > 0.15) return 'RISING';
    if (changePercent < -0.15) return 'FALLING';
    return 'STABLE';
  }

  static getRegionalOptimization(region: 'PH' | 'NG' | 'ID'): Record<string, any> {
    const optimizations = {
      PH: {
        pricing: 'Standard global rates (0.9-1.0x multiplier)',
        focus: 'VA retention and specialization',
        growth: 'Viral through VA groups and communities',
        paymentMethod: 'Instant Pi settlement primary',
        competitorResponse: 'Lower fees, better UX than OnlineJobs.ph'
      },
      NG: {
        pricing: 'Lower rates (0.65-0.75x multiplier) due to graduate unemployment',
        focus: 'Content creation and voice work specialists',
        growth: 'TikTok and WhatsApp group viral loops',
        paymentMethod: 'Pi primary, local mobile money fallback',
        internetStrategy: 'Aggressive offline mode, sync on reconnect'
      },
      ID: {
        pricing: 'Moderate rates (0.70-0.85x multiplier)',
        focus: 'Agent network expansion in internet cafes',
        growth: 'Regional expansion from Java to outer islands',
        paymentMethod: 'Pi primary, OVO/Dana for withdrawal',
        agentStrategy: 'Recruit and train 5000+ agents in 12 months'
      }
    };
    
    return optimizations[region];
  }

  static getMarketReadinessScore(region: string, metrics: any): number {
    // Score 0-100 for market readiness
    const factors = {
      piPioneers: metrics.piPioneers / 10_000_000, // Normalize to 12M PH
      internetPenetration: metrics.internetPenetration,
      youthPopulation: (metrics.youthPercentage || 0.35) * 0.5,
      freelanceAcceptance: 0.8, // Cultural factor
      languageCapability: metrics.languageCapability || 0.7
    };
    
    const score = Object.values(factors)
      .reduce((a: number, b: any) => a + b, 0) / Object.keys(factors).length * 100;
    
    return Math.round(score);
  }
}
