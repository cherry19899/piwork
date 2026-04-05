'use client';

import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}

export function Spinner({ size = 'md', color = 'primary' }: SpinnerProps) {
  const sizeMap = {
    sm: { width: 16, height: 16, borderWidth: 2 },
    md: { width: 24, height: 24, borderWidth: 2 },
    lg: { width: 32, height: 32, borderWidth: 3 },
  };

  const colorValue = color === 'white' ? '#FFFFFF' : PIWORK_THEME.colors.primary;
  const { width, height, borderWidth } = sizeMap[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          border: `${borderWidth}px solid rgba(139, 92, 246, 0.2)`,
          borderTop: `${borderWidth}px solid ${colorValue}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
}
