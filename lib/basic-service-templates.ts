// Basic Service Templates for Low-Skill Tasks
// Accessible entry-level jobs across all experimental African markets

export interface BasicServiceTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  requirements: string[];
  basePay: { [currency: string]: number };
  estimatedTime: string;
  deliverables: string[];
  examples: string[];
  qualityGuidelines: string[];
}

export class BasicServiceTemplates {
  readonly templates: BasicServiceTemplate[] = [
    {
      id: 'photo-enhancement',
      category: 'Photography',
      title: 'Product Photo Enhancement',
      description:
        'Adjust lighting, remove backgrounds, crop, and enhance photos for e-commerce or local businesses',
      requirements: [
        'Basic photo editing software (Photoshop, GIMP, or online tools)',
        'Good internet connection for uploads',
        'Attention to detail',
      ],
      basePay: {
        XOF: 8000,
        ETB: 200,
        PHP: 250,
        NGN: 3000,
      },
      estimatedTime: '30 min - 1 hour',
      deliverables: [
        'Enhanced product image (JPG, max 2MB)',
        'Background removed if requested',
        'Color correction applied',
      ],
      examples: [
        'Before/after clothing photos',
        'Product catalog enhancement',
        'Restaurant menu photos',
      ],
      qualityGuidelines: [
        'No over-processing',
        'Natural colors maintained',
        'Sharp focus on subject',
        'Consistent file format',
      ],
    },
    {
      id: 'simple-graphic-design',
      category: 'Design',
      title: 'Social Media Graphics (Template-Based)',
      description:
        'Create Instagram posts, Facebook banners, or promotional graphics using design templates',
      requirements: [
        'Canva account or similar (free tier acceptable)',
        'Basic design sense',
        'Understanding of social media dimensions',
      ],
      basePay: {
        XOF: 10000,
        ETB: 250,
        PHP: 300,
        NGN: 3500,
      },
      estimatedTime: '1-2 hours',
      deliverables: [
        '3-5 social media graphics',
        'Multiple format exports (Instagram, Facebook)',
        'PNG with transparent background',
      ],
      examples: [
        'Restaurant promotion posts',
        'Retail sales announcements',
        'Service business highlights',
      ],
      qualityGuidelines: [
        'Brand colors maintained',
        'Text clearly readable',
        'Professional appearance',
        'Correct dimensions for platform',
      ],
    },
    {
      id: 'voice-recording',
      category: 'Audio',
      title: 'Voiceover Recording (Simple)',
      description:
        'Record clear voiceovers for ads, tutorials, or announcements in local languages',
      requirements: [
        'Smartphone or computer with mic',
        'Quiet recording environment',
        'Native or fluent speaker',
        'Basic audio recording app (free)',
      ],
      basePay: {
        XOF: 12000,
        ETB: 300,
        PHP: 400,
        NGN: 4000,
      },
      estimatedTime: '1-3 hours',
      deliverables: [
        'MP3 or WAV audio file',
        'Max 2 minutes per recording',
        'Clean audio without background noise',
      ],
      examples: [
        'Product descriptions',
        'Radio ads (30-60 sec)',
        'Tutorial narration',
      ],
      qualityGuidelines: [
        'No background noise',
        'Clear pronunciation',
        'Consistent volume',
        'Professional delivery',
      ],
    },
    {
      id: 'data-entry-basic',
      category: 'Data Entry',
      title: 'Basic Data Entry',
      description:
        'Input information into spreadsheets or databases from images or documents',
      requirements: [
        'Excel or Google Sheets knowledge',
        'Careful attention to accuracy',
        'Basic typing speed',
      ],
      basePay: {
        XOF: 8000,
        ETB: 180,
        PHP: 200,
        NGN: 2500,
      },
      estimatedTime: '2-4 hours',
      deliverables: [
        'Completed Excel spreadsheet',
        'CSV format export',
        'Data validation completed',
      ],
      examples: [
        'Menu item pricing entry',
        'Contact list compilation',
        'Inventory spreadsheet',
      ],
      qualityGuidelines: [
        '99% accuracy required',
        'Consistent formatting',
        'No blank cells without approval',
        'Proper data types (numbers, dates)',
      ],
    },
    {
      id: 'photo-tagging',
      category: 'Data Labeling',
      title: 'Photo Tagging & Categorization',
      description:
        'Tag and categorize photos for AI training or photo management projects',
      requirements: [
        'Attention to detail',
        'Basic English (for categorization)',
        'Reliable internet',
      ],
      basePay: {
        XOF: 6000,
        ETB: 150,
        PHP: 180,
        NGN: 2000,
      },
      estimatedTime: '2-5 hours',
      deliverables: [
        'Tagged image database',
        'CSV with tags and metadata',
        'Quality verification completed',
      ],
      examples: [
        'Object recognition (cars, animals)',
        'Scene categorization',
        'Sentiment analysis on images',
      ],
      qualityGuidelines: [
        'Consistent tag vocabulary',
        'Accurate categorization',
        'No duplicate entries',
        'Complete metadata required',
      ],
    },
    {
      id: 'simple-transcription',
      category: 'Transcription',
      title: 'Audio Transcription (Simple)',
      description: 'Transcribe clear audio recordings to text format',
      requirements: [
        'Excellent hearing/listening skills',
        'Typing proficiency',
        'Language understanding',
      ],
      basePay: {
        XOF: 8000,
        ETB: 200,
        PHP: 250,
        NGN: 2800,
      },
      estimatedTime: '3-6 hours',
      deliverables: [
        'TXT or DOCX transcription',
        'Timestamp notes',
        'Spell-checked document',
      ],
      examples: [
        'Meeting notes transcription',
        'Interview text',
        'Podcast segments',
      ],
      qualityGuidelines: [
        'Verbatim accuracy',
        'Proper punctuation',
        'Clear speaker identification',
        'Timestamp every 5 minutes',
      ],
    },
  ];

