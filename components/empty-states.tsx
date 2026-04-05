'use client';

import React from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PiworkButton } from './piwork-button';

interface EmptyStateProps {
  type: 'tasks' | 'messages' | 'earnings';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    tasks: {
      icon: '📦',
      title: 'No tasks match filters',
      description: 'Try adjusting your search or filters to find more opportunities.',
      buttonText: 'Clear filters',
      buttonAction: onAction,
    },
    messages: {
      icon: '💬',
      title: 'Start conversation',
      description: 'Browse tasks and connect with other freelancers.',
      buttonText: 'Browse tasks',
      buttonAction: onAction,
    },
    earnings: {
      icon: '📈',
      title: 'Complete your first task',
      description: 'Earn Pi by completing tasks from the community.',
      buttonText: 'Find work',
      buttonAction: onAction,
    },
  };

  const config = configs[type];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${PIWORK_THEME.spacing.xl}px ${PIWORK_THEME.spacing.lg}px`,
        textAlign: 'center',
        minHeight: 300,
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        borderRadius: PIWORK_THEME.radius.lg,
      }}
    >
      {/* Illustration - SVG-based purple graphic */}
      <div
        style={{
          width: 120,
          height: 120,
          marginBottom: PIWORK_THEME.spacing.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 80,
        }}
      >
        {type === 'tasks' && (
          <svg
            viewBox="0 0 120 120"
            style={{ width: '100%', height: '100%' }}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
          >
            <rect x="20" y="20" width="80" height="80" rx="8" />
            <line x1="40" y1="40" x2="80" y1="40" />
            <line x1="40" y1="55" x2="80" y1="55" />
            <line x1="40" y1="70" x2="80" y1="70" />
            <circle cx="30" cy="40" r="3" fill="#8B5CF6" />
            <circle cx="30" cy="55" r="3" fill="#8B5CF6" />
            <circle cx="30" cy="70" r="3" fill="#8B5CF6" />
          </svg>
        )}

        {type === 'messages' && (
          <svg
            viewBox="0 0 120 120"
            style={{ width: '100%', height: '100%' }}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
          >
            <path d="M 20 40 Q 20 20 40 20 L 100 20 Q 110 20 110 30 L 110 70 Q 110 80 100 80 L 50 80 L 30 100 L 40 80 L 40 80 Q 30 80 20 70 Z" />
            <line x1="40" y1="40" x2="55" y1="40" strokeLinecap="round" />
            <line x1="40" y1="55" x2="90" y1="55" strokeLinecap="round" />
          </svg>
        )}

        {type === 'earnings' && (
          <svg
            viewBox="0 0 120 120"
            style={{ width: '100%', height: '100%' }}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
          >
            <polyline points="20,100 40,60 60,80 100,20" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40" cy="60" r="4" fill="#8B5CF6" />
            <circle cx="60" cy="80" r="4" fill="#8B5CF6" />
            <circle cx="100" cy="20" r="4" fill="#8B5CF6" />
            <line x1="20" y1="100" x2="100" y2="100" strokeDasharray="4,4" />
          </svg>
        )}
      </div>

      {/* Content */}
      <h3
        style={{
          fontSize: PIWORK_THEME.typography.h2.fontSize,
          fontWeight: 700,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.md,
          color: PIWORK_THEME.colors.textPrimary,
        }}
      >
        {config.title}
      </h3>

      <p
        style={{
          fontSize: PIWORK_THEME.typography.body.fontSize,
          color: PIWORK_THEME.colors.textSecondary,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.lg,
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        {config.description}
      </p>

      {/* Action Button */}
      <PiworkButton
        onClick={config.buttonAction}
        variant="primary"
        fullWidth={false}
      >
        {config.buttonText}
      </PiworkButton>
    </div>
  );
}
