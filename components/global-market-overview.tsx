'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, TrendingUp, Users, Zap } from 'lucide-react';

export interface RegionalMarket {
  code: string;
  name: string;
  population: string;
  piPioneers: string;
  bankingAccess: string;
  keyJobCategories: string[];
  competitiveAdvantage: string;
  growthPotential: number;
}

export function GlobalMarketOverview() {
  const [selectedMarket, setSelectedMarket] = useState<string>('PH');

  const markets: RegionalMarket[] = [
    {
      code: 'PH',
      name: 'Philippines',
      population: '115M',
      piPioneers: '12M',
      bankingAccess: '30%',
      keyJobCategories: ['Virtual Assistant', 'Graphic Design', 'Transcription'],
      competitiveAdvantage: 'vs OnlineJobs.ph: No commission, direct Pi payment',
      growthPotential: 95,
    },
    {
      code: 'NG',
      name: 'Nigeria',
      population: '223M',
      piPioneers: '5M',
      bankingAccess: '35%',
      keyJobCategories: ['TikTok Editing', 'Pidgin Voiceover', 'Data Processing'],
      competitiveAdvantage: 'Only viable crypto solution for graduates',
      growthPotential: 90,
    },
    {
      code: 'ID',
      name: 'Indonesia',
      population: '275M',
      piPioneers: '8M',
      bankingAccess: '25%',
      keyJobCategories: ['Translation', 'SMM', 'Logo Design'],
      competitiveAdvantage: 'Internet Cafe agent model for archipelago',
      growthPotential: 85,
    },
    {
      code: 'VN',
      name: 'Vietnam',
      population: '98M',
      piPioneers: '2.5M',
      bankingAccess: '20%',
      keyJobCategories: ['Technical Support', 'App Testing', 'Programming'],
      competitiveAdvantage: 'Bypasses currency controls with Pi-only economy',
      growthPotential: 88,
    },
    {
      code: 'IN',
      name: 'India (Phase 1)',
      population: '1.4B',
      piPioneers: '15M',
      bankingAccess: '80%',
      keyJobCategories: ['Tech Support', 'QA Testing', 'Programming'],
      competitiveAdvantage: 'College partnerships in Karnataka & Maharashtra',
      growthPotential: 92,
    },
    {
      code: 'BD',
      name: 'Bangladesh',
      population: '170M',
      piPioneers: '8M',
      bankingAccess: '15%',
      keyJobCategories: ['Transcription', 'Data Labeling', 'Data Entry'],
      competitiveAdvantage: 'Bypasses sanctions, high volume low ticket',
      growthPotential: 80,
    },
  ];

  const current = markets.find(m => m.code === selectedMarket) || markets[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Global Market Strategy</h1>
      </div>

      {/* Market Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {markets.map(market => (
          <button
            key={market.code}
            onClick={() => setSelectedMarket(market.code)}
            className={`p-3 rounded-lg font-semibold text-sm transition-all ${
              selectedMarket === market.code
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'bg-card border border-border text-foreground hover:border-accent/50'
            }`}
          >
            {market.name}
          </button>
        ))}
      </div>

      {/* Market Details */}
      <Card className="bg-card border-border p-5 space-y-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{current.name}</h2>
            <p className="text-sm text-muted-foreground">{current.competitiveAdvantage}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">{current.growthPotential}% Growth</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Population</p>
            <p className="text-lg font-bold text-foreground">{current.population}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Pi Pioneers</p>
            <p className="text-lg font-bold text-foreground">{current.piPioneers}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Banking Access</p>
            <p className="text-lg font-bold text-foreground">{current.bankingAccess}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Priority Market</span>
          </div>
        </div>

        {/* Job Categories */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Key Job Categories</h3>
          <div className="flex flex-wrap gap-2">
            {current.keyJobCategories.map(cat => (
              <span
                key={cat}
                className="text-xs bg-accent/10 text-accent border border-accent/30 rounded-full px-3 py-1"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Growth Timeline */}
      <Card className="bg-secondary border-border p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Expected Growth Timeline
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Month 1</span>
            <span className="text-foreground font-semibold">100 manual deals</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Month 2-3</span>
            <span className="text-foreground font-semibold">1,000 users</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Month 6</span>
            <span className="text-foreground font-semibold">5,000+ deals</span>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          View Jobs
        </Button>
        <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
          Learn More
        </Button>
      </div>
    </div>
  );
}
