'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { BuyConnectsModal } from '@/components/buy-connects-modal';
import {
  getUser, updateUser, getConnectsBalance,
  getMyApplications, getMyJobsAsFreelancer, getMyPostedJobs,
  getUserReviews, getUserPortfolio,
  addPortfolioItem, deletePortfolioItem, deleteJob,
} from '@/lib/workpro-api';

type ProfileTab = 'info' | 'orders' | 'reviews' | 'portfolio';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [connects, setConnects] = useState(0);
  const [myPostedJobs, setMyPostedJobs] = useState<any[]>([]);
  const [myFreelanceJobs, setMyFreelanceJobs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ bio: '', skills: '', availability: 'available' });
  const [showBuyConnects, setShowBuyConnects] = useState(false);

  // Portfolio form
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ title: '', description: '', url: '' });
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    if (!currentUserId) { router.push('/login'); return; }
    Promise.all([
      getUser(currentUserId),
      getConnectsBalance(),
      getMyApplications(),
      getMyJobsAsFreelancer(),
      getMyPostedJobs(),
      getUserReviews(currentUserId),
      getUserPortfolio(currentUserId),
    ]).then(([userData, { balance }, appsData, freelanceData, postedData, reviewsData, portfolioData]) => {
      setUser(userData);
      setConnects(balance);

      // Jobs posted by this user (as client)
      setMyPostedJobs((postedData as any).jobs || []);

      // Jobs where I'm the hired freelancer
      const fJobs = (freelanceData as any).jobs || [];
      const apps = (appsData as any).applications || [];
      if (fJobs.length > 0) {
        setMyFreelanceJobs(fJobs);
      } else {
        setMyFreelanceJobs(apps.filter((a: any) => a.status === 'accepted'));
      }

      setReviews((reviewsData as any).reviews || []);
      setPortfolioItems((portfolioData as any).items || []);
      setEditData({ bio: userData.bio || '', skills: userData.skills || '', availability: userData.availability || 'available' });
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [currentUserId]);

  const handleSave = async () => {
    if (!currentUserId) return;
    setSaving(true);
    try {
      const updated = await updateUser(currentUserId, editData);
      setUser((prev: any) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (_) {} finally { setSaving(false); }
  };

  const handleAddPortfolio = async () => {
    if (!portfolioForm.title.trim()) return;
    setSavingPortfolio(true);
    try {
      const result = await addPortfolioItem({
        title: portfolioForm.title.trim(),
        description: portfolioForm.description.trim() || undefined,
        url: portfolioForm.url.trim() || undefined,
      });
      setPortfolioItems((prev) => [...prev, (result as any).item || result]);
      setPortfolioForm({ title: '', description: '', url: '' });
      setShowPortfolioForm(false);
    } catch (_) {} finally { setSavingPortfolio(false); }
  };

  const handleDeletePortfolio = async (itemId: number) => {
    try {
      await deletePortfolioItem(itemId);
      setPortfolioItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (_) {}
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить задачу?')) return;
    try {
      await deleteJob(jobId);
      setMyPostedJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (_) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('piUser');
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const inputStyle = {
    width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
    border: `1px solid ${PIWORK_THEME.colors.border}`,
    borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
    color: PIWORK_THEME.colors.textPrimary, fontSize: 14,
    boxSizing: 'border-box' as const, outline: 'none',
  };

  const jobStatusLabel: Record<string, { label: string; color: string }> = {
    open:        { label: 'Открыта', color: '#8B5CF6' },
    in_progress: { label: 'В работе', color: '#F59E0B' },
    submitted:   { label: 'На проверке', color: '#3B82F6' },
    completed:   { label: 'Завершена', color: '#22C55E' },
  };

  const appStatusLabel: Record<string, { label: string; color: string }> = {
    pending:  { label: 'Ожидает', color: PIWORK_THEME.colors.textSecondary },
    accepted: { label: '✓ Выбран', color: '#22C55E' },
    rejected: { label: 'Отклонён', color: '#EF4444' },
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <div style={{ color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
      </div>
    );
  }

  const tabs: { key: ProfileTab; label: string }[] = [
    { key: 'info',      label: 'Профиль' },
    { key: 'orders',    label: 'Заказы' },
    { key: 'reviews',   label: `Отзывы${reviews.length > 0 ? ` (${reviews.length})` : ''}` },
    { key: 'portfolio', label: 'Портфолио' },
  ];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

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
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>Профиль</h1>
        {activeTab === 'info' && (
          <button onClick={() => editing ? setEditing(false) : setEditing(true)} style={{
            backgroundColor: editing ? 'transparent' : PIWORK_THEME.colors.primary,
            border: editing ? `1px solid ${PIWORK_THEME.colors.border}` : 'none',
            color: editing ? PIWORK_THEME.colors.textSecondary : '#fff',
            padding: '8px 16px', borderRadius: PIWORK_THEME.radius.md,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            {editing ? 'Отмена' : 'Изменить'}
          </button>
        )}
        {activeTab === 'portfolio' && !showPortfolioForm && (
          <button onClick={() => setShowPortfolioForm(true)} style={{
            backgroundColor: PIWORK_THEME.colors.primary,
            border: 'none', color: '#fff',
            padding: '8px 16px', borderRadius: PIWORK_THEME.radius.md,
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            + Добавить
          </button>
        )}
      </header>

      {/* Avatar & Name */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: PIWORK_THEME.spacing.lg, paddingBottom: PIWORK_THEME.spacing.md,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: PIWORK_THEME.colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 12,
        }}>
          {user?.avatar || '👤'}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{user?.username}</h2>
        <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: '4px 0 8px' }}>
          {user?.role === 'admin' ? '👑 Администратор' : '🔧 Фрилансер / Заказчик'}
        </p>
        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#F59E0B' }}>★</span>
            <span style={{ fontWeight: 600 }}>{avgRating}</span>
            <span style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary }}>({reviews.length} отзывов)</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, backgroundColor: PIWORK_THEME.colors.border,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        {/* Connects — clickable to buy */}
        <button
          onClick={() => setShowBuyConnects(true)}
          style={{
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            padding: `${PIWORK_THEME.spacing.md}px`, textAlign: 'center',
            border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{connects}</div>
          <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>
            Connects <span style={{ fontSize: 9, color: PIWORK_THEME.colors.primary }}>+ купить</span>
          </div>
        </button>

        <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, padding: `${PIWORK_THEME.spacing.md}px`, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{user?.total_jobs_completed || 0}</div>
          <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>Выполнено</div>
        </div>

        <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, padding: `${PIWORK_THEME.spacing.md}px`, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{user?.balance_pi || 0}</div>
          <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>Заработано π</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        overflowX: 'auto',
      }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, minWidth: 80,
            padding: `${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.sm}px`,
            backgroundColor: 'transparent', border: 'none',
            color: activeTab === key ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.textSecondary,
            fontSize: 12, fontWeight: activeTab === key ? 700 : 500, cursor: 'pointer',
            borderBottom: activeTab === key ? `2px solid ${PIWORK_THEME.colors.primary}` : '2px solid transparent',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </button>
        ))}
      </div>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.md, overflowY: 'auto' }}>

        {/* ── INFO TAB ── */}
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {editing ? (
              <>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>О себе</label>
                  <textarea value={editData.bio} onChange={(e) => setEditData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Расскажите о своём опыте..." rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>Навыки (через запятую)</label>
                  <input type="text" value={editData.skills} onChange={(e) => setEditData((p) => ({ ...p, skills: e.target.value }))}
                    placeholder="Figma, JavaScript, копирайтинг..." style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>Доступность</label>
                  <select value={editData.availability} onChange={(e) => setEditData((p) => ({ ...p, availability: e.target.value }))} style={inputStyle}>
                    <option value="available">Доступен</option>
                    <option value="busy">Занят</option>
                    <option value="away">Не активен</option>
                  </select>
                </div>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: PIWORK_THEME.spacing.md, backgroundColor: PIWORK_THEME.colors.primary,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600,
                  opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? 'Сохраняем...' : 'Сохранить'}
                </button>
              </>
            ) : (
              <>
                {user?.bio ? (
                  <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 8 }}>О себе</h3>
                    <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{user.bio}</p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px dashed ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg, textAlign: 'center',
                  }}>
                    <p style={{ color: PIWORK_THEME.colors.textSecondary, margin: 0, fontSize: 14 }}>
                      Расскажите о себе — это поможет заказчикам выбрать вас
                    </p>
                    <button onClick={() => setEditing(true)} style={{
                      marginTop: 12, padding: '8px 20px', backgroundColor: PIWORK_THEME.colors.primary,
                      border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    }}>
                      Заполнить профиль
                    </button>
                  </div>
                )}

                {user?.skills && (
                  <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 8 }}>Навыки</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {user.skills.split(',').map((s: string) => (
                        <span key={s} style={{ padding: '4px 10px', backgroundColor: `${PIWORK_THEME.colors.primary}20`, color: PIWORK_THEME.colors.primary, borderRadius: PIWORK_THEME.radius.sm, fontSize: 13 }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 8 }}>Доступность</h3>
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: PIWORK_THEME.radius.md, fontSize: 13, fontWeight: 600,
                    backgroundColor: user?.availability === 'available' ? '#22C55E20' : user?.availability === 'busy' ? '#F59E0B20' : `${PIWORK_THEME.colors.border}`,
                    color: user?.availability === 'available' ? '#22C55E' : user?.availability === 'busy' ? '#F59E0B' : PIWORK_THEME.colors.textSecondary,
                  }}>
                    {user?.availability === 'available' ? '● Доступен' : user?.availability === 'busy' ? '● Занят' : '○ Не активен'}
                  </span>
                </div>
              </>
            )}

            {user?.role === 'admin' && (
              <button onClick={() => router.push('/admin')} style={{
                width: '100%', padding: PIWORK_THEME.spacing.md,
                backgroundColor: '#F59E0B20', border: `1px solid #F59E0B`,
                borderRadius: PIWORK_THEME.radius.md, color: '#F59E0B',
                cursor: 'pointer', fontSize: 14, fontWeight: 700,
              }}>
                👑 Админ-панель
              </button>
            )}

            <button onClick={() => router.push('/settings')} style={{
              width: '100%', padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
              border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md,
              color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 14,
            }}>
              Настройки
            </button>

            <button onClick={handleLogout} style={{
              width: '100%', padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
              border: `1px solid #EF4444`, borderRadius: PIWORK_THEME.radius.md,
              color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              Выйти из аккаунта
            </button>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.lg }}>
            {/* As client */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: PIWORK_THEME.spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Мои задачи (как заказчик)
              </h3>
              {myPostedJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, backgroundColor: PIWORK_THEME.colors.bgSecondary, borderRadius: PIWORK_THEME.radius.lg }}>
                  <p style={{ color: PIWORK_THEME.colors.textSecondary, marginBottom: 12, margin: '0 0 12px' }}>Нет активных задач</p>
                  <button onClick={() => router.push('/create')} style={{
                    padding: '10px 20px', backgroundColor: PIWORK_THEME.colors.primary,
                    border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>
                    Создать задачу
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm }}>
                  {myPostedJobs.map((job: any) => {
                    const st = jobStatusLabel[job.status] || { label: job.status, color: PIWORK_THEME.colors.textSecondary };
                    return (
                      <div key={job.id} onClick={() => router.push(`/task/${job.id}`)} style={{
                        backgroundColor: PIWORK_THEME.colors.bgSecondary,
                        border: `1px solid ${PIWORK_THEME.colors.border}`,
                        borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md, cursor: 'pointer',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, flex: 1, marginRight: 8 }}>{job.title}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                            {job.status === 'open' && (
                              <button
                                onClick={(e) => handleDeleteJob(job.id, e)}
                                style={{
                                  backgroundColor: 'transparent', border: 'none',
                                  color: '#EF4444', cursor: 'pointer', fontSize: 16, padding: '0 2px', lineHeight: 1,
                                }}
                              >🗑</button>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: PIWORK_THEME.colors.textSecondary }}>
                          <span>{job.budget}π</span>
                          <span>{job.applications} откликов</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* As freelancer */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: PIWORK_THEME.spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Моя работа (как фрилансер)
              </h3>
              {myFreelanceJobs.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: PIWORK_THEME.spacing.xl,
                  backgroundColor: PIWORK_THEME.colors.bgSecondary, borderRadius: PIWORK_THEME.radius.lg,
                }}>
                  <p style={{ color: PIWORK_THEME.colors.textSecondary, margin: '0 0 12px' }}>
                    Пока нет активных проектов
                  </p>
                  <button onClick={() => router.push('/feed')} style={{
                    padding: '10px 20px', backgroundColor: PIWORK_THEME.colors.primary,
                    border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>
                    Найти задачи
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm }}>
                  {myFreelanceJobs.map((item: any) => {
                    const jobId = item.job_id || item.id;
                    const title = item.job_title || item.title || `Задача #${jobId}`;
                    const status = item.job_status || item.status;
                    const st = jobStatusLabel[status] || appStatusLabel[status] || { label: status, color: PIWORK_THEME.colors.textSecondary };
                    return (
                      <div key={item.id} onClick={() => router.push(`/task/${jobId}`)} style={{
                        backgroundColor: PIWORK_THEME.colors.bgSecondary,
                        border: `1px solid ${status === 'in_progress' || status === 'submitted' ? '#F59E0B40' : PIWORK_THEME.colors.border}`,
                        borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md, cursor: 'pointer',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, flex: 1, marginRight: 8 }}>{title}</h4>
                          <span style={{ fontSize: 12, fontWeight: 700, color: st.color, whiteSpace: 'nowrap' }}>{st.label}</span>
                        </div>
                        {item.budget && (
                          <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, margin: '6px 0 0' }}>{item.budget}π</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {reviews.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: PIWORK_THEME.spacing.xl,
                backgroundColor: PIWORK_THEME.colors.bgSecondary, borderRadius: PIWORK_THEME.radius.lg,
              }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>⭐</p>
                <p style={{ color: PIWORK_THEME.colors.textSecondary, margin: 0, fontSize: 14 }}>
                  Отзывов пока нет. Выполните задачи, чтобы получить первые отзывы.
                </p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
                  display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.lg,
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{avgRating}</div>
                    <div style={{ color: '#F59E0B', fontSize: 20, letterSpacing: 2 }}>
                      {'★'.repeat(Math.round(parseFloat(avgRating || '0')))}{'☆'.repeat(5 - Math.round(parseFloat(avgRating || '0')))}
                    </div>
                    <div style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, marginTop: 4 }}>{reviews.length} отзывов</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r) => r.rating === star).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, minWidth: 12 }}>{star}</span>
                          <span style={{ color: '#F59E0B', fontSize: 12 }}>★</span>
                          <div style={{ flex: 1, height: 6, backgroundColor: PIWORK_THEME.colors.bgPrimary, borderRadius: 3 }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, minWidth: 20 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review list */}
                {reviews.map((review: any) => (
                  <div key={review.id} style={{
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{review.from_username || review.reviewer_name || 'Пользователь'}</span>
                      <span style={{ color: '#F59E0B', fontSize: 16 }}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0, lineHeight: 1.5 }}>
                        {review.comment}
                      </p>
                    )}
                    {review.job_title && (
                      <p style={{ fontSize: 11, color: PIWORK_THEME.colors.textTertiary, margin: '6px 0 0' }}>
                        Задача: {review.job_title}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── PORTFOLIO TAB ── */}
        {activeTab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {showPortfolioForm && (
              <div style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.primary}`,
                borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>
                  Новая работа
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 6 }}>
                      Название *
                    </label>
                    <input
                      type="text"
                      value={portfolioForm.title}
                      onChange={(e) => setPortfolioForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Название проекта или работы"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 6 }}>
                      Описание
                    </label>
                    <textarea
                      value={portfolioForm.description}
                      onChange={(e) => setPortfolioForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Что вы сделали, какие технологии использовали..."
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 6 }}>
                      Ссылка
                    </label>
                    <input
                      type="url"
                      value={portfolioForm.url}
                      onChange={(e) => setPortfolioForm((p) => ({ ...p, url: e.target.value }))}
                      placeholder="https://..."
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
                    <button onClick={() => { setShowPortfolioForm(false); setPortfolioForm({ title: '', description: '', url: '' }); }} style={{
                      flex: 1, padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
                      border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md,
                      color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 14,
                    }}>
                      Отмена
                    </button>
                    <button
                      onClick={handleAddPortfolio}
                      disabled={!portfolioForm.title.trim() || savingPortfolio}
                      style={{
                        flex: 2, padding: PIWORK_THEME.spacing.md,
                        backgroundColor: portfolioForm.title.trim() ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.disabled,
                        border: 'none', borderRadius: PIWORK_THEME.radius.md,
                        color: '#fff', cursor: portfolioForm.title.trim() ? 'pointer' : 'not-allowed',
                        fontSize: 14, fontWeight: 600,
                      }}
                    >
                      {savingPortfolio ? 'Сохраняем...' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {portfolioItems.length === 0 && !showPortfolioForm ? (
              <div style={{
                textAlign: 'center', padding: PIWORK_THEME.spacing.xl,
                backgroundColor: PIWORK_THEME.colors.bgSecondary, borderRadius: PIWORK_THEME.radius.lg,
              }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🗂️</p>
                <p style={{ color: PIWORK_THEME.colors.textSecondary, margin: '0 0 16px', fontSize: 14 }}>
                  Портфолио пусто. Добавьте примеры работ, чтобы заказчики могли оценить ваш опыт.
                </p>
                <button onClick={() => setShowPortfolioForm(true)} style={{
                  padding: '10px 24px', backgroundColor: PIWORK_THEME.colors.primary,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>
                  Добавить работу
                </button>
              </div>
            ) : (
              portfolioItems.map((item: any) => (
                <div key={item.id} style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, flex: 1, marginRight: 8 }}>{item.title}</h4>
                    <button onClick={() => handleDeletePortfolio(item.id)} style={{
                      background: 'none', border: 'none', color: '#EF4444',
                      cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1,
                    }}>×</button>
                  </div>
                  {item.description && (
                    <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0, lineHeight: 1.5, marginBottom: item.url ? 8 : 0 }}>
                      {item.description}
                    </p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12, color: PIWORK_THEME.colors.primary,
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      Открыть ↗
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {showBuyConnects && (
        <BuyConnectsModal
          currentBalance={connects}
          onClose={() => setShowBuyConnects(false)}
          onSuccess={(added) => setConnects((prev) => prev + added)}
        />
      )}

      <BottomNavigation />
    </div>
  );
}
