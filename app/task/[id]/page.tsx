'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';

type TaskStatus = 'Open' | 'In Progress' | 'Completed';
type TabType = 'details' | 'applications' | 'chat';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [taskStatus] = useState<TaskStatus>('Open');
  const [isMyTask] = useState(false);

  const statusColors: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    Open: { bg: '#8B5CF6', text: '#FFFFFF', label: 'Open' },
    'In Progress': { bg: '#F59E0B', text: '#FFFFFF', label: 'In Progress' },
    Completed: { bg: '#22C55E', text: '#FFFFFF', label: 'Completed' },
  };

  const statusStyle = statusColors[taskStatus];

  const timeline = [
    { date: '2024-01-15 10:30', action: 'Task posted', status: 'completed' },
    { date: '2024-01-15 14:20', action: 'First application', status: 'completed' },
    { date: '2024-01-16 09:00', action: 'Freelancer assigned', status: 'pending' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: 100,
      }}
    >
      {/* Header with Back Button */}
      <header
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
          display: 'flex',
          alignItems: 'center',
          gap: PIWORK_THEME.spacing.md,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.primary,
            fontSize: 24,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ←
        </button>
        <h1
          style={{
            fontSize: PIWORK_THEME.typography.h2.fontSize,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Task Details
        </h1>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: PIWORK_THEME.spacing.lg,
          overflowY: 'auto',
        }}
      >
        {/* Status Badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
            borderRadius: PIWORK_THEME.radius.md,
            fontSize: PIWORK_THEME.typography.small.fontSize,
            fontWeight: 700,
            marginBottom: PIWORK_THEME.spacing.md,
            textTransform: 'uppercase',
          }}
        >
          {statusStyle.label}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.lg,
            color: PIWORK_THEME.colors.textPrimary,
          }}
        >
          Написать описания товаров
        </h2>

        {/* Budget Display */}
        <div
          style={{
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `2px solid ${PIWORK_THEME.colors.primary}`,
            borderRadius: PIWORK_THEME.radius.lg,
            padding: PIWORK_THEME.spacing.lg,
            marginBottom: PIWORK_THEME.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontSize: PIWORK_THEME.typography.small.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                margin: 0,
                marginBottom: 4,
              }}
            >
              Бюджет
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: PIWORK_THEME.colors.primary,
                }}
              >
                50
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: PIWORK_THEME.colors.primary,
                }}
              >
                π
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: PIWORK_THEME.typography.small.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                margin: 0,
                marginBottom: 4,
              }}
            >
              Срок
            </p>
            <p
              style={{
                fontSize: PIWORK_THEME.typography.h2.fontSize,
                fontWeight: 700,
                margin: 0,
              }}
            >
              7 дней
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: PIWORK_THEME.spacing.md,
            borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
            marginBottom: PIWORK_THEME.spacing.lg,
          }}
        >
          {['details', 'applications', 'chat'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              style={{
                padding: `${PIWORK_THEME.spacing.md}px 0`,
                backgroundColor: 'transparent',
                border: 'none',
                color:
                  activeTab === tab
                    ? PIWORK_THEME.colors.primary
                    : PIWORK_THEME.colors.textSecondary,
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer',
                borderBottom:
                  activeTab === tab ? `2px solid ${PIWORK_THEME.colors.primary}` : 'none',
                marginBottom: -1,
                transition: 'all 200ms ease',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'applications' ? 'Applications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div>
            <div
              style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: PIWORK_THEME.spacing.lg,
                marginBottom: PIWORK_THEME.spacing.lg,
              }}
            >
              <h3
                style={{
                  fontSize: PIWORK_THEME.typography.h2.fontSize,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: PIWORK_THEME.spacing.md,
                }}
              >
                Description
              </h3>
              <p
                style={{
                  fontSize: PIWORK_THEME.typography.body.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Нужны продуманные, продающие описания для 10 товаров. Каждое описание должно
                включать ключевые преимущества и быть оптимизировано для SEO. Объем: 50-100 слов
                на товар. Срок: 7 дней.
              </p>
            </div>

            {/* Timeline */}
            <div>
              <h3
                style={{
                  fontSize: PIWORK_THEME.typography.h2.fontSize,
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: PIWORK_THEME.spacing.lg,
                }}
              >
                Status History
              </h3>

              <div style={{ position: 'relative', paddingLeft: 30 }}>
                {timeline.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: PIWORK_THEME.spacing.lg,
                      position: 'relative',
                    }}
                  >
                    {/* Timeline Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -30,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor:
                          item.status === 'completed'
                            ? PIWORK_THEME.colors.primary
                            : PIWORK_THEME.colors.border,
                        border: `2px solid ${PIWORK_THEME.colors.bgPrimary}`,
                      }}
                    />

                    {/* Timeline Line */}
                    {index < timeline.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: -26,
                          top: 12,
                          width: 2,
                          height: 40,
                          backgroundColor:
                            item.status === 'completed'
                              ? PIWORK_THEME.colors.primary
                              : PIWORK_THEME.colors.border,
                        }}
                      />
                    )}

                    {/* Content */}
                    <div
                      style={{
                        backgroundColor: PIWORK_THEME.colors.bgSecondary,
                        border: `1px solid ${PIWORK_THEME.colors.border}`,
                        borderRadius: PIWORK_THEME.radius.lg,
                        padding: PIWORK_THEME.spacing.md,
                      }}
                    >
                      <p
                        style={{
                          fontSize: PIWORK_THEME.typography.body.fontSize,
                          fontWeight: 600,
                          margin: 0,
                          marginBottom: 4,
                        }}
                      >
                        {item.action}
                      </p>
                      <p
                        style={{
                          fontSize: PIWORK_THEME.typography.small.fontSize,
                          color: PIWORK_THEME.colors.textSecondary,
                          margin: 0,
                        }}
                      >
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div
            style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg,
              padding: PIWORK_THEME.spacing.lg,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: PIWORK_THEME.typography.body.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                margin: 0,
              }}
            >
              3 applications received
            </p>
          </div>
        )}

        {activeTab === 'chat' && (
          <div
            style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg,
              padding: PIWORK_THEME.spacing.lg,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: PIWORK_THEME.typography.body.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                margin: 0,
              }}
            >
              Chat with task participants
            </p>
          </div>
        )}
      </main>

      {/* Fixed Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 80,
          left: PIWORK_THEME.spacing.md,
          right: PIWORK_THEME.spacing.md,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          paddingTop: PIWORK_THEME.spacing.md,
          borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        }}
      >
        {!isMyTask ? (
          taskStatus === 'Open' ? (
            <PiworkButton variant="primary" fullWidth={true}>
              Apply
            </PiworkButton>
          ) : (
            <PiworkButton variant="primary" disabled fullWidth={true}>
              Task Closed
            </PiworkButton>
          )
        ) : (
          <PiworkButton variant="primary" fullWidth={true}>
            View Applications
          </PiworkButton>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
