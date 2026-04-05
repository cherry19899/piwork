'use client';

import React, { ReactNode } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface AccessibleCardProps {
  variant?: 'task' | 'user' | 'review';
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  role?: string;
  elevation?: boolean;
}

export function AccessibleCard({
  variant = 'task',
  children,
  onClick,
  href,
  ariaLabel,
  role = onClick || href ? 'button' : 'article',
  elevation = false,
}: AccessibleCardProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: PIWORK_THEME.colors.bgSecondary,
    border: `1px solid ${PIWORK_THEME.colors.border}`,
    borderRadius: PIWORK_THEME.radius.lg,
    padding: PIWORK_THEME.spacing.lg,
    cursor: onClick || href ? 'pointer' : 'default',
    transition: 'all 200ms ease',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative' as const,
  };

  const hoverStyles: React.CSSProperties = onClick || href ? {
    borderColor: PIWORK_THEME.colors.primary,
    ...(elevation && {
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
    }),
  } : {};

  const Component = href ? 'a' : onClick ? 'div' : 'article';

  return (
    <Component
      as={Component as any}
      href={href}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      tabIndex={onClick || href ? 0 : undefined}
      onKeyDown={(e: any) => {
        if ((onClick || href) && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (onClick || href) {
          Object.assign((e.currentTarget as HTMLElement).style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || href) {
          (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.border;
          if (elevation) {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }
        }
      }}
    >
      {children}
    </Component>
  );
}

interface AccessibleBadgeProps {
  variant?: 'status' | 'notification' | 'rating';
  children: ReactNode;
  ariaLabel?: string;
}

export function AccessibleBadge({
  variant = 'status',
  children,
  ariaLabel,
}: AccessibleBadgeProps) {
  let bgColor = PIWORK_THEME.colors.primary;
  let textColor = '#FFFFFF';

  if (variant === 'notification') {
    bgColor = '#EF4444';
    textColor = '#FFFFFF';
  } else if (variant === 'rating') {
    bgColor = '#FBBF24';
    textColor = '#000000';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `4px 12px`,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
      }}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
}

interface AccessibleAvatarProps {
  src?: string;
  alt: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function AccessibleAvatar({
  src,
  alt,
  initials,
  size = 'md',
  ariaLabel,
}: AccessibleAvatarProps) {
  const sizes: Record<string, number> = {
    sm: 32,
    md: 40,
    lg: 80,
  };

  const sizeValue = sizes[size];

  return (
    <div
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: '50%',
        backgroundColor: PIWORK_THEME.colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'lg' ? 32 : size === 'md' ? 20 : 16,
        fontWeight: 700,
        color: '#FFFFFF',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      role="img"
      aria-label={ariaLabel || alt}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        initials || alt.charAt(0)
      )}
    </div>
  );
}

interface AccessibleIconProps {
  icon: ReactNode;
  label: string;
  size?: 'compact' | 'default';
  ariaHidden?: boolean;
}

export function AccessibleIcon({
  icon,
  label,
  size = 'default',
  ariaHidden = false,
}: AccessibleIconProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'compact' ? 20 : 24,
        lineHeight: 1,
      }}
      role={ariaHidden ? 'presentation' : 'img'}
      aria-label={ariaHidden ? undefined : label}
      aria-hidden={ariaHidden}
    >
      {icon}
    </span>
  );
}
