'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { useOffline } from '@/lib/offline-context';

export interface ConflictItem {
  id: string;
  type: 'message' | 'task' | 'profile';
  localData: any;
  remoteData: any;
  timestamp: Date;
}

interface ConflictResolutionModalProps {
  conflicts: ConflictItem[];
  onResolve: (id: string, choice: 'local' | 'remote') => void;
  onDismiss: () => void;
}

export function ConflictResolutionModal({
  conflicts,
  onResolve,
  onDismiss,
}: ConflictResolutionModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (conflicts.length === 0) return null;

  const current = conflicts[currentIndex];

  const getConflictDisplay = (data: any, type: string) => {
    if (type === 'message') {
      return `"${data.text}"`;
    } else if (type === 'task') {
      return `${data.title} • π${data.budget}`;
    } else if (type === 'profile') {
      return `${data.field}: ${data.value}`;
    }
    return JSON.stringify(data);
  };

  const handleResolve = (choice: 'local' | 'remote') => {
    onResolve(current.id, choice);

    if (currentIndex < conflicts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderRadius: 16,
          padding: 24,
          maxWidth: 360,
          border: `1px solid ${PIWORK_THEME.colors.border}`,
          animation: 'scaleIn 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Conflicting Changes
        </h3>

        <p
          style={{
            fontSize: 14,
            color: PIWORK_THEME.colors.textSecondary,
            margin: 0,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Your {current.type} was changed on another device. Which version would you like to keep?
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Local Version */}
          <button
            onClick={() => handleResolve('local')}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${PIWORK_THEME.colors.primary}`,
              borderRadius: 12,
              padding: 12,
              color: PIWORK_THEME.colors.textPrimary,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = `${PIWORK_THEME.colors.primary}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>YOUR CHANGES</div>
            <div
              style={{
                fontSize: 12,
                color: PIWORK_THEME.colors.textSecondary,
                wordBreak: 'break-word',
              }}
            >
              {getConflictDisplay(current.localData, current.type)}
            </div>
          </button>

          {/* Remote Version */}
          <button
            onClick={() => handleResolve('remote')}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${PIWORK_THEME.colors.textSecondary}`,
              borderRadius: 12,
              padding: 12,
              color: PIWORK_THEME.colors.textPrimary,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                PIWORK_THEME.colors.primary;
              (e.currentTarget as HTMLElement).style.backgroundColor = `${PIWORK_THEME.colors.primary}20`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                PIWORK_THEME.colors.textSecondary;
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>CLOUD VERSION</div>
            <div
              style={{
                fontSize: 12,
                color: PIWORK_THEME.colors.textSecondary,
                wordBreak: 'break-word',
              }}
            >
              {getConflictDisplay(current.remoteData, current.type)}
            </div>
          </button>
        </div>

        {/* Progress */}
        <div
          style={{
            fontSize: 12,
            color: PIWORK_THEME.colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {currentIndex + 1} of {conflicts.length}
        </div>
      </div>
    </div>
  );
}
