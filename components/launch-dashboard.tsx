'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Target,
  Users,
  TrendingUp,
  Video,
  Share2,
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

interface RegionalMetrics {
  region: string;
  seedJobs: number;
  completedJobs: number;
  users: number;
  earnings: number;
  testimonials: number;
  readiness: number;
}

export function LaunchDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>('philippines');

  const regions: Record<string, RegionalMetrics> = {
    philippines: {
      region: 'Philippines',
      seedJobs: 10,
      completedJobs: 7,
      users: 45,
      earnings: 250,
      testimonials: 3,
      readiness: 75,
    },
    nigeria: {
      region: 'Nigeria',
      seedJobs: 10,
      completedJobs: 4,
      users: 28,
      earnings: 120,
      testimonials: 1,
      readiness: 45,
    },
    indonesia: {
      region: 'Indonesia',
      seedJobs: 10,
      completedJobs: 5,
      users: 32,
      earnings: 180,
      testimonials: 2,
      readiness: 55,
    },
    vietnam: {
      region: 'Vietnam',
      seedJobs: 10,
      completedJobs: 3,
      users: 18,
      earnings: 85,
      testimonials: 0,
      readiness: 30,
    },
  };

  const metrics = regions[selectedRegion];

  const checklist = [
    'Find 10 real jobs manually',
    'Complete jobs on platform',
    'Record video testimonials',
    'Post to social media',
    'Contact influencers',
    'Achieve regional volume targets',
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-5 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-foreground">Regional Launch</h1>
        <p className="text-xs text-muted-foreground">
          Strategy for Philippines, Nigeria, Indonesia, Vietnam
        </p>
      </div>

      {/* Region Selector */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(regions).map(key => (
            <button
              key={key}
              onClick={() => setSelectedRegion(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRegion === key
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground border border-border'
              }`}
            >
              {regions[key].region}
            </button>
          ))}
        </div>
      </div>

      {/* Readiness Score */}
      <div className="px-4 pt-4">
        <Card className="bg-secondary border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground">
              Launch Readiness
            </h3>
            <Award className="w-4 h-4 text-accent" />
          </div>
          <div className="bg-background rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${metrics.readiness}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.readiness}% ready for scaling
          </p>
        </Card>
      </div>

      {/* Key Metrics Grid */}
      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <Card className="bg-card border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Seed Jobs</p>
          <p className="text-lg font-bold text-accent">
            {metrics.completedJobs}/{metrics.seedJobs}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </Card>

        <Card className="bg-card border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Active Users</p>
          <p className="text-lg font-bold text-accent">{metrics.users}</p>
          <p className="text-xs text-muted-foreground mt-1">Early adopters</p>
        </Card>

        <Card className="bg-card border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Volume</p>
          <p className="text-lg font-bold text-accent">{metrics.earnings} π</p>
          <p className="text-xs text-muted-foreground mt-1">Transacted</p>
        </Card>

        <Card className="bg-card border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Testimonials</p>
          <p className="text-lg font-bold text-accent">
            {metrics.testimonials}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Videos posted</p>
        </Card>
      </div>

      {/* Regional Strategy */}
      <section className="px-4 pt-6">
        <h2 className="text-base font-bold text-foreground mb-3">
          Regional Strategy
        </h2>
        <div className="space-y-2.5">
          <Card className="bg-card border-border p-3.5">
            <div className="flex gap-3">
              <Globe className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Focus: Writing, Support, Data Entry
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Categories with highest regional demand
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-3.5">
            <div className="flex gap-3">
              <Share2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Social: Facebook Groups + Telegram
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Post testimonials, job examples, success stories
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-3.5">
            <div className="flex gap-3">
              <Users className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Influencers: Tech Communities, OFWs
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Leverage existing freelancer networks
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Launch Checklist */}
      <section className="px-4 pt-6">
        <h2 className="text-base font-bold text-foreground mb-3">
          Launch Checklist
        </h2>
        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg"
            >
              {idx < 3 ? (
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-xs text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-4 pt-6 pb-4 space-y-2">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
          <Video className="w-4 h-4 mr-2" />
          Record Testimonial
        </Button>
        <Button
          variant="outline"
          className="w-full border-border hover:bg-secondary text-foreground font-semibold"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Campaign
        </Button>
        <Button
          variant="outline"
          className="w-full border-border hover:bg-secondary text-foreground font-semibold"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          View Metrics
        </Button>
      </section>
    </div>
  );
}
