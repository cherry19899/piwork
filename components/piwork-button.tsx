'use client';

import React, { ReactNode } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { Spinner } from './spinner';

interface PiworkButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
}

export function PiworkButton({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = true,
  className = '',
}: PiworkButtonProps) {
  const isDisabled = disabled || isLoading;

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms ease',
    width: fullWidth ? '100%' : 'auto',
    minWidth: fullWidth ? 'unset' : 120,
    paddingLeft: fullWidth ? 'unset' : 24,
    paddingRight: fullWidth ? 'unset' : 24,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  let variantStyles: React.CSSProperties = {};

  if (isDisabled) {
    variantStyles = {
      backgroundColor: '#404040',
      color: PIWORK_THEME.colors.textSecondary,
      opacity: 0.6,
    };
  } else if (variant === 'primary') {
    variantStyles = {
      backgroundColor: PIWORK_THEME.colors.primary,
      color: '#FFFFFF',
    };
  } else if (variant === 'secondary') {
    variantStyles = {
      backgroundColor: 'transparent',
      color: PIWORK_THEME.colors.primary,
      border: `2px solid ${PIWORK_THEME.colors.primary}`,
    };
  }

  const hoverStyles: React.CSSProperties = isDisabled
    ? {}
    : variant === 'primary'
      ? {
          backgroundColor: '#7C3AED',
          boxShadow: `0 4px 12px ${PIWORK_THEME.colors.primary}40`,
        }
      : {
          backgroundColor: `${PIWORK_THEME.colors.primary}10`,
        };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles,
      }}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          Object.assign((e.currentTarget as HTMLElement).style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        Object.assign((e.currentTarget as HTMLElement).style, {
          backgroundColor:
            variant === 'primary'
              ? PIWORK_THEME.colors.primary
              : variant === 'secondary'
                ? 'transparent'
                : '#404040',
          boxShadow: 'none',
        });
      }}
      onMouseDown={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
        }
      }}
      onMouseUp={(e) => {
        if (!isDisabled) {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }
      }}
      className={className}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : children}
    </button>
  );
}
