// Global Regional Market Overview Component
// Mobile-optimized display of all 12 markets with key metrics

'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign, Globe } from 'lucide-react';

export function GlobalMarketOverview() {
  const regions = [
    {
      name: 'Southeast Asia',
      markets: ['Philippines', 'Indonesia', 'Vietnam'],
      users: '18.5M',
      deals: '45K',
      avgDeal: '$12',
      status: 'Launch Phase',
    },
    {
      name: 'South Asia',
      markets: ['India', 'Bangladesh', 'Pakistan'],
      users: '8.2M',
      deals: '12K',
      avgDeal: '$8',
      status: 'Planned Q2',
    },
    {
      name: 'Africa',
      markets: ['Nigeria', 'Egypt', 'Others'],
      users: '12.1M',
      deals: '28K',
      avgDeal: '$10',
      status: 'Active',
    },
    {
      name: 'Latin America',
      markets: ['Mexico', 'Colombia', 'Argentina'],
      users: '8.5M',
      deals: '19K',
      avgDeal: '$18',
      status: 'Planned Q3',
    },
    {
      name: 'Eastern Europe',
      markets: ['Ukraine', 'Moldova', 'Georgia'],
      users: '7.1M',
      deals: '8K',
      avgDeal: '$45',
      status: 'Planned Q2',
    },
    {
      name: 'MENA',
      markets: ['Morocco', 'Tunisia', 'Gulf'],
      users: '5.4M',
      deals: '9K',
      avgDeal: '$15',
      status: 'Planned Q3',
    },
  ];

  return (
    <div className="w-full h-full bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Global Markets</h1>
          <Globe className="w-5 h-5 text-accent" />
        </div>

        <Card className="bg-secondary border-border p-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Total Users</p>
              <p className="text-lg font-bold text-accent">67.8M</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active Deals</p>
              <p className="text-lg font-bold text-accent">121K</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Deal</p>
              <p className="text-lg font-bold text-accent">$18</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card border-border">
            <TabsTrigger value="overview" className="text-xs">Markets</TabsTrigger>
            <TabsTrigger value="roadmap" className="text-xs">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-2">
            {regions.map((region) => (
              <Card key={region.name} className="bg-card border-border p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{region.name}</h3>
                    <p className="text-xs text-muted-foreground">{region.markets.join(', ')}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent">
                    {region.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{region.users}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{region.deals}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                    <span className="text-accent font-semibold">{region.avgDeal}</span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-2">
            <Card className="bg-secondary border-border p-3">
              <h3 className="font-semibold text-sm text-foreground mb-2">Launch Timeline</h3>
              <div className="space-y-2 text-xs">
                <div><span className="text-accent font-semibold">Month 1-2:</span> <span className="text-muted-foreground">Philippines, Nigeria</span></div>
                <div><span className="text-accent font-semibold">Month 3-4:</span> <span className="text-muted-foreground">Indonesia, Vietnam, India</span></div>
                <div><span className="text-accent font-semibold">Month 5-6:</span> <span className="text-accent font-semibold">Latin America, Eastern Europe, MENA</span></div>
                <div><span className="text-accent font-semibold">Month 12:</span> <span className="text-muted-foreground">DAO governance across all regions</span></div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
