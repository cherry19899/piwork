'use client';

import { ReactNode } from 'react';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppLayout({ children, showNav = true }: AppLayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: showNav ? 80 : 0,
          overscrollBehavior: 'contain',
        }}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && <BottomNavigation />}
    </div>
  );
}
