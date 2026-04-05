// Eastern Europe Market Strategy
// Ukraine: 8M Pi pioneers, skilled IT workforce, need EUR/USD withdrawal
// Moldova: 1.2M Pi pioneers, high emigration, portfolio building focus
// Georgia: 2.8M Pi pioneers, tech hub, need USD withdrawal

export interface EasternEuropeMarketConfig {
  country: 'ua' | 'md' | 'ge';
  population: number;
  piPioneers: number;
  skillLevel: 'intermediate' | 'advanced' | 'expert';
  emigrationRate: number;
  targetCurrency: 'EUR' | 'USD' | 'GBP';
  exchangeRate: number;
}

export const easternEuropeMarkets: Record<string, EasternEuropeMarketConfig> = {
  ukraine: {
    country: 'ua',
    population: 41000000,
    piPioneers: 8000000,
    skillLevel: 'advanced',
    emigrationRate: 0.15,
    targetCurrency: 'EUR',
    exchangeRate: 1.05,
  },
  moldova: {
    country: 'md',
    population: 3500000,
    piPioneers: 1200000,
    skillLevel: 'intermediate',
    emigrationRate: 0.25,
    targetCurrency: 'EUR',
    exchangeRate: 1.05,
  },
  georgia: {
    country: 'ge',
    population: 3700000,
    piPioneers: 2800000,
    skillLevel: 'advanced',
    emigrationRate: 0.08,
    targetCurrency: 'USD',
    exchangeRate: 1.0,
  },
};

export const easternEuropeJobCategories = {
  it: ['Backend Development', 'QA Testing', 'DevOps', 'System Admin'],
  design: ['UI/UX Design', 'Game Design', 'Motion Graphics'],
  content: ['Technical Writing', 'Programming Tutorials', 'IT Blog Content'],
  portfolio: ['Portfolio Building Tasks', 'Open Source Contribution Help', 'Case Study Writing'],
};

export const easternEuropePricingMultipliers = {
  ukraine: 0.55,
  moldova: 0.48,
  georgia: 0.60,
};

// Portfolio Building Strategy: Small tasks → portfolio → Western market transition
export interface PortfolioPathway {
  stage: 'beginner' | 'intermediate' | 'advanced';
  minDeals: number;
  minRating: number;
  targetedSkills: string[];
  portfolioGoal: string;
  westerMarketReadiness: number; // 0-100%
}

export const portfolioPathway: PortfolioPathway[] = [
  {
    stage: 'beginner',
    minDeals: 5,
    minRating: 4.0,
    targetedSkills: ['Basic QA', 'Simple CSS', 'Documentation'],
    portfolioGoal: '3 simple projects',
    westerMarketReadiness: 20,
  },
  {
    stage: 'intermediate',
    minDeals: 25,
    minRating: 4.5,
    targetedSkills: ['Full-stack dev', 'Complex QA', 'Backend'],
    portfolioGoal: '5 substantial projects',
    westerMarketReadiness: 60,
  },
  {
    stage: 'advanced',
    minDeals: 50,
    minRating: 4.8,
    targetedSkills: ['Architecture', 'Team Leadership', 'Mentoring'],
    portfolioGoal: 'Professional portfolio ready for Upwork/Toptal',
    westerMarketReadiness: 90,
  },
];
