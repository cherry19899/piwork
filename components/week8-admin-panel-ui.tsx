'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function Week8AdminPanel({ disputes }) {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card className="bg-card border-border p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Arbitration Panel</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-foreground">3</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-foreground">12</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold text-foreground">100%</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-3">Pending Disputes</h2>
        <div className="space-y-3">
          {disputes?.map(dispute => (
            <Card key={dispute.id} className="bg-secondary border-border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{dispute.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">Task: {dispute.taskId}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600">Client</Button>
                  <Button size="sm" variant="outline" className="text-orange-600">Freelancer</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
