export interface JobTemplate {
  templateId: string;
  region: 'PH' | 'NG' | 'ID' | 'VN' | 'GLOBAL';
  category: string;
  subcategory: string;
  title: string;
  description: string;
  shortDescription: string;
  requiredSkills: string[];
  optionalSkills: string[];
  estimatedTime: string;
  deliverables: string[];
  priceRange: {
    min: number;
    max: number;
    recommended: number;
  };
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  language: string[];
  sampleDeliverables: string[];
  commonMistakes: string[];
  tips: string[];
}

export class MarketSpecificJobTemplates {
  static getPhilippinesTemplates(): JobTemplate[] {
    return [
      {
        templateId: 'ph-va-001',
        region: 'PH',
        category: 'Virtual Assistant',
        subcategory: 'Administrative',
        title: 'Virtual Assistant - Email and Calendar Management',
        description: 'Manage emails, schedule meetings, organize calendar for busy entrepreneur',
        shortDescription: 'Email & calendar management for business owner',
        requiredSkills: ['Gmail proficiency', 'Calendar management', 'Email etiquette'],
        optionalSkills: ['CRM experience', 'Time zone awareness', 'Customer service'],
        estimatedTime: '10-20 hours/week (ongoing)',
        deliverables: ['Organized inbox', 'Scheduled meetings', 'Calendar updates'],
        priceRange: { min: 100, max: 300, recommended: 150 },
        difficulty: 'BEGINNER',
        language: ['English'],
        sampleDeliverables: ['Email templates', 'Calendar layout', 'Meeting notes template'],
        commonMistakes: [
          'Missing time zone conversions',
          'Over-scheduling back-to-back meetings',
          'Not confirming before canceling'
        ],
        tips: [
          'Use color coding for priority',
          'Set buffer time between meetings',
          'Confirm meeting details 24 hours before'
        ]
      },
      {
        templateId: 'ph-design-001',
        region: 'PH',
        category: 'Design',
        subcategory: 'Graphics',
        title: 'Graphic Design - Social Media Assets',
        description: 'Create eye-catching graphics for Instagram, Facebook, TikTok posts',
        shortDescription: 'Social media graphics for content creator',
        requiredSkills: ['Canva or Photoshop', 'Design principles', 'Trendy aesthetics'],
        optionalSkills: ['Animation basics', 'Video editing', 'Brand consistency'],
        estimatedTime: '2-5 days per project',
        deliverables: ['10-20 unique designs', 'PNG and JPG formats', 'Multiple sizes'],
        priceRange: { min: 150, max: 400, recommended: 250 },
        difficulty: 'INTERMEDIATE',
        language: ['English', 'Tagalog'],
        sampleDeliverables: [
          'Instagram story template',
          'Feed post design',
          'Reel thumbnail'
        ],
        commonMistakes: [
          'Ignoring safe zones for text',
          'Using overly similar color schemes',
          'Low resolution delivery'
        ],
        tips: [
          'Keep text minimal',
          'Use brand colors consistently',
          'Test on mobile before delivery'
        ]
      },
      {
        templateId: 'ph-transcription-001',
        region: 'PH',
        category: 'Transcription',
        subcategory: 'Audio',
        title: 'English Transcription - Interview to Text',
        description: 'Transcribe English interviews, podcasts, or videos to text',
        shortDescription: 'Convert audio interviews to text',
        requiredSkills: ['Typing speed 60+ WPM', 'English fluency', 'Attention to detail'],
        optionalSkills: ['Timestamps', 'Punctuation expertise', 'Technical vocabulary'],
        estimatedTime: '3-4 hours per 1 hour of audio',
        deliverables: ['Word document', 'Google Docs link', 'Properly formatted'],
        priceRange: { min: 50, max: 150, recommended: 100 },
        difficulty: 'BEGINNER',
        language: ['English'],
        sampleDeliverables: ['Sample 5-min transcript', 'Timestamp example'],
        commonMistakes: [
          'Paraphrasing instead of exact words',
          'Inconsistent speaker labels',
          'Ignoring background noise indicators'
        ],
        tips: [
          'Listen to full sentence before typing',
          'Use timestamps every 5 minutes',
          '[inaudible]' for unclear sections'
        ]
      }
    ];
  }

