'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://workpro-api.onrender.com';

function getUid(): string | null {
  try { return JSON.parse(localStorage.getItem('piUser') || 'null')?.uid || null; } catch { return null; }
}

async function apiAdmin(path: string, opts: RequestInit = {}): Promise<any> {
  const uid = getUid();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(uid ? { 'x-user-id': uid } : {}),
      ...(opts.headers as Record<string, string> || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
  return data;
}

type AdminTab = 'stats' | 'users' | 'jobs' | 'escrows' | 'logs';

const TAB_LABELS: Record<AdminTab, string> = {
  stats: 'Статистика', users: 'Пользователи', jobs: 'Задачи', escrows: 'Эскроу', logs: 'Логи',
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('stats');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [grantingUser, setGrantingUser] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState(50);

  const [jobs, setJobs] = useState<any[]>([]);
  const [jobLoading, setJobLoading] = useState(false);

  const [escrows, setEscrows] = useState<any[]>([]);
  const [escrowsLoading, setEscrowsLoading] = useState(false);

  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // ── Verify admin via API on mount ──────────────────────
  useEffect(() => {
    const uid = getUid();
    if (!uid) { router.replace('/login'); return; }

    fetch(`${API}/api/admin/stats`, {
      headers: { 'Content-Type': 'application/json', 'x-user-id': uid },
    })
      .then(async r => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'forbidden');
        return data;
      })
      .then(data => {
        setStats(data);
        setStatsLoading(false);
        setReady(true);
      })
      .catch(() => router.replace('/feed'));
  }, []);

  // ── Loaders ──────────────────────────────────────────────
  const loadStats = useCallback(() => {
    setStatsLoading(true);
    apiAdmin('/api/admin/stats')
      .then(d => { setStats(d); setStatsLoading(false); })
      .catch(e => { setError(e.message); setStatsLoading(false); });
  }, []);

  const loadUsers = useCallback((search = userSearch) => {
    setUserLoading(true);
    setError(null);
    apiAdmin(`/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(d => setUsers(d.users || []))
      .catch(e => { setError(e.message); setUsers([]); })
      .finally(() => setUserLoading(false));
  }, [userSearch]);

  const loadJobs = useCallback(() => {
    setJobLoading(true);
    setError(null);
    apiAdmin('/api/admin/jobs')
      .then(d => setJobs(d.jobs || []))
      .catch(e => { setError(e.message); setJobs([]); })
      .finally(() => setJobLoading(false));
  }, []);

  const loadEscrows = useCallback(() => {
    setEscrowsLoading(true);
    setError(null);
    apiAdmin('/api/admin/escrows')
      .then(d => setEscrows(d.escrows || []))
      .catch(e => { setError(e.message); setEscrows([]); })
      .finally(() => setEscrowsLoading(false));
  }, []);

  const loadLogs = useCallback(() => {
    setLogsLoading(true);
    setError(null);
    apiAdmin('/api/admin/audit-logs')
      .then(d => setLogs(d.logs || []))
      .catch(e => { setError(e.message); setLogs([]); })
      .finally(() => setLogsLoading(false));
  }, []);

  // ── Load tab data when tab changes ──────────────────────
  useEffect(() => {
    if (!ready) return;
    if (tab === 'stats') loadStats();
    if (tab === 'users') loadUsers();
    if (tab === 'jobs') loadJobs();
    if (tab === 'escrows') loadEscrows();
    if (tab === 'logs') loadLogs();
  }, [tab, ready]);

  // ── Actions ──────────────────────────────────────────────
  const blockUser = async (id: string, isBlocked: boolean) => {
    try {
      await apiAdmin(`/api/admin/users/${id}/${isBlocked ? 'unblock' : 'block'}`, { method: 'POST' });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: !isBlocked } : u));
    } catch (e: any) { setError(e.message); }
  };

  const toggleAdmin = async (id: string, isAdminRole: boolean) => {
    try {
      await apiAdmin(`/api/admin/users/${id}/${isAdminRole ? 'remove-admin' : 'make-admin'}`, { method: 'POST' });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: isAdminRole ? 'freelancer' : 'admin' } : u));
    } catch (e: any) { setError(e.message); }
  };

  const grantConnects = async (userId: string) => {
    setGrantingUser(userId);
    try {
      await apiAdmin(`/api/admin/users/${userId}/grant-connects`, {
        method: 'POST', body: JSON.stringify({ amount: grantAmount }),
      });
      loadUsers();
    } catch (e: any) { setError(e.message); }
    setGrantingUser(null);
  };

  const deleteJob = async (id: number) => {
    if (!confirm('Удалить задачу?')) return;
    try {
      await apiAdmin(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      setJobs(prev => prev.filter(j => j.id !== id));
    } catch (e: any) { setError(e.message); }
  };

  const timeAgo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
    if (h < 1) return 'только что';
    if (h < 24) return `${h}ч`;
    return `${Math.floor(h / 24)}д`;
  };

  // ── Loading screen ──────────────────────────────────────
  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textSecondary, fontSize: 14 }}>
        Проверка прав...
      </div>
    );
  }

  const C = PIWORK_THEME.colors;
  const S = PIWORK_THEME.spacing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: C.bgPrimary, color: C.textPrimary, paddingBottom: 80 }}>

      <header style={{ backgroundColor: C.bgSecondary, borderBottom: `1px solid ${C.border}`, padding: S.md, display: 'flex', alignItems: 'center', gap: S.md, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', color: C.primary, fontSize: 24, cursor: 'pointer', padding: 0 }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>👑 Админ-панель</h1>
      </header>

      {/* Error banner */}
      {error && (
        <div style={{ margin: `${S.sm}px ${S.md}px 0`, padding: '10px 14px', backgroundColor: '#EF444420', borderRadius: PIWORK_THEME.radius.md, color: '#EF4444', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, backgroundColor: C.bgSecondary, overflowX: 'auto' }}>
        {(Object.keys(TAB_LABELS) as AdminTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, minWidth: 80, padding: `${S.md}px ${S.sm}px`,
            backgroundColor: 'transparent', border: 'none',
            color: tab === t ? C.primary : C.textSecondary,
            fontSize: 12, fontWeight: tab === t ? 700 : 500, cursor: 'pointer',
            borderBottom: tab === t ? `2px solid ${C.primary}` : '2px solid transparent',
            whiteSpace: 'nowrap',
          }}>{TAB_LABELS[t]}</button>
        ))}
      </div>

      <main style={{ flex: 1, padding: S.md, overflowY: 'auto' }}>

        {/* ── STATS ── */}
        {tab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            {statsLoading ? (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Загрузка...</div>
            ) : stats ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.md }}>
                  {([
                    { label: 'Пользователи', value: stats.total_users ?? 0, icon: '👤' },
                    { label: 'Задачи',        value: stats.total_jobs ?? 0,  icon: '📋' },
                    { label: 'Отклики',       value: stats.total_applications ?? 0, icon: '✉️' },
                    { label: 'Эскроу',        value: stats.total_escrows ?? 0, icon: '🔒' },
                    { label: 'Платежи',       value: stats.payments ?? 0,    icon: '💰' },
                    { label: 'Отзывы',        value: stats.ratings ?? 0,     icon: '⭐' },
                    { label: 'Чаты',          value: stats.chats ?? 0,       icon: '💬' },
                  ] as { label: string; value: number; icon: string }[]).map(({ label, value, icon }) => (
                    <div key={label} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: S.lg, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: C.primary }}>{value}</div>
                      <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={loadStats} style={{ padding: S.md, backgroundColor: 'transparent', border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.md, color: C.primary, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Обновить статистику
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Нет данных</div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
            <div style={{ display: 'flex', gap: S.sm }}>
              <input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadUsers(userSearch)}
                placeholder="Поиск по имени или ID..."
                style={{ flex: 1, backgroundColor: C.bgPrimary, border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.md, padding: S.md, color: C.textPrimary, fontSize: 14, outline: 'none' }}
              />
              <button onClick={() => loadUsers(userSearch)} style={{ padding: `${S.md}px ${S.lg}px`, backgroundColor: C.primary, border: 'none', borderRadius: PIWORK_THEME.radius.md, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                Поиск
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.textSecondary }}>
              <span>Выдать коннекты:</span>
              <select value={grantAmount} onChange={e => setGrantAmount(Number(e.target.value))} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', color: C.textPrimary, fontSize: 12 }}>
                {[10, 25, 50, 100, 250].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {userLoading ? (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Загрузка...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
                {users.map(u => (
                  <div key={u.id} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${u.is_blocked ? '#EF444440' : C.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: S.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {u.username}
                          {u.role === 'admin' && <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>ADMIN</span>}
                          {u.is_blocked && <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>ЗАБЛОКИРОВАН</span>}
                        </div>
                        <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2, wordBreak: 'break-all' }}>
                          {u.id} · {u.balance_connects ?? 0}🔗 · {u.balance_pi ?? 0}π · {timeAgo(u.created_at)}
                        </div>
                        <div style={{ fontSize: 11, color: C.textSecondary }}>
                          Задач: {u.total_jobs_posted ?? 0} постил / {u.total_jobs_completed ?? 0} выполнил
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                        <button onClick={() => grantConnects(u.id)} disabled={grantingUser === u.id}
                          style={{ padding: '6px 10px', backgroundColor: `${C.primary}20`, border: 'none', borderRadius: 6, color: C.primary, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                          {grantingUser === u.id ? '...' : `+${grantAmount}🔗`}
                        </button>
                        {u.username !== 'cherry19899' && (
                          <>
                            <button onClick={() => toggleAdmin(u.id, u.role === 'admin')}
                              style={{ padding: '6px 10px', backgroundColor: u.role === 'admin' ? '#F59E0B20' : C.bgPrimary, border: `1px solid ${u.role === 'admin' ? '#F59E0B' : C.border}`, borderRadius: 6, color: u.role === 'admin' ? '#F59E0B' : C.textSecondary, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                              {u.role === 'admin' ? '👑 Снять' : '👑'}
                            </button>
                            <button onClick={() => blockUser(u.id, u.is_blocked)}
                              style={{ padding: '6px 10px', backgroundColor: u.is_blocked ? '#22C55E20' : '#EF444420', border: 'none', borderRadius: 6, color: u.is_blocked ? '#22C55E' : '#EF4444', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                              {u.is_blocked ? 'Разблок' : 'Блок'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && !userLoading && (
                  <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Нет пользователей</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── JOBS ── */}
        {tab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: C.textSecondary }}>{jobs.length} задач</span>
              <button onClick={loadJobs} style={{ fontSize: 12, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Обновить</button>
            </div>
            {jobLoading ? (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Загрузка...</div>
            ) : (
              <>
                {jobs.map(j => (
                  <div key={j.id} onClick={() => router.push(`/task/${j.id}`)} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: S.md, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, marginRight: 8, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{j.title}</div>
                        <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>
                          {j.posted_by_name || j.posted_by} · {j.budget}π · {j.status} · {timeAgo(j.created_at)}
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteJob(j.id); }}
                        style={{ padding: '4px 8px', backgroundColor: '#EF444420', border: 'none', borderRadius: 6, color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Нет задач</div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── ESCROWS ── */}
        {tab === 'escrows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: C.textSecondary }}>{escrows.length} эскроу</span>
              <button onClick={loadEscrows} style={{ fontSize: 12, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Обновить</button>
            </div>
            {escrowsLoading ? (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Загрузка...</div>
            ) : (
              <>
                {escrows.map((esc: any) => (
                  <div key={esc.id} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: S.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>#{esc.id}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                        backgroundColor: esc.status === 'funded' ? '#22C55E20' : esc.status === 'released' ? '#3B82F620' : esc.status === 'disputed' ? '#EF444420' : esc.status === 'refunded' ? '#F59E0B20' : `${C.border}`,
                        color: esc.status === 'funded' ? '#22C55E' : esc.status === 'released' ? '#3B82F6' : esc.status === 'disputed' ? '#EF4444' : esc.status === 'refunded' ? '#F59E0B' : C.textSecondary,
                      }}>{esc.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span>Задача: <span style={{ color: C.textPrimary }}>{esc.job_id}</span></span>
                      <span>Клиент: <span style={{ color: C.textPrimary }}>{esc.client_username || esc.client_id}</span></span>
                      <span>Фрилансер: <span style={{ color: C.textPrimary }}>{esc.freelancer_username || esc.freelancer_id}</span></span>
                      <span>Сумма: <span style={{ color: PIWORK_THEME.colors.accent, fontWeight: 700 }}>{esc.amount}π</span></span>
                      {esc.created_at && <span>Создан: {timeAgo(esc.created_at)}</span>}
                    </div>
                  </div>
                ))}
                {escrows.length === 0 && (
                  <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Нет эскроу</div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── LOGS ── */}
        {tab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: C.textSecondary }}>{logs.length} записей</span>
              <button onClick={loadLogs} style={{ fontSize: 12, color: C.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Обновить</button>
            </div>
            {logsLoading ? (
              <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Загрузка...</div>
            ) : (
              <>
                {logs.map((log: any) => (
                  <div key={log.id} style={{ backgroundColor: C.bgSecondary, border: `1px solid ${C.border}`, borderRadius: PIWORK_THEME.radius.md, padding: S.sm }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{log.action}</span>
                      <span style={{ fontSize: 11, color: C.textSecondary }}>{timeAgo(log.created_at)}</span>
                    </div>
                    {log.data && (
                      <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2, wordBreak: 'break-all' }}>
                        {typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data)}
                      </div>
                    )}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: S.xl, color: C.textSecondary }}>Нет логов</div>
                )}
              </>
            )}
          </div>
        )}

      </main>
      <BottomNavigation />
    </div>
  );
}
