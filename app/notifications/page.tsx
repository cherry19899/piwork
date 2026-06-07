'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getNotifications, markNotificationsRead } from '@/lib/workpro-api';

const NOTIF_ICONS: Record<string, string> = {
  hired:       '🎉',
  submitted:   '📬',
  completed:   '✅',
  payment:     '💰',
  message:     '💬',
  application: '📋',
  dispute:     '⚠️',
  default:     '🔔',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    getNotifications()
      .then(({ notifications: n }) => setNotifications(n || []))
      .catch(() => setNotifications([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (_) {} finally { setMarking(false); }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const timeAgo = (dateStr: string) => {
    const h = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000);
    if (h < 1) return 'только что';
    if (h < 24) return `${h}ч назад`;
    const d = Math.floor(h / 24);
    return `${d}д назад`;
  };

  const handleNotifClick = (notif: any) => {
    if (notif.job_id) router.push(`/task/${notif.job_id}`);
    else if (notif.room_id) router.push(`/chat/${notif.room_id}`);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md }}>
          <button onClick={() => router.back()} style={{
            backgroundColor: 'transparent', border: 'none',
            color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
          }}>←</button>
          <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>
            Уведомления
          </h1>
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#EF4444', color: '#fff',
              borderRadius: 10, fontSize: 11, fontWeight: 700,
              padding: '2px 7px', minWidth: 18, textAlign: 'center',
            }}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={marking}
            style={{
              backgroundColor: 'transparent', border: 'none',
              color: PIWORK_THEME.colors.primary, cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
            }}
          >
            {marking ? '...' : 'Прочитать все'}
          </button>
        )}
      </header>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: PIWORK_THEME.spacing.xl }}>
            <div style={{ color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: `${PIWORK_THEME.spacing.xxl}px ${PIWORK_THEME.spacing.lg}px` }}>
            <p style={{ fontSize: 48, margin: 0, marginBottom: 12 }}>🔔</p>
            <p style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 8 }}>Нет уведомлений</p>
            <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0 }}>
              Здесь будут появляться уведомления о ваших задачах и сообщениях
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const icon = NOTIF_ICONS[notif.type] || NOTIF_ICONS.default;
            const isClickable = notif.job_id || notif.room_id;
            return (
              <div
                key={notif.id}
                onClick={() => isClickable && handleNotifClick(notif)}
                style={{
                  display: 'flex', gap: 12, padding: `${PIWORK_THEME.spacing.md}px`,
                  borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
                  backgroundColor: notif.is_read ? 'transparent' : `${PIWORK_THEME.colors.primary}08`,
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'background-color 150ms',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: notif.is_read ? PIWORK_THEME.colors.bgSecondary : `${PIWORK_THEME.colors.primary}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 14, fontWeight: notif.is_read ? 400 : 600,
                    margin: 0, marginBottom: 4, color: PIWORK_THEME.colors.textPrimary,
                    lineHeight: 1.4,
                  }}>
                    {notif.title || notif.message || notif.text || 'Уведомление'}
                  </p>
                  {(notif.body || notif.description) && (
                    <p style={{
                      fontSize: 13, color: PIWORK_THEME.colors.textSecondary,
                      margin: 0, marginBottom: 4, lineHeight: 1.4,
                    }}>
                      {notif.body || notif.description}
                    </p>
                  )}
                  <p style={{ fontSize: 11, color: PIWORK_THEME.colors.textTertiary, margin: 0 }}>
                    {notif.created_at ? timeAgo(notif.created_at) : ''}
                  </p>
                </div>
                {!notif.is_read && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: PIWORK_THEME.colors.primary,
                    flexShrink: 0, marginTop: 6,
                  }} />
                )}
              </div>
            );
          })
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
