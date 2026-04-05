'use client';

import { useRef, useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import Link from 'next/link';

interface SwipeableTaskCardProps {
  id: number;
  title: string;
  budget: number;
  deadline: string;
  creatorAvatar: string;
  onApply?: () => void;
  onShare?: () => void;
}

export function SwipeableTaskCard({
  id,
  title,
  budget,
  deadline,
  creatorAvatar,
  onApply,
  onShare,
}: SwipeableTaskCardProps) {
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;

    // Limit swipe distance
    if (diff > 120) {
      setSwipeX(120);
    } else if (diff < -120) {
      setSwipeX(-120);
    } else {
      setSwipeX(diff);
    }
  };

  const handleTouchEnd = () => {
    // Swipe left (apply)
    if (swipeX < -50 && onApply) {
      onApply();
      setSwipeX(-120);
      setTimeout(() => setSwipeX(0), 300);
    }
    // Swipe right (share)
    else if (swipeX > 50 && onShare) {
      onShare();
      setSwipeX(120);
      setTimeout(() => setSwipeX(0), 300);
    } else {
      setSwipeX(0);
    }
  };

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: PIWORK_THEME.radius.lg,
      }}
    >
      {/* Swipe Action Backgrounds */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: PIWORK_THEME.spacing.md,
          backgroundColor: '#10B981',
          opacity: Math.max(0, swipeX / 120),
          zIndex: 0,
        }}
      >
        <span style={{ color: 'white', fontWeight: 700 }}>📤 Share</span>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: PIWORK_THEME.spacing.md,
          backgroundColor: '#8B5CF6',
          opacity: Math.max(0, -swipeX / 120),
          zIndex: 0,
        }}
      >
        <span style={{ color: 'white', fontWeight: 700 }}>Apply ✓</span>
      </div>

      {/* Card Content */}
      <Link href={`/task/${id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            padding: PIWORK_THEME.spacing.md,
            cursor: 'grab',
            userSelect: 'none',
            transform: `translateX(${swipeX}px)`,
            transition: swipeX === 0 ? 'transform 300ms ease-out' : 'none',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.sm,
              color: PIWORK_THEME.colors.textPrimary,
            }}
          >
            {title}
          </h3>

          <div style={{ flex: 1, marginBottom: PIWORK_THEME.spacing.md }}>
            <p
              style={{
                fontSize: PIWORK_THEME.typography.small.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                margin: 0,
              }}
            >
              {deadline}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
              paddingTop: PIWORK_THEME.spacing.md,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: PIWORK_THEME.colors.primary,
              }}
            >
              {budget}π
            </div>

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: PIWORK_THEME.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {creatorAvatar}
            </div>
          </div>
        </div>
      </Link>

      {/* Swipe Hint */}
      {swipeX === 0 && (
        <div
          style={{
            position: 'absolute',
            right: PIWORK_THEME.spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 12,
            color: PIWORK_THEME.colors.textSecondary,
            opacity: 0.5,
            pointerEvents: 'none',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          ← Swipe
        </div>
      )}
    </div>
  );
}
