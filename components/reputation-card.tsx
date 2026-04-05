'use client';

import { Card } from '@/components/ui/card';
import { Star, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ReputationCardProps {
  score: number;
  jobsCompleted: number;
  categories?: Record<string, number>;
  isVerified?: boolean;
  className?: string;
}

export function ReputationCard({
  score,
  jobsCompleted,
  categories = {},
  isVerified = false,
  className = '',
}: ReputationCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 4.7) return 'text-green-500';
    if (score >= 4.0) return 'text-blue-500';
    if (score >= 3.0) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.7) return 'Excellent';
    if (score >= 4.0) return 'Good';
    if (score >= 3.0) return 'Fair';
    return 'Below Average';
  };

  return (
    <Card className={`bg-secondary border-border p-4 ${className}`}>
      <div className="space-y-4">
        {/* Main Score */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-background`}>
              <div className="text-center">
                <div className={`text-lg font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}
                </div>
                <Star className={`w-4 h-4 ${getScoreColor(score)} mx-auto`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <p className="font-semibold text-foreground">{getScoreLabel(score)}</p>
            </div>
          </div>
          {isVerified && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-accent">Verified</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {jobsCompleted} jobs completed
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(categories).length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground">Rating Breakdown</p>
            {Object.entries(categories).map(([category, score]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-xs text-foreground capitalize">{category}</span>
                <div className="flex items-center gap-1">
                  <div className="h-1 w-12 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground">{score.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
