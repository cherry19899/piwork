'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AmbassadorProgramUI() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Ambassador Program</h1>
      
      <Card className="p-6 bg-accent/10 border-accent">
        <h2 className="text-lg font-bold mb-4">Your Status</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Current Tier</span>
            <Badge>Silver (25+ referrals)</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Referrals</span>
            <span className="font-bold">32</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Commission Rate</span>
            <span className="font-bold text-accent">10%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Earnings This Month</span>
            <span className="font-bold text-accent">285π</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">Tier Benefits</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Badge variant="outline">Bronze</Badge>
            <span className="text-sm">5+ referrals • 10% commission</span>
          </div>
          <div className="flex gap-3">
            <Badge>Silver</Badge>
            <span className="text-sm">25+ referrals • 10% commission</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline">Gold</Badge>
            <span className="text-sm">100+ referrals • 12% commission</span>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline">Platinum</Badge>
            <span className="text-sm">500+ referrals • 15% commission</span>
          </div>
        </div>
      </Card>

      <Button className="w-full">Share Referral Link</Button>
    </div>
  );
}