  getTemplatesByMarket(countryCode: string): BasicServiceTemplate[] {
    // Customize templates based on market demand
    const marketDemand: { [key: string]: string[] } = {
      SN: ['photo-enhancement', 'simple-graphic-design', 'voice-recording'],
      CI: [
        'photo-enhancement',
        'simple-graphic-design',
        'data-entry-basic',
        'voice-recording',
      ],
      ET: [
        'voice-recording',
        'photo-tagging',
        'simple-transcription',
        'data-entry-basic',
      ],
    };

    const demanded = marketDemand[countryCode] || [];
    return this.templates.filter((t) => demanded.includes(t.id));
  }

  getRequiredTools(templateId: string): string[] {
    const toolsByTemplate: { [key: string]: string[] } = {
      'photo-enhancement': [
        'GIMP (free)',
        'Photoshop (paid)',
        'Pixlr (online, free)',
        'Canva (free)',
      ],
      'simple-graphic-design': ['Canva (free)', 'PicMonkey (free trial)', 'Figma (free)'],
      'voice-recording': [
        'Audacity (free)',
        'GarageBand (iPhone)',
        'Voice Memos (Android/iOS)',
      ],
      'data-entry-basic': ['Excel', 'Google Sheets', 'LibreOffice Calc'],
      'photo-tagging': ['Browser-based tool', 'Google Images API'],
      'simple-transcription': [
        'Google Docs Voice Typing',
        'Otter.ai (free tier)',
        'Rev.com',
      ],
    };

    return toolsByTemplate[templateId] || [];
  }

  getTrainingResources(templateId: string): string[] {
    return [
      'YouTube tutorial playlist (free)',
      'Interactive video course',
      'PDF guidelines with examples',
      'Live Q&A with experienced workers (optional)',
    ];
  }

  getQualityChecklist(templateId: string): string[] {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) return [];

    return [
      `Meets all requirements: ${template.requirements.length} items`,
      `Delivers all deliverables: ${template.deliverables.length} items`,
      `Follows quality guidelines: ${template.qualityGuidelines.length} points`,
      'On-time delivery',
      'Professional presentation',
    ];
  }
}
