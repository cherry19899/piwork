'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';
import { RatingModal } from '@/components/rating-modal';
import { getJob, applyToJob, hireFreelancer, completeJob, submitWork, getEscrows, createEscrow, openDispute, type Job } from '@/lib/workpro-api';
import { PiPaymentService } from '@/lib/pi-sdk-service';

const CATEGORY_RU: Record<string, string> = {
  Design: 'Дизайн', Writing: 'Тексты', Data: 'Данные',
  Audio: 'Аудио', Video: 'Видео', Other: 'Другое',
};

type TabType = 'details' | 'applications';

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job & {
    hired_freelancer_id?: string;
    hired_freelancer_name?: string;
    escrow_id?: number;
  } | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('details');

  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const [hiring, setHiring] = useState<number | null>(null);
  const [hireError, setHireError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'payment' | 'hiring'>('idle');

  const [completing, setCompleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ id: string; name: string } | null>(null);
  const [escrowId, setEscrowId] = useState<number | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    getJob(id)
      .then(({ job, applications }) => {
        setJob(job as any);
        setApplications(applications);
        if (job.posted_by === currentUserId) setActiveTab('applications');
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // Fetch escrow for this job
    getEscrows()
      .then((data: any) => {
        const escrows = data.escrows || data || [];
        const e = escrows.find((e: any) => String(e.job_id) === String(id) && ['pending', 'funded'].includes(e.status));
        if (e) setEscrowId(e.id);
      })
      .catch(() => {});
  }, [id]);

  const isMyJob = job?.posted_by === currentUserId;
  const alreadyApplied = applications.some((a) => a.freelancer_id === currentUserId);
  const myApplication = applications.find((a) => a.freelancer_id === currentUserId);
  const isHiredFreelancer = !!(job as any)?.hired_freelancer_id && (job as any)?.hired_freelancer_id === currentUserId;

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    setApplyError(null);
    try {
      await applyToJob(job.id, applyMessage);
      setApplySuccess(true);
      setShowApplyForm(false);
      setApplications((prev) => [...prev, { freelancer_id: currentUserId, status: 'pending', message: applyMessage }]);
    } catch (e: any) {
      setApplyError(e.message || 'Ошибка при отклике');
    } finally {
      setApplying(false);
    }
  };

  const handleHire = async (app: any) => {
    if (!job) return;
    setHiring(app.id);
    setHireError(null);
    try {
      // Step 1: Pi payment (SDK handles approve/complete callbacks internally)
      setPaymentStep('payment');
      const payment = await PiPaymentService.createPayment({
        amount: job.budget,
        memo: `Escrow: ${job.title.substring(0, 50)}`,
        metadata: {
          type: 'escrow',
          job_id: job.id,
          freelancer_id: app.freelancer_id,
          application_id: app.id,
          amount: job.budget,
        },
      });

      // Step 2: Hire freelancer (creates chat room, updates job status)
      setPaymentStep('hiring');
      const result = await hireFreelancer(job.id, app.id, app.freelancer_id);

      // Step 3: Ensure escrow record exists (payment complete may already have created it)
      const escrowResult: any = await createEscrow(job.id, app.freelancer_id, job.budget, payment?.identifier).catch(() => null);
      if (escrowResult?.escrow?.id) {
        setEscrowId(escrowResult.escrow.id);
      } else {
        // Fetch existing escrow created by payment callback
        const escrows = await getEscrows().catch(() => ({ escrows: [] })) as any;
        const e = (escrows.escrows || []).find((e: any) => String(e.job_id) === String(job.id));
        if (e) setEscrowId(e.id);
      }

      setJob((prev: any) => prev ? {
        ...prev,
        status: 'in_progress',
        hired_freelancer_id: app.freelancer_id,
        hired_freelancer_name: app.freelancer_name,
      } : prev);
      setApplications((prev) => prev.map((a) =>
        a.id === app.id ? { ...a, status: 'accepted' } : { ...a, status: a.status === 'pending' ? 'rejected' : a.status }
      ));
      if (result.room_id) router.push(`/chat/${result.room_id}`);
    } catch (e: any) {
      setHireError(e.message || 'Ошибка при найме');
    } finally {
      setHiring(null);
      setPaymentStep('idle');
    }
  };

  // Freelancer submits finished work for client review
  const handleSubmitWork = async () => {
    if (!job) return;
    setSubmitting(true);
    try {
      await submitWork(job.id);
      setJob((prev: any) => prev ? { ...prev, status: 'submitted' } : prev);
    } catch (e: any) {
      alert(e.message || 'Ошибка при сдаче работы');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDispute = async () => {
    if (!escrowId || !disputeReason.trim()) return;
    setSubmittingDispute(true);
    try {
      await openDispute(escrowId, disputeReason.trim());
      setShowDisputeModal(false);
      setDisputeReason('');
      alert('Спор открыт. Команда поддержки рассмотрит ситуацию в течение 48 часов.');
    } catch (e: any) {
      alert(e.message || 'Ошибка при открытии спора');
    } finally { setSubmittingDispute(false); }
  };

  // Client approves work and releases escrow
  const handleComplete = async () => {
    if (!job) return;
    setCompleting(true);
    try {
      await completeJob(job.id);
      setJob((prev: any) => prev ? { ...prev, status: 'completed' } : prev);
      const hiredId = (job as any).hired_freelancer_id;
      const hiredName = (job as any).hired_freelancer_name;
      if (hiredId && hiredName) {
        setRatingTarget({ id: hiredId, name: hiredName });
        setShowRatingModal(true);
      }
    } catch (e: any) {
      alert(e.message || 'Ошибка при завершении');
    } finally {
      setCompleting(false);
    }
  };

  const statusColors: Record<string, { bg: string; label: string }> = {
    open:        { bg: '#8B5CF6', label: 'Открыта' },
    in_progress: { bg: '#F59E0B', label: 'В работе' },
    submitted:   { bg: '#3B82F6', label: 'На проверке' },
    completed:   { bg: '#22C55E', label: 'Завершена' },
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
          ← Назад к ленте
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
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'transparent', border: 'none',
          color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
        }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h2.fontSize, fontWeight: 700, margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isMyJob ? 'Моя задача' : 'Детали задачи'}
        </h1>
      </header>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.lg, overflowY: 'auto' }}>
        {/* Status badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: PIWORK_THEME.spacing.md, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-block', backgroundColor: statusStyle.bg, color: '#fff',
            padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
            borderRadius: PIWORK_THEME.radius.md,
            fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700, textTransform: 'uppercase',
          }}>
            {statusStyle.label}
          </span>
          {isMyJob && (
            <span style={{
              display: 'inline-block', backgroundColor: `${PIWORK_THEME.colors.primary}20`, color: PIWORK_THEME.colors.primary,
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700,
            }}>
              Моя задача
            </span>
          )}
          {isHiredFreelancer && job.status !== 'completed' && (
            <span style={{
              display: 'inline-block', backgroundColor: '#22C55E20', color: '#22C55E',
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700,
            }}>
              Я исполнитель
            </span>
          )}
          {escrowId && ['in_progress', 'submitted'].includes(job.status) && (
            <span style={{
              display: 'inline-block', backgroundColor: '#3B82F620', color: '#3B82F6',
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize, fontWeight: 700,
            }}>
              🔒 {job.budget}π в эскроу
            </span>
          )}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.lg }}>
          {job.title}
        </h2>

        {/* Budget card */}
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
            <span style={{ fontSize: 16, fontWeight: 600 }}>{CATEGORY_RU[job.category] || job.category}</span>
          </div>
        </div>

        {/* Hired freelancer info */}
        {job.status !== 'open' && (job as any).hired_freelancer_name && (
          <div style={{
            backgroundColor: job.status === 'completed' ? '#22C55E10' : job.status === 'submitted' ? '#3B82F610' : '#F59E0B10',
            border: `1px solid ${job.status === 'completed' ? '#22C55E40' : job.status === 'submitted' ? '#3B82F640' : '#F59E0B40'}`,
            borderRadius: PIWORK_THEME.radius.lg,
            padding: PIWORK_THEME.spacing.md, marginBottom: PIWORK_THEME.spacing.lg,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>
              {job.status === 'completed' ? '✅' : job.status === 'submitted' ? '🔍' : '🤝'}
            </span>
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, margin: 0,
                color: job.status === 'completed' ? '#22C55E' : job.status === 'submitted' ? '#3B82F6' : '#F59E0B',
              }}>
                {job.status === 'completed' ? 'Задача завершена' : job.status === 'submitted' ? 'Работа сдана на проверку' : 'Исполнитель нанят'}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, marginTop: 2, color: PIWORK_THEME.colors.textPrimary }}>
                {(job as any).hired_freelancer_name}
              </p>
            </div>
          </div>
        )}

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
              marginBottom: -1,
            }}>
              {tab === 'details' ? 'Описание' : `Отклики (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Details tab */}
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            <div style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
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
                borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
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
              {!isMyJob ? (
                <button onClick={() => router.push(`/profile/${job.posted_by}`)} style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  color: PIWORK_THEME.colors.primary, fontSize: 14, fontWeight: 600, textDecoration: 'underline',
                }}>
                  {job.posted_by_name}
                </button>
              ) : (
                <p style={{ fontSize: 14, color: PIWORK_THEME.colors.textSecondary, margin: 0 }}>{job.posted_by_name}</p>
              )}
            </div>

            {/* Dispute button */}
            {escrowId && (job.status === 'in_progress' || job.status === 'submitted') && (isMyJob || isHiredFreelancer) && (
              <button onClick={() => setShowDisputeModal(true)} style={{
                width: '100%', padding: PIWORK_THEME.spacing.md,
                backgroundColor: 'transparent', border: `1px solid #F59E0B`,
                borderRadius: PIWORK_THEME.radius.md, color: '#F59E0B',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>
                ⚠️ Открыть спор по эскроу
              </button>
            )}
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {hireError && (
              <div style={{ padding: 12, backgroundColor: '#EF444420', borderRadius: PIWORK_THEME.radius.md, color: '#EF4444', fontSize: 13 }}>
                {hireError}
              </div>
            )}
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>
                Откликов пока нет
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${app.status === 'accepted' ? '#22C55E' : PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{app.freelancer_name}</span>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: app.status === 'accepted' ? '#22C55E' : app.status === 'rejected' ? '#EF4444' : PIWORK_THEME.colors.textSecondary,
                    }}>
                      {app.status === 'accepted' ? '✓ Нанят' : app.status === 'rejected' ? 'Отклонён' : 'На рассмотрении'}
                    </span>
                  </div>

                  {app.message && (
                    <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: isMyJob && app.status === 'pending' ? 12 : 0, lineHeight: 1.5 }}>
                      {app.message}
                    </p>
                  )}

                  {isMyJob && app.status === 'pending' && job.status === 'open' && (
                    <button
                      onClick={() => handleHire(app)}
                      disabled={hiring === app.id}
                      style={{
                        width: '100%', padding: '10px 0',
                        backgroundColor: PIWORK_THEME.colors.primary,
                        border: 'none', borderRadius: PIWORK_THEME.radius.md,
                        color: '#fff', fontWeight: 600, fontSize: 14,
                        cursor: hiring === app.id ? 'not-allowed' : 'pointer',
                        opacity: hiring === app.id ? 0.7 : 1,
                        marginTop: app.message ? 0 : 8,
                      }}
                    >
                      {hiring === app.id
                        ? paymentStep === 'payment' ? '💳 Оплата Pi...'
                        : paymentStep === 'hiring' ? '🤝 Оформляем...'
                        : 'Обработка...'
                        : `Нанять ${app.freelancer_name} (${job.budget}π в эскроу)`}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Hired freelancer name in applications — make clickable */}
        {/* (handled inline above in applications tab) */}

        {/* Apply form */}
        {showApplyForm && !isMyJob && (
          <div style={{
            marginTop: PIWORK_THEME.spacing.lg,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>
              Сопроводительное письмо
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

      {/* Fixed action bar */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0,
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
      }}>
        {isMyJob ? (
          job.status === 'submitted' ? (
            <button
              onClick={handleComplete}
              disabled={completing}
              style={{
                width: '100%', height: 48, backgroundColor: '#22C55E',
                border: 'none', borderRadius: 12, color: '#fff',
                fontWeight: 700, fontSize: 14, cursor: completing ? 'not-allowed' : 'pointer',
                opacity: completing ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: 0.5,
              }}
            >
              {completing ? 'Обработка...' : `✓ Принять работу — выплатить ${(job.budget * 0.98).toFixed(2)}π`}
            </button>
          ) : job.status === 'in_progress' ? (
            <PiworkButton variant="primary" fullWidth onClick={handleComplete} disabled={completing}>
              {completing ? 'Обработка...' : `Завершить — выплатить ${(job.budget * 0.98).toFixed(2)}π`}
            </PiworkButton>
          ) : job.status === 'completed' ? (
            <div style={{ textAlign: 'center', color: '#22C55E', fontWeight: 600, padding: 12 }}>
              ✓ Задача завершена · оплата отправлена
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: PIWORK_THEME.colors.textSecondary, fontSize: 13, padding: 8 }}>
              Выберите исполнителя во вкладке «Отклики»
            </div>
          )
        ) : isHiredFreelancer ? (
          job.status === 'in_progress' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <PiworkButton variant="primary" fullWidth onClick={handleSubmitWork} disabled={submitting}>
                {submitting ? 'Отправляем...' : 'Сдать работу на проверку'}
              </PiworkButton>
              <div style={{ textAlign: 'center', fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>
                После принятия вы получите {(job.budget * 0.98).toFixed(2)}π (комиссия 2%)
              </div>
            </div>
          ) : job.status === 'submitted' ? (
            <div style={{
              textAlign: 'center', padding: 12,
              backgroundColor: '#3B82F620', borderRadius: PIWORK_THEME.radius.md,
              color: '#3B82F6', fontWeight: 600, fontSize: 14,
            }}>
              ⏳ Ожидаем подтверждения заказчика
            </div>
          ) : job.status === 'completed' ? (
            <div style={{ textAlign: 'center', color: '#22C55E', fontWeight: 600, padding: 12 }}>
              ✅ {(job.budget * 0.98).toFixed(2)}π зачислено на счёт
            </div>
          ) : null
        ) : (
          // Non-hired freelancer
          applySuccess || myApplication?.status === 'accepted' ? (
            <div style={{
              textAlign: 'center', padding: 12,
              backgroundColor: myApplication?.status === 'accepted' ? '#22C55E20' : '#8B5CF620',
              borderRadius: PIWORK_THEME.radius.md,
              color: myApplication?.status === 'accepted' ? '#22C55E' : PIWORK_THEME.colors.primary,
              fontWeight: 600, fontSize: 14,
            }}>
              {myApplication?.status === 'accepted' ? '🎉 Вас выбрали исполнителем!' : '✓ Отклик отправлен'}
            </div>
          ) : alreadyApplied ? (
            <div style={{ textAlign: 'center', padding: 12, color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>
              Вы уже откликнулись на эту задачу
            </div>
          ) : job.status === 'open' ? (
            <PiworkButton variant="primary" fullWidth onClick={() => setShowApplyForm(true)}>
              Откликнуться ({job.apply_cost || 1} коннект)
            </PiworkButton>
          ) : (
            <div style={{ textAlign: 'center', padding: 12, color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>
              Задача {job.status === 'in_progress' ? 'в работе' : 'завершена'}
            </div>
          )
        )}
      </div>

      {/* Dispute modal */}
      {showDisputeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: PIWORK_THEME.colors.overlay, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowDisputeModal(false)}>
          <div style={{
            width: '100%', backgroundColor: PIWORK_THEME.colors.bgSecondary,
            borderRadius: `${PIWORK_THEME.radius.xl}px ${PIWORK_THEME.radius.xl}px 0 0`,
            padding: PIWORK_THEME.spacing.lg, paddingBottom: 32,
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: 8, color: '#F59E0B' }}>
              Открыть спор
            </h2>
            <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, marginBottom: PIWORK_THEME.spacing.lg }}>
              Опишите проблему. Средства в эскроу будут заморожены до разрешения спора.
            </p>
            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Опишите ситуацию подробно..."
              rows={4}
              style={{
                width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
                color: PIWORK_THEME.colors.textPrimary, fontSize: 14, resize: 'none',
                boxSizing: 'border-box', outline: 'none', marginBottom: PIWORK_THEME.spacing.md,
              }}
            />
            <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
              <button onClick={() => setShowDisputeModal(false)} style={{
                flex: 1, padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
                border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md,
                color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 14,
              }}>Отмена</button>
              <button
                onClick={handleOpenDispute}
                disabled={!disputeReason.trim() || submittingDispute}
                style={{
                  flex: 2, padding: PIWORK_THEME.spacing.md,
                  backgroundColor: disputeReason.trim() ? '#F59E0B' : PIWORK_THEME.colors.disabled,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: disputeReason.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 14, fontWeight: 600,
                }}>
                {submittingDispute ? 'Отправляем...' : 'Открыть спор'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRatingModal && ratingTarget && (
        <RatingModal
          toUserId={ratingTarget.id}
          toUserName={ratingTarget.name}
          jobId={job!.id}
          onClose={() => setShowRatingModal(false)}
          onSubmitted={() => setShowRatingModal(false)}
        />
      )}

      <BottomNavigation />
    </div>
  );
}
