import { REGION_CONFIG } from '@/lib/piwork-config';

export interface RegionalPrice {
  basePrice: number;
  adjustedPrice: number;
  region: string;
  multiplier: number;
  currency: string;
}

export class RegionalPricingSystem {
  static getRegionConfig(regionCode: string) {
    return REGION_CONFIG.regions.find(r => r.code === regionCode);
  }

  static adjustPriceForRegion(basePrice: number, regionCode: string): RegionalPrice {
    const region = this.getRegionConfig(regionCode);

    if (!region) {
      return {
        basePrice,
        adjustedPrice: basePrice,
        region: regionCode,
        multiplier: 1.0,
        currency: 'pi',
      };
    }

    const adjustedPrice = Math.round(basePrice * region.basePriceMultiplier * 100) / 100;

    return {
      basePrice,
      adjustedPrice,
      region: region.code,
      multiplier: region.basePriceMultiplier,
      currency: region.currency,
    };
  }

  static getRecommendedPriceRange(jobCategory: string, regionCode: string): { min: number; max: number } {
    const region = this.getRegionConfig(regionCode);
    if (!region) {
      return { min: 10, max: 200 };
    }

    // Base ranges for different categories (in Pi)
    const categoryBasePrices: Record<string, { min: number; max: number }> = {
      writing: { min: 20, max: 150 },
      design: { min: 50, max: 300 },
      'data-entry': { min: 10, max: 50 },
      transcription: { min: 15, max: 80 },
      moderation: { min: 10, max: 60 },
      support: { min: 15, max: 100 },
      analysis: { min: 40, max: 200 },
      development: { min: 80, max: 500 },
    };

    const baseRange = categoryBasePrices[jobCategory] || { min: 20, max: 100 };

    return {
      min: Math.round(baseRange.min * region.basePriceMultiplier * 100) / 100,
      max: Math.round(baseRange.max * region.basePriceMultiplier * 100) / 100,
    };
  }

  static getAvailableJobCategoriesForRegion(regionCode: string): string[] {
    const region = this.getRegionConfig(regionCode);
    if (!region) {
      return REGION_CONFIG.regions[0].jobCategories;
    }
    return region.jobCategories;
  }

  static isJobCategoryAvailableInRegion(jobCategory: string, regionCode: string): boolean {
    const categories = this.getAvailableJobCategoriesForRegion(regionCode);
    return categories.includes(jobCategory);
  }

  static suggestJobCategoryForRegion(regionCode: string): string {
    const categories = this.getAvailableJobCategoriesForRegion(regionCode);
    return categories.length > 0 ? categories[0] : 'writing';
  }
}
