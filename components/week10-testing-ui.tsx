'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Bug, Video } from 'lucide-react';

export function Week10TestingDashboard({ testingSessions }) {
  const [bugReports, setBugReports] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const filteredBugs = selectedSeverity === 'all' 
    ? bugReports 
    : bugReports.filter(b => b.severity === selectedSeverity);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <Card className="bg-card border-border p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Real User Testing</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Deals Completed</p>
            <p className="text-3xl font-bold text-foreground">10</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Videos Collected</p>
            <p className="text-3xl font-bold text-foreground">10</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Test Participants</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>5 Real Clients with genuine tasks</p>
            <p>10 Freelancers via personal outreach</p>
            <p>Complete marketplace testing cycle</p>
          </div>
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Critical Bugs Found</h2>
        
        <div className="flex gap-2 mb-4">
          {['all', 'critical', 'high', 'medium'].map(severity => (
            <Button
              key={severity}
              variant={selectedSeverity === severity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSeverity(severity)}
              className="capitalize"
            >
              {severity}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredBugs.map(bug => (
            <Card key={bug.id} className="bg-secondary border-border p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  bug.severity === 'critical' ? 'bg-destructive/20' : 
                  bug.severity === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    bug.severity === 'critical' ? 'text-destructive' :
                    bug.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{bug.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{bug.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Video Testimonials</h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
