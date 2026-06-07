'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://workpro-api.onrender.com';

function apiAdmin(path: string, opts: RequestInit = {}) {
  const uid = (() => { try { return JSON.parse(localStorage.getItem('piUser') || 'null')?.uid; } catch { return null; } })();
  return fetch(`${API}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(uid ? { 'x-user-id': uid } : {}), ...(opts.headers as any || {}) },
  }).then(r => r.json());
}

type AdminTab = 'stats' | 'users' | 'jobs' | 'logs';

const TAB_LABELS: Record<AdminTab, string> = {
  stats: 'Статистика', users: 'Пользователи', jobs: 'Задачи', logs: 'Логи',
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('stats');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [grantingUser, setGrantingUser] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState(50);

  // Jobs
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobLoading, setJobLoading] = useState(false);

  // Logs
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const u = (() => { try { return JSON.parse(localStorage.getItem('piUser') || 'null'); } catch { return null; } })();
    if (!u?.uid) { router.replace('/login'); return; }
    if (u.role !== 'admin' && u.uid !== 'cherry19899' && u.uid !== 'pi_cherry19899') {
      router.replace('/feed'); return;
    }
    setIsAdmin(true);
    apiAdmin('/api/admin/stats').then(setStats).catch(() => {});
  }, []);

  const loadUsers = () => {
    setUserLoading(true);
    apiAdmin(`/api/admin/users${userSearch ? `?search=${encodeURIComponent(userSearch)}` : ''}`)
      .then(d => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setUserLoading(false));
  };

  const loadJobs = () => {
    setJobLoading(true);
    apiAdmin('/api/admin/jobs')
      .then(d => setJobs(d.jobs || []))
      .catch(() => {})
      .finally(() => setJobLoading(false));
  };

  const loadLogs = () => {
    setLogsLoading(true);
    apiAdmin('/api/admin/audit-logs')
      .then(d => setLogs(d.logs || []))
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'users') loadUsers();
    if (tab === 'jobs') loadJobs();
    if (tab === 'logs') loadLogs();
  }, [tab, isAdmin]);

  const blockUser = async (id: string, blocked: boolean) => {
    await apiAdmin(`/api/admin/users/${id}/${blocked ? 'unblock' : 'block'}`, { method: 'POST' });
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: !blocked } : u));
  };

  const grantConnects = async (userId: string) => {
    setGrantingUser(userId);
    await apiAdmin(`/api/admin/users/${userId}/grant-connects`, {
      method: 'POST', body: JSON.stringify({ amount: grantAmount }),
    });
    setGrantingUser(null);
    loadUsers();
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Удалить задачу?')) return;
    await apiAdmin(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const timeAgo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
    if (h < 1) return 'только что'; if (h < 24) return `${h}ч`; return `${Math.floor(h / 24)}д`;
  };

  if (isAdmin === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80 }}>
      <header style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, borderBottom: `1px solid ${PIWORK_THEME.colors.border}`, padding: `${PIWORK_THEME.spacing.md}px`, display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0 }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>👑 Админ-панель</h1>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${PIWORK_THEME.colors.border}`, backgroundColor: PIWORK_THEME.colors.bgSecondary, overflowX: 'auto' }}>
        {(Object.keys(TAB_LABELS) as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, minWidth: 80, padding: `${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.sm}px`,
            backgroundColor: 'transparent', border: 'none',
            color: tab === t ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.textSecondary,
            fontSize: 12, fontWeight: tab === t ? 700 : 500, cursor: 'pointer',
            borderBottom: tab === t ? `2px solid ${PIWORK_THEME.colors.primary}` : '2px solid transparent',
            whiteSpace: 'nowrap',
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.md, overflowY: 'auto' }}>

        {/* ── STATS ── */}
        {tab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {!stats ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: PIWORK_THEME.spacing.md }}>
                  {[
                    { label: 'Пользователи', value: stats.total_users, icon: '👤' },
                    { label: 'Задачи', value: stats.total_jobs, icon: '📋' },
                    { label: 'Отклики', value: stats.total_applications, icon: '✉️' },
                    { label: 'Эскроу', value: stats.total_escrows, icon: '🔒' },
                    { label: 'Платежи', value: stats.payments, icon: '💰' },
                    { label: 'Отзывы', value: stats.ratings, icon: '⭐' },
                    { label: 'Чаты', value: stats.chats, icon: '💬' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{value}</div>
                      <div style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => apiAdmin('/api/admin/stats').then(setStats)} style={{ padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent', border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md, color: PIWORK_THEME.colors.primary, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Обновить статистику
                </button>
              </>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.sm }}>
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadUsers()}
                placeholder="Поиск по имени или ID..."
                style={{ flex: 1, backgroundColor: PIWORK_THEME.colors.bgPrimary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md, color: PIWORK_THEME.colors.textPrimary, fontSize: 14, outline: 'none' }} />
              <button onClick={loadUsers} style={{ padding: `${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.lg}px`, backgroundColor: PIWORK_THEME.colors.primary, border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                Поиск
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: PIWORK_THEME.colors.textSecondary }}>
              <span>Выдать коннекты:</span>
              <select value={grantAmount} onChange={e => setGrantAmount(Number(e.target.value))} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: 6, padding: '4px 8px', color: PIWORK_THEME.colors.textPrimary, fontSize: 12 }}>
                {[10, 25, 50, 100, 250].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {userLoading ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm }}>
                {users.map(u => (
                  <div key={u.id} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${u.is_blocked ? '#EF444440' : PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {u.username}
                          {u.role === 'admin' && <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>ADMIN</span>}
                          {u.is_blocked && <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>ЗАБЛОКИРОВАН</span>}
                        </div>
                        <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>
                          {u.id} · {u.balance_connects}🔗 · {u.balance_pi || 0}π · {timeAgo(u.created_at)}
                        </div>
                        <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>
                          Задач: {u.total_jobs_posted || 0} постил / {u.total_jobs_completed || 0} выполнил
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => grantConnects(u.id)} disabled={grantingUser === u.id}
                          style={{ padding: '6px 10px', backgroundColor: `${PIWORK_THEME.colors.primary}20`, border: 'none', borderRadius: 6, color: PIWORK_THEME.colors.primary, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                          {grantingUser === u.id ? '...' : `+${grantAmount}🔗`}
                        </button>
                        {u.id !== 'cherry19899' && u.id !== 'pi_cherry19899' && (
                          <button onClick={() => blockUser(u.id, u.is_blocked)}
                            style={{ padding: '6px 10px', backgroundColor: u.is_blocked ? '#22C55E20' : '#EF444420', border: 'none', borderRadius: 6, color: u.is_blocked ? '#22C55E' : '#EF4444', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                            {u.is_blocked ? 'Разблок' : 'Блок'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && !userLoading && (
                  <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Нет пользователей</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── JOBS ── */}
        {tab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary }}>{jobs.length} задач</span>
              <button onClick={loadJobs} style={{ fontSize: 12, color: PIWORK_THEME.colors.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Обновить</button>
            </div>
            {jobLoading ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
            ) : jobs.map(j => (
              <div key={j.id} onClick={() => router.push(`/task/${j.id}`)} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, marginRight: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{j.title}</div>
                    <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>
                      {j.posted_by_name || j.posted_by} · {j.budget}π · {j.status} · {timeAgo(j.created_at)}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteJob(j.id); }} style={{ padding: '4px 8px', backgroundColor: '#EF444420', border: 'none', borderRadius: 6, color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && !jobLoading && (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Нет задач</div>
            )}
          </div>
        )}

        {/* ── LOGS ── */}
        {tab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary }}>{logs.length} записей</span>
              <button onClick={loadLogs} style={{ fontSize: 12, color: PIWORK_THEME.colors.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Обновить</button>
            </div>
            {logsLoading ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
            ) : logs.map((log: any) => (
              <div key={log.id} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.sm }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.primary }}>{log.action}</span>
                  <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>{timeAgo(log.created_at)}</span>
                </div>
                <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2, wordBreak: 'break-all' }}>
                  {typeof log.data === 'object' ? JSON.stringify(log.data) : log.data}
                </div>
              </div>
            ))}
            {logs.length === 0 && !logsLoading && (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>Нет логов</div>
            )}
          </div>
        )}

      </main>
      <BottomNavigation />
    </div>
  );
}
