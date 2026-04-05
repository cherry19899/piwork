'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Scale, Vote, CheckCircle2, XCircle } from 'lucide-react';

export interface DisputeCase {
  id: string;
  jobId: string;
  requesterName: string;
  workerName: string;
  description: string;
  status: 'open' | 'in_arbitration' | 'resolved';
  arbitrators: Array<{
    id: string;
    name: string;
    region: string;
    vote?: 'requester' | 'worker' | 'abstain';
  }>;
  resolution?: 'requester' | 'worker' | 'split';
  createdAt: Date;
  resolvedAt?: Date;
}

interface DisputeArbitrationProps {
  dispute: DisputeCase;
  currentUserId: string;
  isArbitrator?: boolean;
  onVote?: (vote: 'requester' | 'worker' | 'abstain') => void;
  className?: string;
}

export function DisputeArbitration({
  dispute,
  currentUserId,
  isArbitrator = false,
  onVote,
  className = '',
}: DisputeArbitrationProps) {
  const [userVote, setUserVote] = useState<'requester' | 'worker' | 'abstain' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (vote: 'requester' | 'worker' | 'abstain') => {
    setIsSubmitting(true);
    try {
      setUserVote(vote);
      console.log('[v0] Arbitrator vote submitted:', { disputeId: dispute.id, vote });

      if (onVote) {
        onVote(vote);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const requesterVotes = dispute.arbitrators.filter(a => a.vote === 'requester').length;
  const workerVotes = dispute.arbitrators.filter(a => a.vote === 'worker').length;
  const abstainVotes = dispute.arbitrators.filter(a => a.vote === 'abstain').length;
  const totalVotes = requesterVotes + workerVotes + abstainVotes;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-orange-500';
      case 'in_arbitration':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`bg-card border-border p-5 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-foreground">Dispute Resolution</h3>
            <p className={`text-sm font-semibold ${getStatusColor(dispute.status)} mt-1`}>
              {dispute.status.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Job #{dispute.jobId}</p>
      </div>

      {/* Parties */}
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-background border border-border">
          <p className="text-xs text-muted-foreground mb-1">Requester</p>
          <p className="font-semibold text-foreground">{dispute.requesterName}</p>
        </div>

        <div className="flex items-center justify-center">
          <Scale className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="p-3 rounded-lg bg-background border border-border">
          <p className="text-xs text-muted-foreground mb-1">Worker</p>
          <p className="font-semibold text-foreground">{dispute.workerName}</p>
        </div>
      </div>

      {/* Description */}
      <div className="p-3 rounded-lg bg-secondary border border-border">
        <p className="text-xs text-muted-foreground mb-1">Dispute Reason</p>
        <p className="text-sm text-foreground">{dispute.description}</p>
      </div>

      {/* Arbitrators */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Arbitrators ({totalVotes}/{dispute.arbitrators.length})</p>
        <div className="space-y-1">
          {dispute.arbitrators.map(arbitrator => (
            <div key={arbitrator.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent">{arbitrator.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{arbitrator.name}</p>
                <p className="text-xs text-muted-foreground">{arbitrator.region}</p>
              </div>
              {arbitrator.vote && (
                <div className="flex items-center gap-1">
                  {arbitrator.vote === 'requester' && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {arbitrator.vote === 'worker' && (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {arbitrator.vote === 'abstain' && (
                    <Vote className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Voting Results */}
      {totalVotes > 0 && (
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-green-500">{requesterVotes}</p>
            <p className="text-xs text-muted-foreground">For Requester</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{workerVotes}</p>
            <p className="text-xs text-muted-foreground">For Worker</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-500">{abstainVotes}</p>
            <p className="text-xs text-muted-foreground">Abstain</p>
          </div>
        </div>
      )}

      {/* Resolution */}
      {dispute.resolution && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-muted-foreground mb-1">Resolution</p>
          <p className="font-semibold text-accent">
            Resolved in favor of <strong>{dispute.resolution === 'split' ? 'Both Parties (Split)' : dispute.resolution === 'requester' ? dispute.requesterName : dispute.workerName}</strong>
          </p>
          {dispute.resolvedAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Resolved {new Date(dispute.resolvedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Arbitrator Voting Section */}
      {isArbitrator && dispute.status === 'in_arbitration' && !userVote && (
        <div className="space-y-2 p-3 rounded-lg bg-secondary border border-border">
          <p className="text-xs font-semibold text-foreground">Your Vote</p>
          <div className="space-y-2">
            <Button
              onClick={() => handleVote('requester')}
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-green-500/20 hover:bg-green-500/10 text-green-500 justify-start"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Vote for {dispute.requesterName}
            </Button>
            <Button
              onClick={() => handleVote('worker')}
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-red-500/20 hover:bg-red-500/10 text-red-500 justify-start"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Vote for {dispute.workerName}
            </Button>
            <Button
              onClick={() => handleVote('abstain')}
              disabled={isSubmitting}
              variant="outline"
              className="w-full border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 justify-start"
            >
              <Vote className="w-4 h-4 mr-2" />
              Abstain
            </Button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="space-y-1 pt-2 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground">How Arbitration Works:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Arbitrators selected from different regions</li>
          <li>• Majority vote determines resolution</li>
          <li>• Fair and transparent process</li>
          <li>• Cannot involve connected users</li>
        </ul>
      </div>
    </Card>
  );
}
