'use client';

import React, { ReactNode, useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { Spinner } from './spinner';

interface AccessibleButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AccessibleButton({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = true,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  size = 'md',
}: AccessibleButtonProps) {
  const isDisabled = disabled || isLoading;
  const [isFocused, setIsFocused] = useState(false);

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { height: 40, fontSize: 12, minWidth: 80 },
    md: { height: 48, fontSize: 14, minWidth: 120 },
    lg: { height: 56, fontSize: 16, minWidth: 140 },
  };

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    fontWeight: 600,
    border: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms ease',
    width: fullWidth ? '100%' : 'auto',
    paddingLeft: fullWidth ? 'unset' : 16,
    paddingRight: fullWidth ? 'unset' : 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    outline: isFocused ? '2px solid #8B5CF6' : 'none',
    outlineOffset: isFocused ? '2px' : '0',
    ...sizeStyles[size],
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
  } else if (variant === 'danger') {
    variantStyles = {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
    };
  } else if (variant === 'ghost') {
    variantStyles = {
      backgroundColor: 'transparent',
      color: PIWORK_THEME.colors.textPrimary,
    };
  }

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles,
      }}
      disabled={isDisabled}
      onClick={onClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
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
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      className={className}
    >
      {isLoading ? <Spinner size="sm" color="white" /> : children}
    </button>
  );
}
