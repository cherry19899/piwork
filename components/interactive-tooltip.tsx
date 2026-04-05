'use client';

import { useEffect, useState, useRef } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface InteractiveTooltipProps {
  id: string;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  maxWidth?: number;
}

export function InteractiveTooltip({
  id,
  text,
  position,
  children,
  maxWidth = 200,
}: InteractiveTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage for dismissed tooltips
    const dismissed = localStorage.getItem(`tooltip-${id}`);
    if (dismissed) {
      setIsDismissed(true);
    }
  }, [id]);

  const handleDontShowAgain = () => {
    localStorage.setItem(`tooltip-${id}`, 'true');
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (isDismissed) {
    return <>{children}</>;
  }

  const getPositionStyles = (): React.CSSProperties => {
    const offset = 12;
    const positions: Record<string, React.CSSProperties> = {
      top: {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: offset,
      },
      bottom: {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: offset,
      },
      left: {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: offset,
      },
      right: {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: offset,
      },
    };
    return positions[position] || positions.bottom;
  };

  const getArrowStyles = (): React.CSSProperties => {
    const arrows: Record<string, React.CSSProperties> = {
      top: {
        bottom: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderTop: `6px solid ${PIWORK_THEME.colors.bgSecondary}`,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
      },
      bottom: {
        top: '-6px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottom: `6px solid ${PIWORK_THEME.colors.bgSecondary}`,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
      },
      left: {
        right: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderLeft: `6px solid ${PIWORK_THEME.colors.bgSecondary}`,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
      },
      right: {
        left: '-6px',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRight: `6px solid ${PIWORK_THEME.colors.bgSecondary}`,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
      },
    };
    return arrows[position] || arrows.bottom;
  };

  return (
    <div
      ref={triggerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.md,
            padding: PIWORK_THEME.spacing.md,
            width: maxWidth,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 200ms ease-out',
            ...getPositionStyles(),
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              ...getArrowStyles(),
            }}
          />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'transparent',
              border: 'none',
              color: PIWORK_THEME.colors.textSecondary,
              fontSize: 16,
              cursor: 'pointer',
              padding: 0,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 200ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                PIWORK_THEME.colors.primary;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                PIWORK_THEME.colors.textSecondary;
            }}
            aria-label="Close tooltip"
          >
            ✕
          </button>

          {/* Content */}
          <p
            style={{
              fontSize: PIWORK_THEME.typography.small.fontSize,
              color: PIWORK_THEME.colors.textPrimary,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.sm,
              paddingRight: 24,
              lineHeight: 1.4,
            }}
          >
            {text}
          </p>

          {/* Don't Show Again Checkbox */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: PIWORK_THEME.colors.textSecondary,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              onChange={handleDontShowAgain}
              style={{
                width: 16,
                height: 16,
                cursor: 'pointer',
                accentColor: PIWORK_THEME.colors.primary,
              }}
              aria-label="Don't show this tooltip again"
            />
            <span>Don&apos;t show again</span>
          </label>
        </div>
      )}
    </div>
  );
}
