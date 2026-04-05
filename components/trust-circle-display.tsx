'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, CheckCircle2, Link2 } from 'lucide-react';
import { useState } from 'react';

export interface TrustCircleMember {
  id: string;
  name: string;
  reputation: number;
  trustLevel: 'friend' | 'friend_of_friend' | 'verified';
  mutualConnections: number;
  joinedAt: Date;
}

interface TrustCircleDisplayProps {
  members: TrustCircleMember[];
  currentUserId: string;
  onAddConnection?: (userId: string) => void;
  className?: string;
}

export function TrustCircleDisplay({
  members,
  currentUserId,
  onAddConnection,
  className = '',
}: TrustCircleDisplayProps) {
  const [showAll, setShowAll] = useState(false);

  const getTrustLevelColor = (level: string): string => {
    switch (level) {
      case 'friend':
        return 'text-green-500';
      case 'friend_of_friend':
        return 'text-blue-500';
      case 'verified':
        return 'text-amber-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrustLevelLabel = (level: string): string => {
    switch (level) {
      case 'friend':
        return 'Direct Friend';
      case 'friend_of_friend':
        return 'Friend of Friend';
      case 'verified':
        return 'Verified Member';
      default:
        return 'Connected';
    }
  };

  const directFriends = members.filter(m => m.trustLevel === 'friend');
  const friendsOfFriends = members.filter(m => m.trustLevel === 'friend_of_friend');
  const verifiedMembers = members.filter(m => m.trustLevel === 'verified');

  const displayedMembers = showAll ? members : members.slice(0, 5);
  const hiddenCount = Math.max(0, members.length - 5);

  return (
    <Card className={`bg-secondary border-border p-4 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Trust Circle</h3>
        </div>
        <span className="text-sm font-bold text-accent">{members.length} members</span>
      </div>

      {/* Circle Stats */}
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
        <div className="text-center">
          <p className="text-lg font-bold text-green-500">{directFriends.length}</p>
          <p className="text-xs text-muted-foreground">Direct Friends</p>
        </div>
        <div className="text-center border-l border-r border-border">
          <p className="text-lg font-bold text-blue-500">{friendsOfFriends.length}</p>
          <p className="text-xs text-muted-foreground">2nd Degree</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-500">{verifiedMembers.length}</p>
          <p className="text-xs text-muted-foreground">Verified</p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {displayedMembers.length === 0 ? (
          <div className="text-center py-6">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No connections yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start by connecting with friends on Piwork
            </p>
          </div>
        ) : (
          displayedMembers.map(member => (
            <div key={member.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent">{member.name[0]}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{member.name}</p>
                  {member.trustLevel === 'verified' && (
                    <CheckCircle2 className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium ${getTrustLevelColor(member.trustLevel)}`}>
                    {getTrustLevelLabel(member.trustLevel)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.reputation.toFixed(1)} ⭐
                  </p>
                </div>

                {member.mutualConnections > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    {member.mutualConnections} mutual {member.mutualConnections === 1 ? 'connection' : 'connections'}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Show More */}
      {hiddenCount > 0 && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full border-border hover:bg-card text-foreground"
        >
          Show {hiddenCount} more members
        </Button>
      )}

      {showAll && hiddenCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(false)}
          className="w-full border-border hover:bg-card text-foreground"
        >
          Show less
        </Button>
      )}

      {/* Add Connection */}
      {onAddConnection && (
        <Button
          onClick={() => onAddConnection(currentUserId)}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite to Circle
        </Button>
      )}

      {/* Info */}
      <div className="space-y-1 pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium">How Trust Circles Work:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Earn trust by completing jobs and getting rated</li>
          <li>• Direct friends see your verified status</li>
          <li>• Arbitrators chosen from different circles for fairness</li>
          <li>• Can&apos;t manipulate reputation through circles</li>
        </ul>
      </div>
    </Card>
  );
}
