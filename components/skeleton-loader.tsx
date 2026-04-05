'use client';

import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        border: `1px solid ${PIWORK_THEME.colors.border}`,
        borderRadius: PIWORK_THEME.radius.lg,
        padding: PIWORK_THEME.spacing.md,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: PIWORK_THEME.spacing.md,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 16,
            backgroundColor: '#333333',
            borderRadius: 4,
            marginBottom: 8,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            height: 12,
            backgroundColor: '#2a2a2a',
            borderRadius: 4,
            width: '60%',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>

      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 4,
          backgroundColor: '#333333',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export function SkeletonGrid({ columns = 2 }: { columns?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: PIWORK_THEME.spacing.md,
      }}
    >
      {Array.from({ length: columns * 2 }).map((_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1 / 1',
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            borderRadius: PIWORK_THEME.radius.lg,
            animation: `pulse 1.5s ease-in-out infinite`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height: i === lines - 1 ? 12 : 16,
            backgroundColor: '#333333',
            borderRadius: 4,
            width: i === lines - 1 ? '70%' : '100%',
            animation: `pulse 1.5s ease-in-out infinite`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}
