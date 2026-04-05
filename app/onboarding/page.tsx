'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { AccessibleButton } from '@/components/ui/accessible-button';

type OnboardingStep = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);

  const handleSkip = () => {
    router.push('/feed');
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    } else {
      router.push('/feed');
    }
  };

  const handleConnect = () => {
    router.push('/feed');
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: PIWORK_THEME.colors.bgPrimary,
    color: PIWORK_THEME.colors.textPrimary,
    padding: PIWORK_THEME.spacing.lg,
    justifyContent: 'space-between',
    position: 'relative',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    gap: PIWORK_THEME.spacing.xl,
  };

  const skipButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: PIWORK_THEME.spacing.md,
    right: PIWORK_THEME.spacing.md,
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: 'none',
    color: PIWORK_THEME.colors.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 8,
    animation: 'slideInRight 300ms ease-out',
  };

  const dotsContainerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: PIWORK_THEME.spacing.xl,
  };

  const dotStyles = (isActive: boolean): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: isActive ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
    cursor: 'pointer',
    transition: 'all 200ms ease',
    animation: 'scaleIn 200ms ease-out',
  });

  return (
    <div style={containerStyles}>
      <button
        onClick={handleSkip}
        style={skipButtonStyles}
        aria-label="Skip onboarding tutorial"
      >
        Skip
      </button>

      <main style={contentStyles}>
        {/* Step 1: Earn Pi */}
        {currentStep === 1 && (
          <div style={{ animation: 'fadeIn 300ms ease-out' }}>
            <div
              style={{
                fontSize: 80,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
              aria-hidden="true"
            >
              💼
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            >
              Earn Pi with your skills
            </h1>
            <p
              style={{
                fontSize: 16,
                color: PIWORK_THEME.colors.textSecondary,
                maxWidth: 300,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Complete tasks from global clients and earn Pi cryptocurrency. No banking required.
            </p>
          </div>
        )}

        {/* Step 2: Safe Payments */}
        {currentStep === 2 && (
          <div style={{ animation: 'fadeIn 300ms ease-out' }}>
            <div
              style={{
                fontSize: 80,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
              aria-hidden="true"
            >
              🛡️
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            >
              Safe payments
            </h1>
            <p
              style={{
                fontSize: 16,
                color: PIWORK_THEME.colors.textSecondary,
                maxWidth: 300,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Money is blocked until the job is completed. Your work is always protected.
            </p>
          </div>
        )}

        {/* Step 3: Global Community */}
        {currentStep === 3 && (
          <div style={{ animation: 'fadeIn 300ms ease-out' }}>
            <div
              style={{
                fontSize: 80,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
              aria-hidden="true"
            >
              🌍
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            >
              Global community
            </h1>
            <p
              style={{
                fontSize: 16,
                color: PIWORK_THEME.colors.textSecondary,
                maxWidth: 300,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Connect with thousands of clients and workers worldwide. Work without borders.
            </p>
          </div>
        )}

        {/* Step 4: Connect Pi */}
        {currentStep === 4 && (
          <div style={{ animation: 'fadeIn 300ms ease-out' }}>
            <div
              style={{
                fontSize: 80,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
              aria-hidden="true"
            >
              π
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            >
              Connect Pi Wallet
            </h1>
            <p
              style={{
                fontSize: 16,
                color: PIWORK_THEME.colors.textSecondary,
                maxWidth: 300,
                lineHeight: 1.6,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
            >
              Link your Pi Network wallet to start earning and receiving payments.
            </p>
          </div>
        )}
      </main>

      {/* Dots Navigation */}
      <div style={dotsContainerStyles} role="tablist" aria-label="Onboarding step indicators">
        {[1, 2, 3, 4].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(step as OnboardingStep)}
            style={dotStyles(currentStep === step)}
            role="tab"
            aria-selected={currentStep === step}
            aria-label={`Go to step ${step}`}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: PIWORK_THEME.spacing.md,
          width: '100%',
          maxWidth: 400,
          animation: 'slideUp 300ms ease-out',
        }}
      >
        {currentStep > 1 && (
          <AccessibleButton
            variant="secondary"
            fullWidth
            onClick={handlePrevious}
            ariaLabel="Go to previous step"
          >
            Previous
          </AccessibleButton>
        )}

        {currentStep < 4 ? (
          <AccessibleButton
            variant="primary"
            fullWidth={currentStep === 1}
            onClick={handleNext}
            ariaLabel={`Go to step ${currentStep + 1}`}
          >
            Next
          </AccessibleButton>
        ) : (
          <AccessibleButton
            variant="primary"
            fullWidth
            onClick={handleConnect}
            ariaLabel="Start using PiWork with connected Pi Wallet"
          >
            Connect Pi & Start
          </AccessibleButton>
        )}
      </div>
    </div>
  );
}
