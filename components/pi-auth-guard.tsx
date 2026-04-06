'use client';

import React, { useEffect, useState } from 'react';
import { PiPaymentService, PiUser } from '@/lib/pi-sdk-service';

interface PiAuthGuardProps {
  children: React.ReactNode;
  onAuthChange?: (user: PiUser | null) => void;
  requirePayments?: boolean;
}

export const PiAuthGuard: React.FC<PiAuthGuardProps> = ({
  children,
  onAuthChange,
  requirePayments = false,
}) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticateAndValidate = async () => {
      try {
        setLoading(true);
        setError(null);

        const authenticatedUser = await PiPaymentService.authenticateUser();

        if (!authenticatedUser) {
          setError('Failed to authenticate with Pi Network');
          setUser(null);
          onAuthChange?.(null);
          return;
        }

        // Check if payments are enabled when required
        if (requirePayments && !authenticatedUser.payments_enabled) {
          setError(
            'Payment verification required. Please complete KYC verification to create jobs.'
          );
          setUser(authenticatedUser);
          onAuthChange?.(authenticatedUser);
          return;
        }

        setUser(authenticatedUser);
        onAuthChange?.(authenticatedUser);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
        setUser(null);
        onAuthChange?.(null);
      } finally {
        setLoading(false);
      }
    };

    authenticateAndValidate();
  }, [requirePayments, onAuthChange]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Connecting to Pi Network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <h2 className="mb-2 font-semibold text-destructive">Authentication Error</h2>
          <p className="mb-4 text-sm text-muted-foreground">{error}</p>

          {!user?.payments_enabled && user && (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium">Need KYC Verification?</p>
              <a
                href="/kyc-guide"
                className="inline-block rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Complete KYC Verification
              </a>
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="mt-3 w-full rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to establish Pi Network connection</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface CreateJobButtonProps {
  onPaymentsDisabled?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const CreateJobButton: React.FC<CreateJobButtonProps> = ({
  onPaymentsDisabled,
  disabled = false,
  children,
}) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [showKYCWarning, setShowKYCWarning] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const authenticatedUser = await PiPaymentService.authenticateUser();
      setUser(authenticatedUser);

      if (authenticatedUser && !authenticatedUser.payments_enabled) {
        onPaymentsDisabled?.();
      }
    };

    checkPaymentStatus();
  }, [onPaymentsDisabled]);

  const isDisabled = disabled || !user?.payments_enabled;

  const handleClick = () => {
    if (!user?.payments_enabled) {
      setShowKYCWarning(true);
      return;
    }
    // Trigger parent click handler
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        title={
          !user?.payments_enabled
            ? 'Complete KYC verification to create jobs'
            : 'Create a new job'
        }
      >
        {children}
      </button>

      {showKYCWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-lg bg-background p-6">
            <h3 className="mb-2 font-semibold">KYC Verification Required</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              To create jobs and accept payments, you need to complete KYC verification first.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowKYCWarning(false)}
                className="flex-1 rounded border border-input px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Close
              </button>
              <a
                href="/kyc-guide"
                className="flex-1 rounded bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Start Verification
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
