'use client';

import { useState } from 'react';
import { PiworkButton } from '@/components/piwork-button';
import { PiPaymentService } from '@/lib/pi-sdk-service';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePiConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize Pi SDK
      PiPaymentService.initializePi();

      // Authenticate with Pi
      const user = await PiPaymentService.authenticateUser();

      if (!user) {
        throw new Error('Authentication failed');
      }

      // Store user info and redirect
      localStorage.setItem('piUser', JSON.stringify(user));

      if (user.payments_enabled) {
        window.location.href = '/feed';
      } else {
        window.location.href = '/kyc';
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect with Pi Network'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        padding: PIWORK_THEME.spacing.lg,
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 64,
        }}
      >
        <div
          style={{
            fontSize: 64,
            marginBottom: PIWORK_THEME.spacing.md,
          }}
        >
          π
        </div>
        <h1
          style={{
            fontSize: PIWORK_THEME.typography.h1.fontSize,
            fontWeight: 700,
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.sm,
            textAlign: 'center',
          }}
        >
          PiWork
        </h1>
        <p
          style={{
            fontSize: PIWORK_THEME.typography.small.fontSize,
            color: PIWORK_THEME.colors.textSecondary,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Earn Pi with your skills
        </p>
      </div>

      {/* Connect Button */}
      <div style={{ width: '100%', maxWidth: 400, marginBottom: 24 }}>
        <div
          style={{
            height: 56,
          }}
        >
          <PiworkButton
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handlePiConnect}
            fullWidth={true}
          >
            Connect with Pi
          </PiworkButton>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            padding: PIWORK_THEME.spacing.md,
            borderRadius: PIWORK_THEME.radius.lg,
            marginBottom: PIWORK_THEME.spacing.md,
            fontSize: PIWORK_THEME.typography.small.fontSize,
          }}
        >
          {error}
        </div>
      )}

      {/* Info Text */}
      <p
        style={{
          fontSize: 12,
          color: PIWORK_THEME.colors.textSecondary,
          textAlign: 'center',
          margin: 0,
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        Requires Pi Browser and KYC verification
      </p>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 64,
          maxWidth: 400,
          padding: PIWORK_THEME.spacing.md,
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderRadius: PIWORK_THEME.radius.lg,
          border: `1px solid ${PIWORK_THEME.colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.sm,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          How it works
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            fontSize: PIWORK_THEME.typography.small.fontSize,
            color: PIWORK_THEME.colors.textSecondary,
            lineHeight: 1.8,
          }}
        >
          <li>Download Pi Network app</li>
          <li>Complete KYC verification</li>
          <li>Connect to PiWork</li>
          <li>Start earning Pi</li>
        </ul>
      </div>
    </div>
  );
}
