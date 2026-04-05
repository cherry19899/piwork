'use client';

import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { useOffline } from '@/lib/offline-context';

export function OfflineBanner() {
  const { isOnline } = useOffline();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        backgroundColor: '#F59E0B',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 600,
        zIndex: 100,
        animation: 'slideInDown 300ms ease-out',
      }}
    >
      📡 You&apos;re offline • Cached data visible • Messages will be sent when online
    </div>
  );
}
