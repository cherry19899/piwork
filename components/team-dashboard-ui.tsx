'use client';

import { Card } from '@/components/ui/card';

export function TeamDashboard() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Team Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Tasks</p>
          <p className="text-2xl font-bold">127</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Disputes</p>
          <p className="text-2xl font-bold">3</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Revenue Today</p>
          <p className="text-2xl font-bold text-accent">450π</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Daily Deals</p>
          <p className="text-2xl font-bold">15</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Week Revenue</p>
          <p className="text-2xl font-bold">2.8Kπ</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg Deal Value</p>
          <p className="text-2xl font-bold">30π</p>
        </Card>
      </div>
    </div>
  );
}
