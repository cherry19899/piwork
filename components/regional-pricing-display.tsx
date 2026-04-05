'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegionalPricingSystem } from '@/lib/regional-pricing';
import { Globe, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface RegionalPricingDisplayProps {
  userRegion: string;
  jobCategory: string;
  onChangeRegion?: (region: string) => void;
  onChangeCategory?: (category: string) => void;
  className?: string;
}

export function RegionalPricingDisplay({
  userRegion,
  jobCategory,
  onChangeRegion,
  onChangeCategory,
  className = '',
}: RegionalPricingDisplayProps) {
  const regionConfig = RegionalPricingSystem.getRegionConfig(userRegion);
  const priceRange = RegionalPricingSystem.getRecommendedPriceRange(jobCategory, userRegion);
  const availableCategories = RegionalPricingSystem.getAvailableJobCategoriesForRegion(userRegion);

  const testPrice = 100; // Base price for demonstration
  const adjustedPrice = RegionalPricingSystem.adjustPriceForRegion(testPrice, userRegion);

  const regions = ['IN', 'PH', 'BR', 'NG', 'US'];
  const allCategories = ['writing', 'design', 'data-entry', 'transcription', 'moderation', 'support', 'analysis', 'development'];

  return (
    <Card className={`bg-card border-border p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-foreground">Regional Pricing & Categories</h3>
      </div>

      {/* Region Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Your Region</label>
        <div className="grid grid-cols-3 gap-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => onChangeRegion?.(region)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                userRegion === region
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
        {regionConfig && (
          <p className="text-xs text-muted-foreground">
            <strong>{regionConfig.name}</strong> - {regionConfig.basePriceMultiplier.toFixed(2)}x multiplier
          </p>
        )}
      </div>

      {/* Price Multiplier Info */}
      <div className="p-3 rounded-lg bg-secondary border border-border space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Price Multiplier Example</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Base Price: {testPrice}π</span>
          <span className="text-sm text-muted-foreground">→</span>
          <span className="text-sm font-bold text-accent">{adjustedPrice.adjustedPrice}π</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {adjustedPrice.multiplier > 1 ? (
            <>
              <TrendingUp className="w-3 h-3 inline mr-1 text-green-500" />
              Higher earning potential
            </>
          ) : adjustedPrice.multiplier < 1 ? (
            <>
              <TrendingDown className="w-3 h-3 inline mr-1 text-blue-500" />
              Accessible pricing for local markets
            </>
          ) : (
            'Standard global pricing'
          )}
        </p>
      </div>

      {/* Job Categories */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Popular Categories in {regionConfig?.name}</label>
        <div className="grid grid-cols-2 gap-2">
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => onChangeCategory?.(category)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                jobCategory === category
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="p-3 rounded-lg bg-secondary border border-border space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Recommended Price Range</p>
        <p className="text-xs text-muted-foreground mb-2">For: <strong className="text-foreground capitalize">{jobCategory}</strong></p>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Minimum</p>
            <p className="text-lg font-bold text-green-500">{priceRange.min}π</p>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-green-500 via-accent to-orange-500 rounded-full" />
          <div className="flex-1 text-right">
            <p className="text-xs text-muted-foreground mb-1">Maximum</p>
            <p className="text-lg font-bold text-orange-500">{priceRange.max}π</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Prices are adjusted based on regional purchasing power to ensure fair compensation and job accessibility.
        </p>
      </div>

      {/* All Categories Info */}
      <div className="p-3 rounded-lg bg-background border border-border space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">All Available Categories</p>
        <div className="flex flex-wrap gap-1">
          {allCategories.map(category => (
            <span
              key={category}
              className="px-2 py-1 rounded text-xs bg-secondary text-muted-foreground capitalize"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Regional Market Info */}
      <div className="space-y-2 pt-2 border-t border-border">
        <p className="text-xs font-semibold text-foreground">Market Insights</p>
        {regionConfig && (
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Region: {regionConfig.name}</li>
            <li>• Popular jobs: {regionConfig.jobCategories.slice(0, 2).join(', ')}</li>
            <li>• Pricing: {regionConfig.basePriceMultiplier > 1 ? 'Premium market' : 'Accessible market'}</li>
            <li>• Growing demand for local services</li>
          </ul>
        )}
      </div>
    </Card>
  );
}
