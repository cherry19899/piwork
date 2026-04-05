'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTab {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const navTabs: NavTab[] = [
  { id: 'feed', label: 'Лента', icon: '🏠' },
  { id: 'create', label: 'Создать', icon: '➕' },
  { id: 'chats', label: 'Чаты', icon: '💬', badge: 3 },
  { id: 'profile', label: 'Профиль', icon: '👤' },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const path = pathname.split('/')[1];
    if (['feed', 'create', 'chats', 'profile'].includes(path)) {
      setActiveTab(path);
    }
  }, [pathname]);

  useEffect(() => {
    const checkTablet = () => setIsTablet(window.innerWidth >= 768);
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  const iconSize = isTablet ? 32 : 24;
  const navHeight = isTablet ? 80 : 64;

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: navHeight,
        backgroundColor: '#1A1A1A',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid #2A2A2A',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        paddingBottom: 0,
        paddingTop: 0,
        transition: 'height 300ms ease',
      }}
    >
      {navTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconColor = isActive ? '#8B5CF6' : '#737373';

        return (
          <Link
            key={tab.id}
            href={`/${tab.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              textDecoration: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: iconSize,
                marginBottom: isTablet ? 8 : 4,
                position: 'relative',
                transition: 'font-size 300ms ease',
              }}
            >
              {tab.icon}
              {tab.badge ? (
                <div
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    width: 20,
                    height: 20,
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    border: '2px solid #1A1A1A',
                  }}
                >
                  {tab.badge}
                </div>
              ) : null}
            </div>
            <span
              style={{
                fontSize: isTablet ? 12 : 10,
                fontWeight: 600,
                color: iconColor,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                transition: 'all 200ms ease',
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
