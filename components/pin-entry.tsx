'use client';

import { useState, useRef, useEffect } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface PINEntryProps {
  onSuccess: (pin: string) => void;
  onForgot?: () => void;
  title?: string;
  subtitle?: string;
}

export function PINEntry({ onSuccess, onForgot, title = 'Enter PIN', subtitle = 'Enter your 4-digit PIN' }: PINEntryProps) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      setPin(pin.slice(0, -1));
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault();
      if (pin.length < 4) {
        const newPin = pin + e.key;
        setPin(newPin);

        if (newPin.length === 4) {
          validatePIN(newPin);
        }
      }
    }
  };

  const validatePIN = (enteredPin: string) => {
    // Simulated PIN verification (should be replaced with backend)
    const correctPin = '1234';
    
    if (enteredPin === correctPin) {
      onSuccess(enteredPin);
    } else {
      triggerError();
    }
  };

  const triggerError = () => {
    setIsError(true);
    setIsShaking(true);

    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Reset error state after 1 second
    setTimeout(() => {
      setIsError(false);
    }, 1000);

    // Reset shaking animation
    setTimeout(() => {
      setIsShaking(false);
    }, 500);

    // Clear PIN
    setPin('');
    inputRef.current?.focus();
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
        padding: PIWORK_THEME.spacing.lg,
      }}
    >
      <h1
        style={{
          fontSize: PIWORK_THEME.typography.h1.fontSize,
          fontWeight: 700,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.md,
          textAlign: 'center',
        }}
      >
        {title}
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
        {subtitle}
      </p>

      {/* Hidden input for capturing keystrokes */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={0}
        onKeyDown={handleKeyDown}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-label="PIN entry input"
      />

      {/* PIN Dots Display */}
      <div
        style={{
          display: 'flex',
          gap: PIWORK_THEME.spacing.lg,
          marginBottom: PIWORK_THEME.spacing.xl,
          animation: isShaking ? 'shake 0.5s ease-in-out' : 'none',
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: isError
                ? '#EF4444'
                : index < pin.length
                  ? PIWORK_THEME.colors.primary
                  : PIWORK_THEME.colors.bgSecondary,
              border: `2px solid ${
                isError ? '#EF4444' : PIWORK_THEME.colors.border
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease',
              fontSize: 24,
            }}
          >
            {index < pin.length && '●'}
          </div>
        ))}
      </div>

      {/* Numeric Keypad */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: PIWORK_THEME.spacing.md,
          marginBottom: PIWORK_THEME.spacing.xl,
          maxWidth: 300,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => {
              if (pin.length < 4) {
                const newPin = pin + (i + 1);
                setPin(newPin);
                if (newPin.length === 4) {
                  validatePIN(newPin);
                }
              }
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: PIWORK_THEME.radius.lg,
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              color: PIWORK_THEME.colors.textPrimary,
              fontSize: 24,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                PIWORK_THEME.colors.primary;
              (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                PIWORK_THEME.colors.bgSecondary;
              (e.currentTarget as HTMLElement).style.color =
                PIWORK_THEME.colors.textPrimary;
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
            aria-label={`Number ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 0 and Backspace */}
      <div
        style={{
          display: 'flex',
          gap: PIWORK_THEME.spacing.md,
          marginBottom: PIWORK_THEME.spacing.xl,
          width: '100%',
          maxWidth: 300,
        }}
      >
        <button
          onClick={() => {
            if (pin.length < 4) {
              const newPin = pin + '0';
              setPin(newPin);
              if (newPin.length === 4) {
                validatePIN(newPin);
              }
            }
          }}
          style={{
            flex: 1,
            height: 70,
            borderRadius: PIWORK_THEME.radius.lg,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            color: PIWORK_THEME.colors.textPrimary,
            fontSize: 24,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              PIWORK_THEME.colors.primary;
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              PIWORK_THEME.colors.bgSecondary;
            (e.currentTarget as HTMLElement).style.color =
              PIWORK_THEME.colors.textPrimary;
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
          aria-label="Number 0"
        >
          0
        </button>

        <button
          onClick={() => setPin(pin.slice(0, -1))}
          style={{
            flex: 1,
            height: 70,
            borderRadius: PIWORK_THEME.radius.lg,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            color: PIWORK_THEME.colors.textPrimary,
            fontSize: 20,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              PIWORK_THEME.colors.primary;
            (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              PIWORK_THEME.colors.bgSecondary;
            (e.currentTarget as HTMLElement).style.color =
              PIWORK_THEME.colors.textPrimary;
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>

      {/* Forgot PIN Link */}
      {onForgot && (
        <button
          onClick={onForgot}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.primary,
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Forgot PIN?
        </button>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