  static getNigeriaTemplates(): JobTemplate[] {
    return [
      {
        templateId: 'ng-tiktok-001',
        region: 'NG',
        category: 'Content Creation',
        subcategory: 'Video',
        title: 'TikTok Video Editing - Hook Creation',
        description: 'Edit TikTok videos with trending music, hooks, and effects for engagement',
        shortDescription: 'Create trending TikTok videos',
        requiredSkills: ['CapCut or equivalent', 'Trend awareness', 'Pacing'],
        optionalSkills: ['Audio syncing', 'Color grading', 'Transition mastery'],
        estimatedTime: '1-2 hours per video',
        deliverables: ['Edited video file', 'Caption options', 'Multiple formats'],
        priceRange: { min: 60, max: 180, recommended: 120 },
        difficulty: 'INTERMEDIATE',
        language: ['English', 'Pidgin'],
        sampleDeliverables: ['Hook example video', 'Transition library'],
        commonMistakes: [
          'Hook too long',
          'Audio not synced properly',
          'Outdated trends used'
        ],
        tips: [
          'Hook should grab in first 0.5 seconds',
          'Match beat drops with visual transitions',
          'Use current trending audio'
        ]
      },
      {
        templateId: 'ng-voiceover-001',
        region: 'NG',
        category: 'Audio/Voice',
        subcategory: 'Voiceover',
        title: 'Pidgin English Voiceover - Commercial',
        description: 'Record professional voiceovers in Pidgin English for ads and promotions',
        shortDescription: 'Native Pidgin voiceover recording',
        requiredSkills: ['Native Pidgin speaker', 'Clear diction', 'Microphone'],
        optionalSkills: ['Multiple accents', 'Emotion variation', 'Audio editing'],
        estimatedTime: '1-3 hours per project',
        deliverables: ['MP3 file', 'WAV file', 'Multiple takes option'],
        priceRange: { min: 100, max: 250, recommended: 150 },
        difficulty: 'INTERMEDIATE',
        language: ['Pidgin English'],
        sampleDeliverables: ['Sample commercial', 'Raw recording sample'],
        commonMistakes: [
          'Speaking too fast',
          'Background noise present',
          'Unnatural pronunciation'
        ],
        tips: [
          'Record in quiet room',
          'Speak naturally, not overly formal',
          'Provide 2-3 takes'
        ]
      },
      {
        templateId: 'ng-excel-001',
        region: 'NG',
        category: 'Data Entry',
        subcategory: 'Data Processing',
        title: 'Excel Data Processing - Cleaning & Formatting',
        description: 'Clean, organize, and format Excel data with formulas and pivot tables',
        shortDescription: 'Excel data organization',
        requiredSkills: ['Excel formulas', 'Data cleaning', 'Attention to detail'],
        optionalSkills: ['VLOOKUP', 'Pivot tables', 'Data visualization'],
        estimatedTime: '2-5 hours per dataset',
        deliverables: ['Cleaned Excel file', 'Formulas intact', 'Documented process'],
        priceRange: { min: 50, max: 120, recommended: 80 },
        difficulty: 'BEGINNER',
        language: ['English'],
        sampleDeliverables: ['Before/after comparison', 'Formula examples'],
        commonMistakes: [
          'Deleting instead of flagging duplicates',
          'Not preserving raw data',
          'Inconsistent formatting'
        ],
        tips: [
          'Keep original data in separate sheet',
          'Use formulas, not manual entry',
          'Document all changes'
        ]
      }
    ];
  }

