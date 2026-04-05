'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'onboarding' | 'inactive';
  joinDate: string;
  compensation: number;
}

interface InfrastructureStatus {
  service: string;
  status: 'up' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
}

export function InternalOperationsDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureStatus[]>([]);

  const mockTeamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Alex Chen',
      role: 'Technical Co-founder',
      status: 'active',
      joinDate: '2024-04-01',
      compensation: 50,
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Community Manager',
      status: 'onboarding',
      joinDate: '2024-05-15',
      compensation: 30,
    },
    {
      id: '3',
      name: 'Dmitri Petrov',
      role: 'Arbitration Moderator',
      status: 'active',
      joinDate: '2024-05-20',
      compensation: 25,
    },
  ];

  const mockInfrastructure: InfrastructureStatus[] = [
    { service: 'Firebase', status: 'up', uptime: 99.99, responseTime: 45 },
    { service: 'Cloud Functions', status: 'up', uptime: 99.95, responseTime: 120 },
    { service: 'CDN (Cloudflare)', status: 'up', uptime: 100, responseTime: 12 },
    { service: 'Backup System', status: 'up', uptime: 99.9, responseTime: 180 },
  ];

  useEffect(() => {
    setTeamMembers(mockTeamMembers);
    setInfrastructure(mockInfrastructure);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Co-founder')) return 'bg-accent/20 text-accent';
    if (role.includes('Manager')) return 'bg-blue-500/20 text-blue-400';
    if (role.includes('Moderator')) return 'bg-purple-500/20 text-purple-400';
    return 'bg-muted/20 text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Operations Dashboard</h1>
        <p className="text-muted-foreground mb-6">Team management and infrastructure monitoring</p>

        {/* Team Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Team Members</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map(member => (
              <Card key={member.id} className="bg-card border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : member.status === 'onboarding'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 mb-3">
                  <p>Joined: {member.joinDate}</p>
                  <p>Compensation: {member.compensation} Pi/month</p>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Infrastructure Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Infrastructure Status</h2>
          <div className="space-y-3">
            {infrastructure.map((service, index) => (
              <Card key={index} className="bg-card border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">{service.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uptime: {service.uptime}% • Response: {service.responseTime}ms
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        service.status === 'up'
                          ? 'text-green-400'
                          : service.status === 'degraded'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {service.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Schedule Team Meeting
            </Button>
            <Button variant="outline" className="border-border hover:bg-secondary">
              Run Backup Test
            </Button>
            <Button variant="outline" className="border-border hover:bg-secondary">
              View Incident Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
