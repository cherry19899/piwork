'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getChatRooms, type ChatRoom } from '@/lib/workpro-api';

function timeAgo(dateStr: string | null) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'только что';
  if (h < 24) return `${h}ч`;
  return `${Math.floor(h / 24)}д`;
}

export default function ChatsPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    getChatRooms()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => {})
      .finally(() => setIsLoading(false));
    const iv = setInterval(() => {
      getChatRooms().then(({ rooms }) => setRooms(rooms)).catch(() => {});
    }, 15000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
      }}>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>
          Чаты
        </h1>
      </header>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.md, overflowY: 'auto' }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              height: 72, backgroundColor: PIWORK_THEME.colors.bgSecondary,
              borderRadius: PIWORK_THEME.radius.lg, marginBottom: PIWORK_THEME.spacing.md,
              opacity: 0.7,
            }} />
          ))
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>
            <p style={{ fontSize: 40, margin: 0 }}>💬</p>
            <p style={{ marginTop: 8 }}>Нет активных чатов</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Чаты появятся когда вы откликнетесь на задачу</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {rooms.map((room) => (
              <Link key={room.id} href={`/chat/${room.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                  cursor: 'pointer', transition: 'all 200ms ease',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.primary; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.border; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md, flex: 1 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      backgroundColor: PIWORK_THEME.colors.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>
                      👤
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {room.other_user_name || `Собеседник`}
                        </h3>
                        <span style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, flexShrink: 0, marginLeft: 8 }}>
                          {timeAgo(room.last_message_at)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {room.last_message || (room.job_title ? `📋 ${room.job_title}` : 'Нет сообщений')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
