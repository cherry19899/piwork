'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';
import { getJob, applyToJob, type Job } from '@/lib/workpro-api';
import { PiPaymentService } from '@/lib/pi-sdk-service';

type TabType = 'details' | 'applications';

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    getJob(id)
      .then(({ job, applications }) => {
        setJob(job);
        setApplications(applications);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  const isMyJob = job?.posted_by === currentUserId;
  const alreadyApplied = applications.some((a) => a.freelancer_id === currentUserId);

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    setApplyError(null);
    try {
      await applyToJob(job.id, applyMessage);
      setApplySuccess(true);
      setShowApplyForm(false);
      setApplications((prev) => [...prev, { freelancer_id: currentUserId }]);
    } catch (e: any) {
      setApplyError(e.message || 'Ошибка при отклике');
    } finally {
      setApplying(false);
    }
  };

  const statusColors: Record<string, { bg: string; label: string }> = {
    open: { bg: '#8B5CF6', label: 'Открыта' },
    in_progress: { bg: '#F59E0B', label: 'В работе' },
    completed: { bg: '#22C55E', label: 'Завершена' },
  };

  const statusStyle = statusColors[job?.status || 'open'] || statusColors['open'];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <div style={{ color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <p style={{ color: PIWORK_THEME.colors.textSecondary }}>Задача не найдена</p>
        <button onClick={() => router.push('/feed')} style={{ marginTop: 16, color: PIWORK_THEME.colors.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
          ← Назад
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 140,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
        display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md,
      }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'transparent', border: 'none',
          color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
        }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h2.fontSize, fontWeight: 700, margin: 0 }}>
          Детали задачи
        </h1>
      </header>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.lg, overflowY: 'auto' }}>
        {/* Status */}
        <div style={{
          display: 'inline-block', backgroundColor: statusStyle.bg, color: '#fff',
          padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
          borderRadius: PIWORK_THEME.radius.md,
          fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700,
          marginBottom: PIWORK_THEME.spacing.md, textTransform: 'uppercase',
        }}>
          {statusStyle.label}
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.lg }}>
          {job.title}
        </h2>

        {/* Budget */}
        <div style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          border: `2px solid ${PIWORK_THEME.colors.primary}`,
          borderRadius: PIWORK_THEME.radius.lg,
          padding: PIWORK_THEME.spacing.lg, marginBottom: PIWORK_THEME.spacing.lg,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 4 }}>Бюджет</p>
            <span style={{ fontSize: 32, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{job.budget}π</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 4 }}>Категория</p>
            <span style={{ fontSize: 16, fontWeight: 600 }}>{job.category}</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: PIWORK_THEME.spacing.md,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          marginBottom: PIWORK_THEME.spacing.lg,
        }}>
          {(['details', 'applications'] as TabType[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: `${PIWORK_THEME.spacing.md}px 0`,
              backgroundColor: 'transparent', border: 'none',
              color: activeTab === tab ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.textSecondary,
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer',
              borderBottom: activeTab === tab ? `2px solid ${PIWORK_THEME.colors.primary}` : 'none',
              marginBottom: -1, transition: 'all 200ms ease',
            }}>
              {tab === 'details' ? 'Описание' : `Отклики (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Details tab */}
        {activeTab === 'details' && (
          <div>
            <div style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg,
              padding: PIWORK_THEME.spacing.lg, marginBottom: PIWORK_THEME.spacing.lg,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>Описание</h3>
              <p style={{ fontSize: 14, color: PIWORK_THEME.colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
                {job.description}
              </p>
            </div>

            {job.skills && (
              <div style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: PIWORK_THEME.spacing.lg, marginBottom: PIWORK_THEME.spacing.lg,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>Навыки</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.skills.split(',').map((s) => (
                    <span key={s} style={{
                      padding: '4px 10px', backgroundColor: `${PIWORK_THEME.colors.primary}20`,
                      color: PIWORK_THEME.colors.primary, borderRadius: PIWORK_THEME.radius.sm, fontSize: 13,
                    }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>Заказчик</h3>
              <p style={{ fontSize: 14, color: PIWORK_THEME.colors.textSecondary, margin: 0 }}>
                {job.posted_by_name}
              </p>
            </div>
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>
                Откликов пока нет
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{app.freelancer_name}</span>
                    <span style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary,
                      textTransform: 'capitalize',
                      color: app.status === 'accepted' ? '#22C55E' : PIWORK_THEME.colors.textSecondary,
                    }}>
                      {app.status === 'accepted' ? 'Принят' : app.status === 'rejected' ? 'Отклонён' : 'На рассмотрении'}
                    </span>
                  </div>
                  {app.message && (
                    <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0 }}>{app.message}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Apply form */}
        {showApplyForm && !isMyJob && (
          <div style={{
            marginTop: PIWORK_THEME.spacing.lg,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>
              Ваше сопроводительное письмо
            </h3>
            <textarea
              value={applyMessage}
              onChange={(e) => setApplyMessage(e.target.value)}
              placeholder="Расскажите почему вы подходите для этой задачи..."
              rows={4}
              style={{
                width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
                color: PIWORK_THEME.colors.textPrimary, fontSize: 14, resize: 'vertical',
                boxSizing: 'border-box', outline: 'none',
              }}
            />
            {applyError && <p style={{ color: '#EF4444', fontSize: 13, margin: '8px 0 0' }}>{applyError}</p>}
            <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md, marginTop: PIWORK_THEME.spacing.md }}>
              <button onClick={() => setShowApplyForm(false)} style={{
                flex: 1, padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md, color: PIWORK_THEME.colors.textSecondary,
                cursor: 'pointer', fontSize: 14,
              }}>
                Отмена
              </button>
              <button onClick={handleApply} disabled={applying} style={{
                flex: 2, padding: PIWORK_THEME.spacing.md, backgroundColor: PIWORK_THEME.colors.primary,
                border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                cursor: applying ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600,
                opacity: applying ? 0.7 : 1,
              }}>
                {applying ? 'Отправляем...' : 'Откликнуться'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Action Button */}
      {!isMyJob && (
        <div style={{
          position: 'fixed', bottom: 80, left: PIWORK_THEME.spacing.md, right: PIWORK_THEME.spacing.md,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          paddingTop: PIWORK_THEME.spacing.md,
          borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        }}>
          {applySuccess ? (
            <div style={{
              textAlign: 'center', padding: PIWORK_THEME.spacing.md,
              backgroundColor: '#22C55E20', borderRadius: PIWORK_THEME.radius.md,
              color: '#22C55E', fontWeight: 600,
            }}>
              ✓ Отклик отправлен!
            </div>
          ) : alreadyApplied ? (
            <div style={{
              textAlign: 'center', padding: PIWORK_THEME.spacing.md,
              color: PIWORK_THEME.colors.textSecondary, fontSize: 14,
            }}>
              Вы уже откликнулись на эту задачу
            </div>
          ) : job.status === 'open' ? (
            <PiworkButton variant="primary" fullWidth onClick={() => setShowApplyForm(true)}>
              Откликнуться ({job.apply_cost || 1} connect)
            </PiworkButton>
          ) : (
            <PiworkButton variant="primary" disabled fullWidth>
              Задача закрыта
            </PiworkButton>
          )}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
