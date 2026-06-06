'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getUser, updateUser, getConnectsBalance, getMyApplications, getJobs } from '@/lib/workpro-api';

type ProfileTab = 'info' | 'jobs' | 'applications';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [connects, setConnects] = useState(0);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ bio: '', skills: '', availability: 'available' });

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    if (!currentUserId) { router.push('/login'); return; }
    Promise.all([
      getUser(currentUserId),
      getConnectsBalance(),
      getMyApplications(),
      getJobs({ page: 1, limit: 50 }),
    ]).then(([userData, { balance }, appsData, jobsData]) => {
      setUser(userData);
      setConnects(balance);
      setMyApplications((appsData as any).applications || []);
      const postedJobs = (jobsData.jobs || []).filter((j: any) => j.posted_by === currentUserId);
      setMyJobs(postedJobs);
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
    open: { label: 'Открыта', color: '#8B5CF6' },
    in_progress: { label: 'В работе', color: '#F59E0B' },
    completed: { label: 'Завершена', color: '#22C55E' },
  };

  const appStatusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: 'Ожидает', color: PIWORK_THEME.colors.textSecondary },
    accepted: { label: '✓ Принят', color: '#22C55E' },
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
    { key: 'info', label: 'Профиль' },
    { key: 'jobs', label: `Задачи (${myJobs.length})` },
    { key: 'applications', label: `Отклики (${myApplications.length})` },
  ];

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
        {user?.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#F59E0B' }}>★</span>
            <span style={{ fontWeight: 600 }}>{user.rating}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, backgroundColor: PIWORK_THEME.colors.border,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        {[
          { label: 'Connects', value: connects },
          { label: 'Задач', value: myJobs.length },
          { label: 'Выполнено', value: user?.total_jobs_completed || 0 },
        ].map(({ label, value }) => (
          <div key={label} style={{
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            padding: `${PIWORK_THEME.spacing.md}px`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{value}</div>
            <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
      }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, padding: `${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.sm}px`,
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
        {/* Profile info tab */}
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

            <button onClick={handleLogout} style={{
              width: '100%', marginTop: 8,
              padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
              border: `1px solid #EF4444`, borderRadius: PIWORK_THEME.radius.md,
              color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}>
              Выйти из аккаунта
            </button>
          </div>
        )}

        {/* My jobs tab */}
        {activeTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {myJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl }}>
                <p style={{ color: PIWORK_THEME.colors.textSecondary, marginBottom: 16 }}>У вас ещё нет задач</p>
                <button onClick={() => router.push('/create')} style={{
                  padding: '12px 24px', backgroundColor: PIWORK_THEME.colors.primary,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                }}>
                  Создать задачу
                </button>
              </div>
            ) : (
              myJobs.map((job: any) => {
                const statusInfo = jobStatusLabel[job.status] || { label: job.status, color: PIWORK_THEME.colors.textSecondary };
                return (
                  <div key={job.id}
                    onClick={() => router.push(`/task/${job.id}`)}
                    style={{
                      backgroundColor: PIWORK_THEME.colors.bgSecondary,
                      border: `1px solid ${PIWORK_THEME.colors.border}`,
                      borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, flex: 1, marginRight: 8 }}>{job.title}</h3>
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusInfo.color, whiteSpace: 'nowrap' }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: PIWORK_THEME.colors.textSecondary }}>
                      <span>{job.budget}π</span>
                      <span>{job.applications} откликов</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* My applications tab */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {myApplications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl }}>
                <p style={{ color: PIWORK_THEME.colors.textSecondary, marginBottom: 16 }}>Вы ещё не откликались на задачи</p>
                <button onClick={() => router.push('/feed')} style={{
                  padding: '12px 24px', backgroundColor: PIWORK_THEME.colors.primary,
                  border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                }}>
                  Найти задачи
                </button>
              </div>
            ) : (
              myApplications.map((app: any) => {
                const statusInfo = appStatusLabel[app.status] || { label: app.status, color: PIWORK_THEME.colors.textSecondary };
                return (
                  <div key={app.id}
                    onClick={() => router.push(`/task/${app.job_id}`)}
                    style={{
                      backgroundColor: PIWORK_THEME.colors.bgSecondary,
                      border: `1px solid ${app.status === 'accepted' ? '#22C55E' : PIWORK_THEME.colors.border}`,
                      borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, flex: 1, marginRight: 8 }}>{app.job_title || `Задача #${app.job_id}`}</h3>
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusInfo.color, whiteSpace: 'nowrap' }}>
                        {statusInfo.label}
                      </span>
                    </div>
                    {app.message && (
                      <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                        {app.message}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
