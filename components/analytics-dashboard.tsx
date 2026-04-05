'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Zap, Clock, AlertTriangle } from 'lucide-react';
import { growthAnalytics } from '@/lib/growth-analytics';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    regions: [] as any[],
    conversion: null as any,
    trends: null as any,
    disputed: [] as any[],
  });

  useEffect(() => {
    // Simulate loading analytics
    const regionalData = growthAnalytics.getRegionalAnalytics('PH');
    const conversionData = growthAnalytics.getConversionAnalysis('PH');
    const trends = growthAnalytics.getGrowthTrends(30);
    const disputed = growthAnalytics.getDisputedCategories();

    setMetrics({
      regions: [
        { name: 'Philippines', deals: 1250, value: 5200, conversion: 0.32 },
        { name: 'Nigeria', deals: 890, value: 3100, conversion: 0.28 },
        { name: 'Indonesia', deals: 2100, value: 8500, conversion: 0.35 },
        { name: 'Vietnam', deals: 1560, value: 4800, conversion: 0.31 },
      ],
      conversion: conversionData,
      trends,
      disputed,
    });
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active Users</p>
              <p className="text-2xl font-bold text-foreground">12.4K</p>
              <p className="text-xs text-accent mt-1">+18% this month</p>
            </div>
            <Users className="w-5 h-5 text-accent" />
          </div>
        </Card>

        <Card className="bg-card border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Completed Deals</p>
              <p className="text-2xl font-bold text-foreground">3.2K</p>
              <p className="text-xs text-accent mt-1">+24% this month</p>
            </div>
            <ShoppingCart className="w-5 h-5 text-accent" />
          </div>
        </Card>

        <Card className="bg-card border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Avg Deal Value</p>
              <p className="text-2xl font-bold text-foreground">45.3π</p>
              <p className="text-xs text-accent mt-1">+5% this month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
        </Card>

        <Card className="bg-card border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">31%</p>
              <p className="text-xs text-accent mt-1">Views to Deals</p>
            </div>
            <Zap className="w-5 h-5 text-accent" />
          </div>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-4">Regional Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics.regions}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'var(--foreground)' }}
            />
            <Legend />
            <Bar dataKey="deals" fill="var(--accent)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="value" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Growth Trends */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Growth Trends (30 days)</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">User Growth</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full" 
                    style={{ width: `${Math.min(100, (metrics.trends?.userGrowth || 0) + 50)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${(metrics.trends?.userGrowth || 0) > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {metrics.trends?.userGrowth?.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Deal Growth</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full" 
                    style={{ width: `${Math.min(100, (metrics.trends?.dealGrowth || 0) + 50)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${(metrics.trends?.dealGrowth || 0) > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {metrics.trends?.dealGrowth?.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Revenue Growth</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full" 
                    style={{ width: `${Math.min(100, (metrics.trends?.valueGrowth || 0) + 50)}%` }}
                  />
                </div>
                <span className={`text-xs font-bold ${(metrics.trends?.valueGrowth || 0) > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {metrics.trends?.valueGrowth?.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-4">Disputed Categories</h3>
          {metrics.disputed.length > 0 ? (
            <div className="space-y-2">
              {metrics.disputed.slice(0, 4).map((category, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-xs font-medium text-foreground">{category.category}</span>
                  </div>
                  <span className="text-xs font-bold text-destructive">{category.disputeCount} disputes</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No disputed categories</p>
          )}
        </Card>
      </div>

      {/* Time to First Application */}
      <Card className="bg-card border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Key Metrics by Region
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-muted-foreground">Region</th>
                <th className="text-right py-2 px-2 text-muted-foreground">Avg Time to 1st App</th>
                <th className="text-right py-2 px-2 text-muted-foreground">Conversion %</th>
                <th className="text-right py-2 px-2 text-muted-foreground">Avg Deal Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-2 text-foreground">Philippines</td>
                <td className="text-right py-2 px-2 text-muted-foreground">42 min</td>
                <td className="text-right py-2 px-2 text-accent font-semibold">32%</td>
                <td className="text-right py-2 px-2 text-foreground">42.5π</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-2 text-foreground">Nigeria</td>
                <td className="text-right py-2 px-2 text-muted-foreground">38 min</td>
                <td className="text-right py-2 px-2 text-accent font-semibold">28%</td>
                <td className="text-right py-2 px-2 text-foreground">38.2π</td>
              </tr>
              <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-2 text-foreground">Indonesia</td>
                <td className="text-right py-2 px-2 text-muted-foreground">52 min</td>
                <td className="text-right py-2 px-2 text-accent font-semibold">35%</td>
                <td className="text-right py-2 px-2 text-foreground">48.3π</td>
              </tr>
              <tr className="hover:bg-secondary/50 transition-colors">
                <td className="py-2 px-2 text-foreground">Vietnam</td>
                <td className="text-right py-2 px-2 text-muted-foreground">45 min</td>
                <td className="text-right py-2 px-2 text-accent font-semibold">31%</td>
                <td className="text-right py-2 px-2 text-foreground">45.7π</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
