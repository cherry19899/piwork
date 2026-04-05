'use client';

import Link from 'next/link';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';

export default function ChatsPage() {
  const chats = [
    {
      id: 1,
      name: 'TechStore Designer',
      lastMessage: 'The logo looks great!',
      timestamp: '2h',
      unread: 2,
    },
    {
      id: 2,
      name: 'CreativeTeam Manager',
      lastMessage: 'Can you start tomorrow?',
      timestamp: '1d',
      unread: 0,
    },
    {
      id: 3,
      name: 'DataPro Admin',
      lastMessage: 'All data entered correctly',
      timestamp: '3d',
      unread: 0,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
        }}
      >
        <h1
          style={{
            fontSize: PIWORK_THEME.typography.h1.fontSize,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Чаты
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: PIWORK_THEME.spacing.md,
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg,
                  padding: PIWORK_THEME.spacing.md,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    PIWORK_THEME.colors.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    PIWORK_THEME.colors.border;
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: PIWORK_THEME.typography.body.fontSize,
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {chat.name}
                    </h3>
                    <span
                      style={{
                        fontSize: PIWORK_THEME.typography.small.fontSize,
                        color: PIWORK_THEME.colors.textSecondary,
                      }}
                    >
                      {chat.timestamp}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: PIWORK_THEME.typography.small.fontSize,
                      color: PIWORK_THEME.colors.textSecondary,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div
                    style={{
                      marginLeft: PIWORK_THEME.spacing.md,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: PIWORK_THEME.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {chat.unread}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