  static getIndonesiaTemplates(): JobTemplate[] {
    return [
      {
        templateId: 'id-translation-001',
        region: 'ID',
        category: 'Translation',
        subcategory: 'Tourism',
        title: 'Indonesian to English Translation - Hotel Descriptions',
        description: 'Translate hotel, restaurant, and tourist attraction descriptions from Indonesian to English',
        shortDescription: 'Tourism business translation (ID→EN)',
        requiredSkills: ['Fluent Indonesian', 'English writing', 'Tourism knowledge'],
        optionalSkills: ['SEO knowledge', 'Native English speaker review', 'Cultural adaptation'],
        estimatedTime: '3-5 hours per 1000 words',
        deliverables: ['Google Docs', 'Formatted document', 'Glossary provided'],
        priceRange: { min: 100, max: 300, recommended: 150 },
        difficulty: 'INTERMEDIATE',
        language: ['Indonesian', 'English'],
        sampleDeliverables: ['Hotel description before/after', 'Terminology glossary'],
        commonMistakes: [
          'Literal translation instead of natural English',
          'Missing cultural nuances',
          'Inconsistent terminology'
        ],
        tips: [
          'Research local businesses first',
          'Use hospitality terminology correctly',
          'Consider tourist expectations'
        ]
      },
      {
        templateId: 'id-smm-001',
        region: 'ID',
        category: 'Social Media',
        subcategory: 'Management',
        title: 'Instagram Management - Micro-Influencer Support',
        description: 'Manage Instagram for micro-influencers (10K-100K followers): posts, engagement, growth',
        shortDescription: 'Manage micro-influencer Instagram',
        requiredSkills: ['Instagram expertise', 'Content strategy', 'Hashtag research'],
        optionalSkills: ['Reels creation', 'Analytics reading', 'Collaboration outreach'],
        estimatedTime: '15-25 hours/month',
        deliverables: ['Daily posts', 'Engagement reports', 'Growth tracking'],
        priceRange: { min: 200, max: 500, recommended: 350 },
        difficulty: 'INTERMEDIATE',
        language: ['Indonesian', 'English'],
        sampleDeliverables: ['Content calendar', 'Hashtag list', 'Analytics report'],
        commonMistakes: [
          'Posting without strategy',
          'Ignoring comment engagement',
          'Overusing irrelevant hashtags'
        ],
        tips: [
          'Post consistently 5-6 days/week',
          'Respond to all comments within 24 hours',
          'Research top 20 hashtags in niche'
        ]
      },
      {
        templateId: 'id-design-cafe-001',
        region: 'ID',
        category: 'Design',
        subcategory: 'Menu Design',
        title: 'Menu Design - Local Cafe/Restaurant',
        description: 'Design beautiful, visually appealing menu for Indonesian cafe or restaurant',
        shortDescription: 'Cafe menu design',
        requiredSkills: ['Canva/Figma', 'Food photography knowledge', 'Layout design'],
        optionalSkills: ['Print design', 'Brand identity', 'Multiple language layout'],
        estimatedTime: '3-5 days per project',
        deliverables: ['High-res PDF', 'Editable source file', '2 design options'],
        priceRange: { min: 150, max: 400, recommended: 250 },
        difficulty: 'INTERMEDIATE',
        language: ['Indonesian', 'English'],
        sampleDeliverables: ['Menu template', 'Food photo editing samples'],
        commonMistakes: [
          'Text too small',
          'Poor color contrast',
          'Overcrowded layout'
        ],
        tips: [
          'Leave whitespace',
          'Highlight signature dishes',
          'Keep font readable from 1 meter away'
        ]
      }
    ];
  }

  static getGlobalTemplates(): JobTemplate[] {
    return [
      {
        templateId: 'global-copywriting-001',
        region: 'GLOBAL',
        category: 'Writing',
        subcategory: 'Copywriting',
        title: 'Product Description Copywriting',
        description: 'Write engaging product descriptions optimized for conversion',
        shortDescription: 'E-commerce product writing',
        requiredSkills: ['Persuasive writing', 'SEO knowledge', 'Product understanding'],
        optionalSkills: ['A/B testing', 'UX writing', 'Brand voice'],
        estimatedTime: '30 min - 1 hour per product',
        deliverables: ['10-20 descriptions', 'Formatted for platform', 'Keywords included'],
        priceRange: { min: 80, max: 250, recommended: 150 },
        difficulty: 'INTERMEDIATE',
        language: ['English'],
        sampleDeliverables: ['Before/after comparison', 'Tips guide'],
        commonMistakes: [
          'Too lengthy',
          'Ignoring SEO keywords',
          'No benefit focus'
        ],
        tips: [
          'Lead with benefits, not features',
          'Use power words',
          'Include natural keywords'
        ]
      }
    ];
  }

  static getTemplatesByRegion(region: 'PH' | 'NG' | 'ID' | 'GLOBAL'): JobTemplate[] {
    const all = [
      ...this.getPhilippinesTemplates(),
      ...this.getNigeriaTemplates(),
      ...this.getIndonesiaTemplates(),
      ...this.getGlobalTemplates()
    ];
    
    return all.filter(t => t.region === region || t.region === 'GLOBAL');
  }

  static searchTemplates(query: string): JobTemplate[] {
    const all = [
      ...this.getPhilippinesTemplates(),
      ...this.getNigeriaTemplates(),
      ...this.getIndonesiaTemplates(),
      ...this.getGlobalTemplates()
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return all.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      t.category.toLowerCase().includes(lowercaseQuery) ||
      t.requiredSkills.some(s => s.toLowerCase().includes(lowercaseQuery))
    );
  }

  static getTemplateByDifficulty(difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'): JobTemplate[] {
    const all = [
      ...this.getPhilippinesTemplates(),
      ...this.getNigeriaTemplates(),
      ...this.getIndonesiaTemplates(),
      ...this.getGlobalTemplates()
    ];
    
    return all.filter(t => t.difficulty === difficulty);
  }
}
