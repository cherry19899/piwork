// Middle East and North Africa (MENA) Market Strategy
// Egypt: 35M youth, 25% unemployment, Arabic-first content moderation
// Morocco: 12M Pi pioneers, tourism market translation needs
// Tunisia: 6.8M Pi pioneers, educated youth, tech services

export interface MenaMarketConfig {
  country: 'eg' | 'ma' | 'tn';
  population: number;
  piPioneers: number;
  youthUnemployment: number;
  primaryLanguage: 'Arabic' | 'French' | 'Arabic+French';
  arabicDialect: 'Egyptian' | 'Moroccan' | 'Tunisian' | 'Gulf MSA';
  gulfMarketExposure: number; // % of job demand from Gulf states
}

export const menaMarkets: Record<string, MenaMarketConfig> = {
  egypt: {
    country: 'eg',
    population: 104000000,
    piPioneers: 8500000,
    youthUnemployment: 0.25,
    primaryLanguage: 'Arabic',
    arabicDialect: 'Egyptian',
    gulfMarketExposure: 0.35,
  },
  morocco: {
    country: 'ma',
    population: 37000000,
    piPioneers: 3200000,
    youthUnemployment: 0.20,
    primaryLanguage: 'Arabic+French',
    arabicDialect: 'Moroccan',
    gulfMarketExposure: 0.25,
  },
  tunisia: {
    country: 'tn',
    population: 12000000,
    piPioneers: 2100000,
    youthUnemployment: 0.18,
    primaryLanguage: 'Arabic+French',
    arabicDialect: 'Tunisian',
    gulfMarketExposure: 0.30,
  },
};

export const menaJobCategories = {
  moderation: ['Arabic Forum Moderation', 'Arabic Social Media Moderation', 'Content Review'],
  translation: ['Arabic→English', 'English→Arabic', 'French↔Arabic', 'Gulf Arabic Localization'],
  content: ['Arabic Blog Writing', 'Gulf Market Content', 'Islamic Finance Content', 'E-commerce Localization'],
  voiceover: ['Arabic Narration', 'Gulf Arabic Voiceover', 'Egyptian Arabic Voiceover'],
};

export const menaPricingMultipliers = {
  egypt: 0.25,
  morocco: 0.32,
  tunisia: 0.35,
};

// Arabic Content Moderation Standards
export interface ArabicContentModerationGuide {
  category: string;
  forbiddenContent: string[];
  allowedContent: string[];
  culturalSensitivity: string[];
  gulfMarketSpecific: boolean;
}

export const arabicContentGuidelines: ArabicContentModerationGuide[] = [
  {
    category: 'Religious Content',
    forbiddenContent: ['Quranic mockery', 'Prophet ridicule', 'Extremist material'],
    allowedContent: ['Islamic education', 'Interfaith dialogue', 'Religious Q&A'],
    culturalSensitivity: ['Respect Islamic traditions', 'Avoid stereotypes', 'Diverse perspectives'],
    gulfMarketSpecific: true,
  },
  {
    category: 'Political Content',
    forbiddenContent: ['Regime criticism (Gulf)', 'Palestinian-Israeli conflict (sensitive)', 'Sectarian hate'],
    allowedContent: ['General politics', 'Economic discussion', 'Infrastructure debate'],
    culturalSensitivity: ['Understand local politics', 'Avoid external judgment', 'Regional nuances'],
    gulfMarketSpecific: true,
  },
  {
    category: 'Social Content',
    forbiddenContent: ['LGBTQ+ harassment', 'Misogynistic content', 'Racist material'],
    allowedContent: ['Family values discussion', 'Social issues', 'Community help'],
    culturalSensitivity: ['Respect family structures', 'Gender roles awareness', 'Conservative values'],
    gulfMarketSpecific: false,
  },
];

// Arabic Dialect Support
export const arabicDialectSupport = {
  egyptian: { userBase: 60000000, piPioneers: 8500000, contentNeed: 'High' },
  gulfMSA: { userBase: 150000000, piPioneers: 12000000, contentNeed: 'Very High', premium: true },
  moroccan: { userBase: 37000000, piPioneers: 3200000, contentNeed: 'Medium' },
  tunisian: { userBase: 12000000, piPioneers: 2100000, contentNeed: 'Medium' },
};
