import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DAOGovernanceUI() {
  const [activeTab, setActiveTab] = useState('proposals');

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">DAO Governance</h1>
        <Badge className="bg-accent text-accent-foreground">1,250 WORK Tokens</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-secondary border-border p-4">
          <p className="text-xs text-muted-foreground">Voting Power</p>
          <p className="text-2xl font-bold text-accent">12.5%</p>
        </Card>
        <Card className="bg-secondary border-border p-4">
          <p className="text-xs text-muted-foreground">Active Proposals</p>
          <p className="text-2xl font-bold text-foreground">8</p>
        </Card>
        <Card className="bg-secondary border-border p-4">
          <p className="text-xs text-muted-foreground">Your Votes</p>
          <p className="text-2xl font-bold text-foreground">3</p>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-border">
        {['proposals', 'voting', 'results'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab 
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'proposals' && (
        <div className="space-y-3">
          <Card className="border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
            <h3 className="font-semibold text-foreground">Proposal: Reduce Commission to 1.5%</h3>
            <p className="text-sm text-muted-foreground mt-2">Vote: For (45%) vs Against (30%) | 2 days remaining</p>
            <Button className="mt-3 w-full bg-accent text-accent-foreground">Vote Now</Button>
          </Card>

          <Card className="border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
            <h3 className="font-semibold text-foreground">Proposal: Add Video Editing Category</h3>
            <p className="text-sm text-muted-foreground mt-2">Vote: For (62%) vs Against (18%) | 5 days remaining</p>
            <Button className="mt-3 w-full bg-accent text-accent-foreground">Vote Now</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export function SecurityAuditUI() {
  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Security & Audits</h1>

      <Card className="bg-green-500/10 border-green-500/30 p-4">
        <p className="text-sm font-semibold text-green-600">All Systems Secure</p>
        <p className="text-xs text-green-600 mt-1">Last audit: 2 weeks ago - 0 critical issues found</p>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Recent Audits</h2>
        
        <Card className="border-border p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-foreground">Smart Contract Audit</h3>
              <p className="text-xs text-muted-foreground mt-1">By: CertiK | Completed: 2 weeks ago</p>
            </div>
            <Badge className="bg-green-500/20 text-green-600">Passed</Badge>
          </div>
          <Button variant="outline" className="mt-3 text-xs">View Report</Button>
        </Card>

        <Card className="border-border p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-foreground">Penetration Testing</h3>
              <p className="text-xs text-muted-foreground mt-1">By: OpenZeppelin | Completed: 1 month ago</p>
            </div>
            <Badge className="bg-green-500/20 text-green-600">Passed</Badge>
          </div>
          <Button variant="outline" className="mt-3 text-xs">View Report</Button>
        </Card>
      </div>

      <div className="space-y-3 mt-6">
        <h2 className="font-semibold text-foreground">Bug Bounty Program</h2>
        <p className="text-sm text-muted-foreground">Report security issues and earn up to 1000 Pi</p>
        <Button className="w-full bg-accent text-accent-foreground">Report Vulnerability</Button>
      </div>
    </div>
  );
}

export function EcosystemIntegrationUI() {
  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground">Ecosystem Integrations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
          <h3 className="font-semibold text-foreground">Pi Mall</h3>
          <p className="text-xs text-muted-foreground mt-2">Spend your earnings on products</p>
          <p className="text-sm font-bold text-accent mt-3">42.5 Pi Available</p>
          <Button className="mt-3 w-full bg-accent/20 text-accent hover:bg-accent/30 text-xs">Connect</Button>
        </Card>

        <Card className="border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
          <h3 className="font-semibold text-foreground">Pi Games</h3>
          <p className="text-xs text-muted-foreground mt-2">Create assets for game developers</p>
          <Badge className="mt-3 bg-green-500/20 text-green-600 text-xs">Connected</Badge>
        </Card>

        <Card className="border-border p-4 hover:border-accent/50 transition-colors cursor-pointer">
          <h3 className="font-semibold text-foreground">Pi Social</h3>
          <p className="text-xs text-muted-foreground mt-2">Share your portfolio with the community</p>
          <Button className="mt-3 w-full bg-accent/20 text-accent hover:bg-accent/30 text-xs">Publish Portfolio</Button>
        </Card>
      </div>
    </div>
  );
}
