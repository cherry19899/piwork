'use client';

import React from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PiworkButton } from './piwork-button';

interface ErrorStateProps {
  type: 'no-connection' | 'server-error' | 'empty-feed' | 'payment-error';
  errorCode?: string;
  onRetry?: () => void;
  onCreateTask?: () => void;
}

export function ErrorState({
  type,
  errorCode,
  onRetry,
  onCreateTask,
}: ErrorStateProps) {
  const configs = {
    'no-connection': {
      icon: '📡',
      title: 'No Connection',
      message: 'Check your internet connection and try again',
      buttonText: 'Retry',
      action: onRetry,
    },
    'server-error': {
      icon: '⚠️',
      title: 'Something Went Wrong',
      message: `Server error occurred. ${errorCode ? `Code: ${errorCode}` : ''}`,
      buttonText: 'Retry',
      action: onRetry,
    },
    'empty-feed': {
      icon: '🔍',
      title: 'No Tasks Yet',
      message: 'Be the first to create a task and start earning!',
      buttonText: 'Create First Task',
      action: onCreateTask,
    },
    'payment-error': {
      icon: '❌',
      title: 'Payment Failed',
      message: 'Your payment could not be processed. Please try again.',
      buttonText: 'Retry Payment',
      action: onRetry,
    },
  };

  const config = configs[type];

  if (type === 'payment-error') {
    return (
      <div
        style={{
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          padding: `${PIWORK_THEME.spacing.md}px`,
          borderRadius: PIWORK_THEME.radius.lg,
          marginBottom: PIWORK_THEME.spacing.lg,
          textAlign: 'center',
          fontSize: 14,
        }}
      >
        {config.message}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        border: `1px solid ${PIWORK_THEME.colors.border}`,
        borderRadius: PIWORK_THEME.radius.lg,
        padding: PIWORK_THEME.spacing.lg,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: PIWORK_THEME.spacing.lg,
        }}
      >
        {config.icon}
      </div>

      <h2
        style={{
          fontSize: PIWORK_THEME.typography.h2.fontSize,
          fontWeight: 700,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.sm,
          color: PIWORK_THEME.colors.textPrimary,
        }}
      >
        {config.title}
      </h2>

      <p
        style={{
          fontSize: PIWORK_THEME.typography.body.fontSize,
          color: PIWORK_THEME.colors.textSecondary,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.lg,
          maxWidth: 280,
        }}
      >
        {config.message}
      </p>

      {errorCode && type === 'server-error' && (
        <p
          style={{
            fontSize: PIWORK_THEME.typography.small.fontSize,
            color: PIWORK_THEME.colors.textSecondary,
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.lg,
          }}
        >
          Error Code: {errorCode}
        </p>
      )}

      {config.action && (
        <div style={{ width: '100%', maxWidth: 200 }}>
          <PiworkButton
            variant="primary"
            fullWidth={true}
            onClick={config.action}
          >
            {config.buttonText}
          </PiworkButton>
        </div>
      )}
    </div>
  );
}
