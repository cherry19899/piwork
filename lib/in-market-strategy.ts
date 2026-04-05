export interface IndianState {
  code: string;
  name: string;
  population: number;
  piPenetration: number;
  englishProficiency: number;
  collegePriority: boolean;
  techJobs: boolean;
}

export const indianStateStrategy = {
  phase1States: ['KA', 'MH'], // Karnataka, Maharashtra
  phase2Expansion: ['TN', 'TS', 'AP'], // Tamil Nadu, Telangana, Andhra Pradesh
  phase3National: ['DL', 'UP', 'GJ'], // Delhi, UP, Gujarat
  
  karnatakaBangalore: {
    collegePriority: ['IIIT-B', 'PESIT', 'MANIPAL'],
    jobCategories: ['technical_support', 'app_testing', 'programming'],
    expectedJobs: 500,
  },
  
  maharashtraPune: {
    collegePriority: ['COEP', 'VIIT', 'MIT'],
    jobCategories: ['software_testing', 'data_analysis', 'content_qa'],
    expectedJobs: 600,
  },
  
  languageFragmentation: {
    hindi: 0.34,
    bengali: 0.08,
    telugu: 0.08,
    marathi: 0.07,
    tamil: 0.06,
    gujarati: 0.05,
    kannada: 0.04,
    english: 0.1,
  },
  
  pricingMultiplier: 0.5, // Half of US rates due to PPP
};
