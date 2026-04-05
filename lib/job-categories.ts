export const JOB_CATEGORIES = {
  DESIGN: {
    id: 'design',
    name: 'Design',
    description: 'Visual creation and design work',
    subcategories: [
      { id: 'logos', name: 'Logo Design' },
      { id: 'banners', name: 'Banner & Web Design' },
      { id: 'photo_editing', name: 'Photo Editing & Retouching' },
      { id: 'ui_ux', name: 'UI/UX Design' },
      { id: '3d', name: '3D Design' },
    ],
    skills: ['Adobe Creative Suite', 'Figma', 'Photoshop', 'Illustrator'],
  },
  TEXT: {
    id: 'text',
    name: 'Writing & Translation',
    description: 'Text-based work and language services',
    subcategories: [
      { id: 'translation', name: 'Translation' },
      { id: 'copywriting', name: 'Copywriting' },
      { id: 'content_writing', name: 'Content Writing' },
      { id: 'editing', name: 'Editing & Proofreading' },
      { id: 'moderation', name: 'Content Moderation' },
    ],
    skills: ['Language Proficiency', 'Writing', 'SEO', 'Proofreading'],
  },
  DATA: {
    id: 'data',
    name: 'Data & Entry',
    description: 'Data entry, processing, and verification',
    subcategories: [
      { id: 'data_entry', name: 'Data Entry' },
      { id: 'web_scraping', name: 'Web Scraping & Parsing' },
      { id: 'research', name: 'Research & Verification' },
      { id: 'lead_generation', name: 'Lead Generation' },
      { id: 'categorization', name: 'Data Categorization' },
    ],
    skills: ['Excel', 'Google Sheets', 'Data Analysis', 'Attention to Detail'],
  },
  AUDIO: {
    id: 'audio',
    name: 'Audio & Voice',
    description: 'Audio production and voice services',
    subcategories: [
      { id: 'voiceover', name: 'Voice Over' },
      { id: 'transcription', name: 'Transcription' },
      { id: 'narration', name: 'Narration' },
      { id: 'audio_editing', name: 'Audio Editing' },
      { id: 'podcast', name: 'Podcast Production' },
    ],
    skills: ['Voice Acting', 'Audio Editing', 'Audacity', 'Professional Voice'],
  },
  VIDEO: {
    id: 'video',
    name: 'Video & Animation',
    description: 'Video editing, animation, and motion graphics',
    subcategories: [
      { id: 'video_editing', name: 'Video Editing' },
      { id: 'subtitles', name: 'Subtitles & Captions' },
      { id: 'animation', name: 'Animation' },
      { id: 'motion_graphics', name: 'Motion Graphics' },
      { id: 'color_grading', name: 'Color Grading' },
    ],
    skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro'],
  },
  MARKETING: {
    id: 'marketing',
    name: 'Marketing & Social',
    description: 'Marketing and social media services',
    subcategories: [
      { id: 'social_media', name: 'Social Media Management' },
      { id: 'seo', name: 'SEO Services' },
      { id: 'email_marketing', name: 'Email Marketing' },
      { id: 'ad_creation', name: 'Ad Creation' },
      { id: 'influencer', name: 'Influencer Collaboration' },
    ],
    skills: ['Social Media', 'Marketing Strategy', 'Analytics', 'Copywriting'],
  },
  CODING: {
    id: 'coding',
    name: 'Programming & Tech',
    description: 'Software development and technical work',
    subcategories: [
      { id: 'web_dev', name: 'Web Development' },
      { id: 'mobile_dev', name: 'Mobile Development' },
      { id: 'bug_fix', name: 'Bug Fixing' },
      { id: 'code_review', name: 'Code Review' },
      { id: 'database', name: 'Database Design' },
    ],
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
  },
  CUSTOMER_SERVICE: {
    id: 'customer_service',
    name: 'Customer Support',
    description: 'Customer service and support work',
    subcategories: [
      { id: 'email_support', name: 'Email Support' },
      { id: 'chat_support', name: 'Chat Support' },
      { id: 'qa_testing', name: 'QA Testing' },
      { id: 'research_support', name: 'Research Support' },
      { id: 'feedback_analysis', name: 'Feedback Analysis' },
    ],
    skills: ['Communication', 'Problem Solving', 'Patience', 'Typing Speed'],
  },
} as const;

export type JobCategoryKey = keyof typeof JOB_CATEGORIES;

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategoryKey;
  subcategory: string;
  budget: number; // in Pi
  currency: 'pi' | 'usd' | 'eur';
  duration: 'hours' | 'days' | 'weeks' | 'ongoing';
  timeframe: string; // e.g., "2-3 hours", "1 week"
  requiredSkills: string[];
  requiredRating?: number;
  minimumJobs?: number;
  attachments?: string[];
  isUrgent: boolean;
  isPremium: boolean;
  createdAt: number;
  deadline?: number;
}

export function getCategory(categoryId: JobCategoryKey) {
  return JOB_CATEGORIES[categoryId];
}

export function getAllCategories() {
  return Object.values(JOB_CATEGORIES);
}

export function getSubcategories(categoryId: JobCategoryKey) {
  const category = JOB_CATEGORIES[categoryId];
  return category ? category.subcategories : [];
}

export function getCategoryBySubcategory(subcategoryId: string) {
  for (const category of Object.values(JOB_CATEGORIES)) {
    const sub = category.subcategories.find(s => s.id === subcategoryId);
    if (sub) {
      return { category: category.id, subcategory: sub };
    }
  }
  return null;
}

// Estimate job price range based on category and region
export function estimateJobPrice(
  categoryId: JobCategoryKey,
  complexity: 'simple' | 'medium' | 'complex',
  region: string
): { min: number; max: number } {
  // Base prices (in Pi) for different complexities
  const basePrices = {
    design: { simple: 20, medium: 50, complex: 150 },
    text: { simple: 10, medium: 30, complex: 100 },
    data: { simple: 8, medium: 20, complex: 60 },
    audio: { simple: 15, medium: 40, complex: 120 },
    video: { simple: 30, medium: 80, complex: 250 },
    marketing: { simple: 20, medium: 60, complex: 180 },
    coding: { simple: 40, medium: 100, complex: 300 },
    customer_service: { simple: 5, medium: 15, complex: 50 },
  };

  // Regional multipliers (same as in regional-pricing.ts)
  const multipliers: Record<string, number> = {
    'US': 1.3,
    'EU': 1.2,
    'AU': 1.15,
    'JP': 1.25,
    'SG': 1.1,
    'IN': 0.8,
    'PH': 0.9,
    'BR': 1.0,
    'NG': 0.7,
    'ID': 0.75,
    'VN': 0.8,
  };

  const multiplier = multipliers[region] || 0.9;
  const basePriceRange = basePrices[categoryId as keyof typeof basePrices];

  return {
    min: Math.round(basePriceRange.simple * multiplier),
    max: Math.round(basePriceRange.complex * multiplier),
  };
}
