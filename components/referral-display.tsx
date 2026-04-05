'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Share2, Copy, Check } from 'lucide-react';

interface ReferralDisplayProps {
  referralCode: string;
  trustCircleCount?: number;
  commissionEarnings?: number;
  referredUsers?: number;
  className?: string;
}

export function ReferralDisplay({
  referralCode,
  trustCircleCount = 0,
  commissionEarnings = 0,
  referredUsers = 0,
  className = '',
}: ReferralDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `Join me on Piwork! Use my referral code: ${referralCode} to start earning Pi on Pi Network.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Piwork',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share error:', err);
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-accent/10 to-secondary border-accent/20 p-4 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Referral Program</h3>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg bg-card border border-border">
              <code className="text-sm font-mono font-bold text-accent">{referralCode}</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="border-border hover:bg-secondary"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Your Code
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{referredUsers}</p>
            <p className="text-xs text-muted-foreground">Referred</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-2xl font-bold text-accent">{trustCircleCount}</p>
            <p className="text-xs text-muted-foreground">Trust Circle</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{commissionEarnings.toFixed(1)}π</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <strong>Earn 5% commission</strong> from each referral&apos;s job payments for 30 days
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Invite friends to Piwork</li>
            <li>• Get commission on their jobs</li>
            <li>• Build your trust circle</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
