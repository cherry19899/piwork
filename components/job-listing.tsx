'use client';

import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface JobListingProps {
  title: string;
  requester: string;
  description: string;
  price: number;
  category?: string;
  timeframe: string;
}

export function JobListing({
  title,
  requester,
  description,
  price,
  category,
  timeframe,
}: JobListingProps) {
  return (
    <Card className="bg-card border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{requester}</p>
        </div>
        <span className="text-accent font-bold text-sm">{price}π</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>{timeframe}</span>
      </div>
    </Card>
  );
}
