'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUnreadChatCount } from '@/lib/workpro-api';

interface NavTab {
  id: string;
  label: string;
  icon: string;
}

const navTabs: NavTab[] = [
  { id: 'feed',    label: 'Лента',   icon: '🏠' },
  { id: 'create',  label: 'Создать', icon: '➕' },
  { id: 'chats',   label: 'Чаты',    icon: '💬' },
  { id: 'profile', label: 'Профиль', icon: '👤' },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [isTablet, setIsTablet] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    const path = pathname.split('/')[1];
    if (navTabs.some(t => t.id === path)) setActiveTab(path);
  }, [pathname]);

  useEffect(() => {
    const checkTablet = () => setIsTablet(window.innerWidth >= 768);
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Poll unread chat count every 30s
  useEffect(() => {
    const fetchUnread = () => {
      const userId = (() => {
        try { return JSON.parse(localStorage.getItem('piUser') || 'null')?.uid || null; } catch { return null; }
      })();
      if (!userId) return;
      getUnreadChatCount().then(({ count }) => setUnreadChats(count)).catch(() => {});
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const iconSize = isTablet ? 32 : 24;
  const navHeight = isTablet ? 80 : 64;

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: navHeight,
      backgroundColor: '#1A1A1A',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      borderTop: '1px solid #2A2A2A',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 50, transition: 'height 300ms ease',
    }}>
      {navTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const badge = tab.id === 'chats' ? unreadChats : 0;

        return (
          <Link key={tab.id} href={`/${tab.id}`} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', flex: 1, height: '100%',
            textDecoration: 'none', position: 'relative', cursor: 'pointer',
            transition: 'all 200ms ease',
          }} onClick={() => setActiveTab(tab.id)}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: iconSize, marginBottom: isTablet ? 8 : 4,
              position: 'relative', transition: 'font-size 300ms ease',
            }}>
              {tab.icon}
              {badge > 0 && (
                <div style={{
                  position: 'absolute', top: -6, right: -8,
                  minWidth: 18, height: 18,
                  backgroundColor: '#EF4444', borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#FFFFFF',
                  border: '2px solid #1A1A1A', padding: '0 3px',
                }}>
                  {badge > 99 ? '99+' : badge}
                </div>
              )}
            </div>
            <span style={{
              fontSize: isTablet ? 12 : 10, fontWeight: 600,
              color: isActive ? '#8B5CF6' : '#737373',
              letterSpacing: 0.3, textTransform: 'uppercase',
              transition: 'all 200ms ease',
            }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
