'use client';

import Link from 'next/link';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface ProfileMenuProps {
  onSettingsClick?: () => void;
}

export function ProfileMenu({ onSettingsClick }: ProfileMenuProps) {
  const menuItems = [
    { icon: '⚙️', label: 'Settings', href: '/settings' },
    { icon: '💳', label: 'Payment Methods', href: '/payments' },
    { icon: '📋', label: 'Task History', href: '/history' },
    { icon: '🆘', label: 'Help & Support', href: '/support' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: PIWORK_THEME.spacing.sm,
      }}
    >
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: PIWORK_THEME.spacing.md,
            padding: `${PIWORK_THEME.spacing.md}px`,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            color: PIWORK_THEME.colors.textPrimary,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.primary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.border;
          }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontWeight: 500 }}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
