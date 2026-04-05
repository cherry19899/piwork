'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { useDoubleTap } from '@/hooks/use-gestures';

interface LikeableMessageProps {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  onLike?: () => void;
}

export function LikeableMessage({
  id,
  text,
  timestamp,
  sender,
  onLike,
}: LikeableMessageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const { handleTap } = useDoubleTap(() => {
    setIsLiked(!isLiked);
    setShowHeartAnimation(true);
    setTimeout(() => setShowHeartAnimation(false), 600);
    onLike?.();
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: sender === 'me' ? 'flex-end' : 'flex-start',
        position: 'relative',
      }}
      onDoubleClick={handleTap}
    >
      <div
        style={{
          maxWidth: '75%',
          backgroundColor:
            sender === 'me'
              ? PIWORK_THEME.colors.primary
              : PIWORK_THEME.colors.bgSecondary,
          color: sender === 'me' ? '#FFFFFF' : PIWORK_THEME.colors.textPrimary,
          padding: `${PIWORK_THEME.spacing.md}px`,
          borderRadius: PIWORK_THEME.radius.lg,
          wordWrap: 'break-word',
          border:
            sender === 'me' ? 'none' : `1px solid ${PIWORK_THEME.colors.border}`,
          position: 'relative',
        }}
      >
        <p
          style={{
            fontSize: PIWORK_THEME.typography.body.fontSize,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {text}
        </p>
        <p
          style={{
            fontSize: 10,
            color:
              sender === 'me'
                ? 'rgba(255, 255, 255, 0.7)'
                : PIWORK_THEME.colors.textSecondary,
            margin: '4px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {timestamp}
          {isLiked && <span>❤️</span>}
        </p>

        {/* Heart Animation */}
        {showHeartAnimation && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 48,
              pointerEvents: 'none',
              animation: 'heartBounce 600ms ease-out',
            }}
          >
            ❤️
          </div>
        )}
      </div>

      <style>{`
        @keyframes heartBounce {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -80%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -120%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
