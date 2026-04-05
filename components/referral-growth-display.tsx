'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Gift, Zap, Share2 } from 'lucide-react';

export interface ReferralStats {
  totalReferred: number;
  activeReferrals: number;
  totalCommissionEarned: number;
  pendingCommission: number;
  networkSize: number;
  networkTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ReferralBonus {
  type: 'first_five_free' | 'monthly_commission' | 'network_multiplier';
  description: string;
  benefit: string;
  active: boolean;
}

interface ReferralGrowthProps {
  stats: ReferralStats;
  referralCode: string;
  bonuses: ReferralBonus[];
  onShare?: () => void;
  className?: string;
}

export function ReferralGrowthDisplay({
  stats,
  referralCode,
  bonuses,
  onShare,
  className = '',
}: ReferralGrowthProps) {
  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'bronze':
        return 'text-orange-700';
      case 'silver':
        return 'text-gray-400';
      case 'gold':
        return 'text-yellow-500';
      case 'platinum':
        return 'text-blue-300';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTierRequirements = (tier: string): number => {
    switch (tier) {
      case 'bronze':
        return 5;
      case 'silver':
        return 25;
      case 'gold':
        return 100;
      case 'platinum':
        return 500;
      default:
        return 0;
    }
  };

  const currentTierReq = getTierRequirements(stats.networkTier);
  const nextTier = ['bronze', 'silver', 'gold', 'platinum'][['bronze', 'silver', 'gold', 'platinum'].indexOf(stats.networkTier) + 1];
  const nextTierReq = nextTier ? getTierRequirements(nextTier) : null;

  const progressToNextTier = nextTierReq ? (stats.networkSize / nextTierReq) * 100 : 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Stats */}
      <Card className="bg-gradient-to-br from-accent/10 to-secondary border-accent/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-foreground">Viral Growth Network</h3>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-background border ${getTierColor(stats.networkTier)}`}>
            {stats.networkTier.toUpperCase()}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background border border-border">
            <p className="text-xs text-muted-foreground mb-1">Network Size</p>
            <p className="text-2xl font-bold text-accent">{stats.networkSize}</p>
            <p className="text-xs text-muted-foreground mt-1">Total referred</p>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border">
            <p className="text-xs text-muted-foreground mb-1">Commission Earned</p>
            <p className="text-2xl font-bold text-accent">{stats.totalCommissionEarned.toFixed(1)}π</p>
            <p className="text-xs text-muted-foreground mt-1">+{stats.pendingCommission.toFixed(1)}π pending</p>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="space-y-2 p-3 rounded-lg bg-background border border-border">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Progress to {nextTier?.toUpperCase() || 'MAX'}</p>
            <p className="text-sm font-bold text-accent">{Math.round(progressToNextTier)}%</p>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${progressToNextTier}%` }} />
          </div>
          {nextTierReq && (
            <p className="text-xs text-muted-foreground">
              {stats.networkSize} / {nextTierReq} referrals needed
            </p>
          )}
        </div>
      </Card>

      {/* Active Bonuses */}
      {bonuses.length > 0 && (
        <Card className="bg-card border-border p-4 space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Gift className="w-4 h-4 text-accent" />
            Active Bonuses
          </h4>

          <div className="space-y-2">
            {bonuses.map((bonus, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  bonus.active
                    ? 'bg-accent/10 border-accent/30'
                    : 'bg-secondary border-border opacity-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Zap className={`w-4 h-4 flex-shrink-0 mt-0.5 ${bonus.active ? 'text-accent' : 'text-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{bonus.description}</p>
                    <p className={`text-xs mt-1 ${bonus.active ? 'text-accent font-semibold' : 'text-muted-foreground'}`}>
                      {bonus.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-secondary border-border p-4 space-y-3">
        <h4 className="font-semibold text-foreground">Viral Growth Mechanics</h4>

        <div className="space-y-2">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Invite Friends</p>
              <p className="text-xs text-muted-foreground">Share your code and build your network</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Earn Commission</p>
              <p className="text-xs text-muted-foreground">5% from each referral&apos;s jobs for 30 days</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Unlock Tiers</p>
              <p className="text-xs text-muted-foreground">Higher tiers = more benefits and higher commissions</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent-foreground">
              4
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Network Multiplier</p>
              <p className="text-xs text-muted-foreground">Commission increases as your network grows</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tier Benefits Breakdown */}
      <Card className="bg-card border-border p-4 space-y-3">
        <h4 className="font-semibold text-foreground">Tier Benefits</h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              <span className="text-orange-700 font-semibold">Bronze</span> (5+ referrals)
            </span>
            <span className="text-foreground font-medium">5% commission</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              <span className="text-gray-400 font-semibold">Silver</span> (25+ referrals)
            </span>
            <span className="text-foreground font-medium">7% commission</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              <span className="text-yellow-500 font-semibold">Gold</span> (100+ referrals)
            </span>
            <span className="text-foreground font-medium">10% commission</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              <span className="text-blue-300 font-semibold">Platinum</span> (500+ referrals)
            </span>
            <span className="text-foreground font-medium">15% commission</span>
          </div>
        </div>
      </Card>

      {/* Share CTA */}
      <Button
        onClick={onShare}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Your Code: {referralCode}
      </Button>
    </div>
  );
}
