'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getUser, getUserReviews, getUserPortfolio, startDirectChat } from '@/lib/workpro-api';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'portfolio'>('info');

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  // Redirect to own profile
  useEffect(() => {
    if (userId === currentUserId) { router.replace('/profile'); return; }
    Promise.all([
      getUser(userId),
      getUserReviews(userId),
      getUserPortfolio(userId),
    ]).then(([u, reviewData, portData]) => {
      setUser(u);
      setReviews((reviewData as any).reviews || []);
      setPortfolio((portData as any).items || []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [userId]);

  const handleStartChat = async () => {
    if (!currentUserId || !user) return;
    setStartingChat(true);
    setChatError(null);
    try {
      const result = await startDirectChat(userId);
      const roomId = (result as any).id || (result as any).conversation?.id;
      if (roomId) router.push(`/chat/${roomId}`);
    } catch (e: any) {
      setChatError(e.message || 'Не удалось открыть чат');
    } finally { setStartingChat(false); }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <div style={{ color: PIWORK_THEME.colors.textSecondary }}>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PIWORK_THEME.colors.bgPrimary }}>
        <p style={{ color: PIWORK_THEME.colors.textSecondary }}>Профиль не найден</p>
        <button onClick={() => router.back()} style={{ color: PIWORK_THEME.colors.primary, background: 'none', border: 'none', cursor: 'pointer', marginTop: 16, fontSize: 16 }}>← Назад</button>
      </div>
    );
  }

  const tabs = [
    { key: 'info' as const, label: 'Профиль' },
    { key: 'reviews' as const, label: `Отзывы${reviews.length > 0 ? ` (${reviews.length})` : ''}` },
    { key: 'portfolio' as const, label: 'Портфолио' },
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
        display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'transparent', border: 'none',
          color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
        }}>←</button>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h2.fontSize, fontWeight: 700, margin: 0, flex: 1 }}>
          {user.username}
        </h1>
      </header>

      {/* Avatar + name + stats */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: PIWORK_THEME.spacing.lg, paddingBottom: PIWORK_THEME.spacing.md,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: PIWORK_THEME.colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 12,
        }}>
          {user.avatar || '👤'}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{user.username}</h2>
        <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: '4px 0 8px' }}>
          🔧 Фрилансер / Заказчик
        </p>

        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ color: '#F59E0B' }}>★</span>
            <span style={{ fontWeight: 600 }}>{avgRating}</span>
            <span style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary }}>({reviews.length} отзывов)</span>
          </div>
        )}

        {/* Availability badge */}
        <span style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: PIWORK_THEME.radius.md, fontSize: 13, fontWeight: 600,
          backgroundColor: user.availability === 'available' ? '#22C55E20' : user.availability === 'busy' ? '#F59E0B20' : PIWORK_THEME.colors.bgPrimary,
          color: user.availability === 'available' ? '#22C55E' : user.availability === 'busy' ? '#F59E0B' : PIWORK_THEME.colors.textSecondary,
        }}>
          {user.availability === 'available' ? '● Доступен' : user.availability === 'busy' ? '● Занят' : '○ Не активен'}
        </span>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1,
        backgroundColor: PIWORK_THEME.colors.border,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
      }}>
        {[
          { label: 'Выполнено', value: user.total_jobs_completed || 0 },
          { label: 'Рейтинг', value: user.rating > 0 ? `${user.rating}★` : '—' },
          { label: 'Работ', value: portfolio.length },
        ].map(({ label, value }) => (
          <div key={label} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, padding: `${PIWORK_THEME.spacing.md}px`, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{value}</div>
            <div style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${PIWORK_THEME.colors.border}`, backgroundColor: PIWORK_THEME.colors.bgSecondary }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            flex: 1, padding: `${PIWORK_THEME.spacing.md}px`,
            backgroundColor: 'transparent', border: 'none',
            color: activeTab === key ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.textSecondary,
            fontSize: 12, fontWeight: activeTab === key ? 700 : 500, cursor: 'pointer',
            borderBottom: activeTab === key ? `2px solid ${PIWORK_THEME.colors.primary}` : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      <main style={{ flex: 1, padding: PIWORK_THEME.spacing.md, overflowY: 'auto' }}>
        {activeTab === 'info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {user.bio ? (
              <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: PIWORK_THEME.colors.textSecondary, margin: 0, marginBottom: 8 }}>О себе</h3>
                <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{user.bio}</p>
              </div>
            ) : (
              <div style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px dashed ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.lg, textAlign: 'center' }}>
                <p style={{ color: PIWORK_THEME.colors.textSecondary, margin: 0, fontSize: 14 }}>Профиль не заполнен</p>
              </div>
            )}
            {user.skills && (
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
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>
                <p style={{ fontSize: 32, margin: 0, marginBottom: 8 }}>⭐</p>
                <p style={{ margin: 0 }}>Отзывов пока нет</p>
              </div>
            ) : (
              reviews.map((r: any) => (
                <div key={r.id} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.from_username || 'Пользователь'}</span>
                    <span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0, lineHeight: 1.5 }}>{r.comment}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
            {portfolio.length === 0 ? (
              <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, color: PIWORK_THEME.colors.textSecondary }}>
                <p style={{ fontSize: 32, margin: 0, marginBottom: 8 }}>🗂️</p>
                <p style={{ margin: 0 }}>Портфолио пусто</p>
              </div>
            ) : (
              portfolio.map((item: any) => (
                <div key={item.id} style={{ backgroundColor: PIWORK_THEME.colors.bgSecondary, border: `1px solid ${PIWORK_THEME.colors.border}`, borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0, marginBottom: 6 }}>{item.title}</h4>
                  {item.description && <p style={{ fontSize: 13, color: PIWORK_THEME.colors.textSecondary, margin: 0, lineHeight: 1.5, marginBottom: item.image_url ? 8 : 0 }}>{item.description}</p>}
                  {item.image_url && /^https?:\/\//.test(item.image_url) && (
                    <a href={item.image_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: PIWORK_THEME.colors.primary, textDecoration: 'none' }}>
                      Открыть ↗
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Start chat button */}
      {currentUserId && currentUserId !== userId && (
        <div style={{
          position: 'fixed', bottom: 64, left: 0, right: 0,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
        }}>
          {chatError && (
            <div style={{ marginBottom: 8, padding: '8px 12px', backgroundColor: '#EF444420', borderRadius: PIWORK_THEME.radius.md, color: '#EF4444', fontSize: 12 }}>
              {chatError}
            </div>
          )}
          <button
            onClick={handleStartChat}
            disabled={startingChat}
            style={{
              width: '100%', height: 48, backgroundColor: PIWORK_THEME.colors.primary,
              border: 'none', borderRadius: 12, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: startingChat ? 'not-allowed' : 'pointer',
              opacity: startingChat ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: 0.5,
            }}
          >
            {startingChat ? 'Открываем чат...' : '💬 Написать сообщение'}
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
