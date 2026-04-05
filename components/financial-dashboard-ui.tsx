'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function FinancialDashboard() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Financial Model</h1>
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Revenue Breakdown</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Commission (2%)</span>
              <span className="font-bold">1.2Kπ</span>
            </div>
            <div className="flex justify-between">
              <span>Pro Subscriptions</span>
              <span className="font-bold">300π</span>
            </div>
            <div className="flex justify-between">
              <span>Task Promotions</span>
              <span className="font-bold">450π</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">Total Revenue</span>
              <span className="font-bold text-accent">1.95Kπ</span>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Expenses</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Firebase</span>
              <span>125 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Cloud Functions</span>
              <span>65 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Arbitrator Fees (10%)</span>
              <span>38π</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing</span>
              <span>500π</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold">Total Expenses</span>
              <span className="font-bold">~761π</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-accent/10 border-accent">
          <h2 className="text-lg font-bold mb-4">Breakeven Analysis</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Deals Needed (30π avg)</span>
              <span className="font-bold">500 deals/month</span>
            </div>
            <div className="flex justify-between">
              <span>Current Status</span>
              <span className="font-bold text-accent">On Track</span>
            </div>
            <Button className="w-full mt-4">View Detailed Model</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
