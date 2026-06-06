'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getUser, updateUser, getConnectsBalance } from '@/lib/workpro-api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [connects, setConnects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
    ]).then(([userData, { balance }]) => {
      setUser(userData);
      setConnects(balance);
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
    router.push('/login');
  };

  const inputStyle = {
    width: '100%', backgroundColor: PIWORK_THEME.colors.bgPrimary,
    border: `1px solid ${PIWORK_THEME.colors.border}`,
    borderRadius: PIWORK_THEME.radius.md, padding: PIWORK_THEME.spacing.md,
    color: PIWORK_THEME.colors.textPrimary, fontSize: 14,
    boxSizing: 'border-box' as const, outline: 'none',
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <div style={{ color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
      </div>
    );
  }

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
      }}>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>Профиль</h1>
        <button onClick={() => editing ? setEditing(false) : setEditing(true)} style={{
          backgroundColor: editing ? 'transparent' : PIWORK_THEME.colors.primary,
          border: editing ? `1px solid ${PIWORK_THEME.colors.border}` : 'none',
          color: editing ? PIWORK_THEME.colors.textSecondary : '#fff',
          padding: '8px 16px', borderRadius: PIWORK_THEME.radius.md,
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          {editing ? 'Отмена' : 'Изменить'}
        </button>
      </header>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.md, overflowY: 'auto' }}>
        {/* Avatar & Name */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: PIWORK_THEME.spacing.lg, marginBottom: PIWORK_THEME.spacing.md,
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            backgroundColor: PIWORK_THEME.colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: PIWORK_THEME.spacing.md,
          }}>
            {user?.avatar || '👤'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{user?.username}</h2>
          <p style={{ fontSize: 14, color: PIWORK_THEME.colors.textSecondary, margin: '4px 0' }}>
            {user?.role === 'admin' ? '👑 Администратор' : '🔧 Фрилансер'}
          </p>
          {user?.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <span style={{ color: '#F59E0B' }}>★</span>
              <span style={{ fontWeight: 600 }}>{user.rating}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: PIWORK_THEME.spacing.md, marginBottom: PIWORK_THEME.spacing.md,
        }}>
          {[
            { label: 'Connects', value: connects },
            { label: 'Задач', value: user?.total_jobs_posted || 0 },
            { label: 'Выполнено', value: user?.total_jobs_completed || 0 },
          ].map(({ label, value }) => (
            <div key={label} style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{value}</div>
              <div style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Edit / View fields */}
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
                <label style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, display: 'block', marginBottom: 8 }}>Навыки</label>
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
              {user?.bio && (
                <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 8 }}>О себе</h3>
                  <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{user.bio}</p>
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
            </>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          width: '100%', marginTop: PIWORK_THEME.spacing.lg,
          padding: PIWORK_THEME.spacing.md, backgroundColor: 'transparent',
          border: `1px solid #EF4444`, borderRadius: PIWORK_THEME.radius.md,
          color: '#EF4444', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}>
          Выйти из аккаунта
        </button>
      </main>

      <BottomNavigation />
    </div>
  );
}
