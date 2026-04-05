'use client';

import { useOffline } from '@/lib/offline-context';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export function SyncingBadge() {
  const { isOnline, syncStatus } = useOffline();

  if (isOnline && syncStatus === 'idle') return null;

  if (syncStatus === 'syncing') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: PIWORK_THEME.colors.primary,
          color: '#FFFFFF',
          padding: '4px 8px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        Syncing...
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          padding: '4px 8px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        ⚠️ Sync failed
      </div>
    );
  }

  return null;
}
