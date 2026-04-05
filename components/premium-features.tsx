'use client';

import { useState } from 'react';
import { Zap, Target, CheckCircle, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface JobBoostOption {
  type: 'listing' | 'urgent' | 'featured';
  name: string;
  description: string;
  cost: number;
  duration: string;
  icon: React.ReactNode;
  benefits: string[];
}

interface PremiumFeaturesDisplayProps {
  userBalance: number;
  isPro: boolean;
  onBoostJob: (type: 'listing' | 'urgent' | 'featured') => Promise<void>;
  onSubscribePro: () => Promise<void>;
  onVerifyPortfolio: () => Promise<void>;
}

export function PremiumFeaturesDisplay({
  userBalance,
  isPro,
  onBoostJob,
  onSubscribePro,
  onVerifyPortfolio,
}: PremiumFeaturesDisplayProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const boostOptions: JobBoostOption[] = [
    {
      type: 'urgent',
      name: 'Mark Urgent',
      description: 'Red highlight & priority',
      cost: 3,
      duration: '12 hours',
      icon: <Zap className="w-4 h-4" />,
      benefits: ['Red urgent badge', 'Priority in search', 'Higher visibility'],
    },
    {
      type: 'listing',
      name: 'Boost Listing',
      description: 'Top search results',
      cost: 5,
      duration: '24 hours',
      icon: <Target className="w-4 h-4" />,
      benefits: ['Top search placement', 'More applications', 'Featured position'],
    },
    {
      type: 'featured',
      name: 'Featured Job',
      description: 'Premium placement',
      cost: 10,
      duration: '48 hours',
      icon: <Crown className="w-4 h-4" />,
      benefits: ['Homepage featured', 'Extra visibility', 'Double exposure'],
    },
  ];

  const handleBoost = async (type: 'listing' | 'urgent' | 'featured') => {
    const option = boostOptions.find(o => o.type === type);
    if (!option || userBalance < option.cost) return;

    setLoading(type);
    try {
      await onBoostJob(type);
    } finally {
      setLoading(null);
    }
  };

  const handleSubscribe = async () => {
    if (userBalance < 100) return;
    setLoading('pro');
    try {
      await onSubscribePro();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pro Subscription */}
      <Card
        className={`p-4 border-2 transition-colors ${
          isPro
            ? 'bg-accent/10 border-accent'
            : 'bg-card border-border hover:border-accent/50'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-bold text-foreground">Pro Subscription</h3>
              <p className="text-xs text-muted-foreground">100 Pi / month</p>
            </div>
          </div>
          {isPro && <Badge className="bg-accent text-accent-foreground">Active</Badge>}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Zero commission on all jobs</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Trust badge on profile</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Priority support</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span>Advanced analytics</span>
          </div>
        </div>

        {!isPro && (
          <Button
            onClick={handleSubscribe}
            disabled={loading === 'pro' || userBalance < 100}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 text-sm"
          >
            {loading === 'pro' ? 'Processing...' : `Subscribe - ${100} Pi`}
          </Button>
        )}
      </Card>

      {/* Portfolio Verification */}
      <Card className="bg-card border-border p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-foreground text-sm">Verify Portfolio</h3>
            <p className="text-xs text-muted-foreground">Moderator review - 10 Pi</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Get your portfolio verified by our team and display a verification badge.
        </p>

        <Button
          onClick={onVerifyPortfolio}
          disabled={loading === 'verify' || userBalance < 10}
          className="w-full bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-50 text-sm border border-border"
        >
          {loading === 'verify' ? 'Processing...' : `Verify - ${10} Pi`}
        </Button>
      </Card>

      {/* Job Boosts */}
      <div>
        <h3 className="font-bold text-foreground text-sm mb-3">Boost Your Job</h3>
        <div className="space-y-2">
          {boostOptions.map((option) => (
            <Card key={option.type} className="bg-card border-border p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  <div className="text-accent mt-0.5">{option.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{option.name}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option.duration}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-accent text-sm">{option.cost} Pi</p>
                </div>
              </div>

              <Button
                onClick={() => handleBoost(option.type)}
                disabled={loading === option.type || userBalance < option.cost}
                size="sm"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 h-8 text-xs"
              >
                {loading === option.type ? 'Processing...' : 'Boost Now'}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Balance Warning */}
      {userBalance < 100 && (
        <Card className="bg-secondary/50 border-muted p-3">
          <p className="text-xs text-muted-foreground text-center">
            You need {Math.max(100 - userBalance, 0)} Pi to unlock premium features
          </p>
        </Card>
      )}
    </div>
  );
}
