'use client';

import { useState, useEffect } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PINEntry } from './pin-entry';

interface BiometricAuthProps {
  onSuccess: () => void;
  userName?: string;
}

export function BiometricAuth({ onSuccess, userName = 'User' }: BiometricAuthProps) {
  const [authMethod, setAuthMethod] = useState<'biometric' | 'pin' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supportedMethods, setSupportedMethods] = useState<{
    faceId: boolean;
    fingerprint: boolean;
  }>({ faceId: false, fingerprint: false });
  const [isAttempting, setIsAttempting] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check WebAuthn support
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available) {
          setSupportedMethods({
            faceId: true,
            fingerprint: true,
          });
        }
      }
    } catch (error) {
      console.error('Biometric support check failed:', error);
    }
  };

  const handleBiometricAuth = async (type: 'faceId' | 'fingerprint') => {
    setIsAttempting(true);

    try {
      // Simulated biometric authentication
      // In production, use WebAuthn API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate 90% success rate for demo
      if (Math.random() > 0.1) {
        setIsAuthenticated(true);
        setTimeout(() => onSuccess(), 500);
      } else {
        setIsAttempting(false);
        alert('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      setIsAttempting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  if (authMethod === 'pin') {
    return (
      <PINEntry
        onSuccess={() => {
          setIsAuthenticated(true);
          setTimeout(() => onSuccess(), 500);
        }}
        onForgot={() => setAuthMethod('biometric')}
        title="Enter PIN"
        subtitle="Authentication required"
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        padding: PIWORK_THEME.spacing.lg,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: PIWORK_THEME.colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          marginBottom: PIWORK_THEME.spacing.lg,
        }}
      >
        👤
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
        Welcome back, {userName}
      </h1>

      <p
        style={{
          fontSize: PIWORK_THEME.typography.body.fontSize,
          color: PIWORK_THEME.colors.textSecondary,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.xl,
          textAlign: 'center',
        }}
      >
        Unlock your account
      </p>

      {/* Biometric Options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: PIWORK_THEME.spacing.md,
          width: '100%',
          maxWidth: 320,
          marginBottom: PIWORK_THEME.spacing.xl,
        }}
      >
        {supportedMethods.faceId && (
          <button
            onClick={() => handleBiometricAuth('faceId')}
            disabled={isAttempting}
            style={{
              padding: `${PIWORK_THEME.spacing.lg}px`,
              borderRadius: PIWORK_THEME.radius.lg,
              backgroundColor: PIWORK_THEME.colors.primary,
              color: '#FFFFFF',
              border: 'none',
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: 600,
              cursor: isAttempting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: PIWORK_THEME.spacing.md,
              opacity: isAttempting ? 0.7 : 1,
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isAttempting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#7C3AED';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                PIWORK_THEME.colors.primary;
            }}
            aria-label="Authenticate with Face ID"
          >
            <span style={{ fontSize: 24 }}>👁️</span>
            {isAttempting ? 'Scanning...' : 'Face ID'}
          </button>
        )}

        {supportedMethods.fingerprint && (
          <button
            onClick={() => handleBiometricAuth('fingerprint')}
            disabled={isAttempting}
            style={{
              padding: `${PIWORK_THEME.spacing.lg}px`,
              borderRadius: PIWORK_THEME.radius.lg,
              backgroundColor: PIWORK_THEME.colors.primary,
              color: '#FFFFFF',
              border: 'none',
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: 600,
              cursor: isAttempting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: PIWORK_THEME.spacing.md,
              opacity: isAttempting ? 0.7 : 1,
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isAttempting) {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#7C3AED';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                PIWORK_THEME.colors.primary;
            }}
            aria-label="Authenticate with fingerprint"
          >
            <span style={{ fontSize: 24 }}>👆</span>
            {isAttempting ? 'Scanning...' : 'Fingerprint'}
          </button>
        )}

        {/* Fallback to PIN */}
        <button
          onClick={() => setAuthMethod('pin')}
          disabled={isAttempting}
          style={{
            padding: `${PIWORK_THEME.spacing.lg}px`,
            borderRadius: PIWORK_THEME.radius.lg,
            backgroundColor: 'transparent',
            color: PIWORK_THEME.colors.primary,
            border: `2px solid ${PIWORK_THEME.colors.primary}`,
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: PIWORK_THEME.spacing.md,
            transition: 'all 200ms ease',
            opacity: isAttempting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isAttempting) {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                `${PIWORK_THEME.colors.primary}10`;
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
          aria-label="Use PIN instead"
        >
          <span style={{ fontSize: 24 }}>🔐</span>
          Use PIN
        </button>
      </div>

      {/* Help Text */}
      <p
        style={{
          fontSize: PIWORK_THEME.typography.small.fontSize,
          color: PIWORK_THEME.colors.textSecondary,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {supportedMethods.faceId || supportedMethods.fingerprint
          ? 'Biometric authentication failed? Use your PIN instead.'
          : 'Biometric authentication not available on this device.'}
      </p>
    </div>
  );
}
