'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getJobs, getNotifications, type Job } from '@/lib/workpro-api';

const categories = ['All', 'Design', 'Writing', 'Data', 'Audio', 'Video', 'Other'];
const CATEGORY_RU: Record<string, string> = {
  All: 'Все', Design: 'Дизайн', Writing: 'Тексты',
  Data: 'Данные', Audio: 'Аудио', Video: 'Видео', Other: 'Другое',
};
const PAGE_SIZE = 20;

export default function FeedPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadJobs = useCallback(async (search?: string, category?: string, pageNum = 1, append = false) => {
    if (pageNum === 1) setIsLoading(true); else setLoadingMore(true);
    setError(null);
    try {
      const result = await getJobs({
        status: 'open',
        search: search || undefined,
        category: (category && category !== 'All') ? category : undefined,
        page: pageNum,
        limit: PAGE_SIZE,
      });
      const newJobs = result.jobs || [];
      setJobs(append ? (prev) => [...prev, ...newJobs] : newJobs);
      setPage(pageNum);
      setHasMore(newJobs.length === PAGE_SIZE);
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  useEffect(() => {
    const fetchNotifCount = () => {
      const uid = (() => { try { return JSON.parse(localStorage.getItem('piUser') || 'null')?.uid; } catch { return null; } })();
      if (!uid) return;
      getNotifications().then(({ unread_count }) => setUnreadNotifs(unread_count || 0)).catch(() => {});
    };
    fetchNotifCount();
    const iv = setInterval(fetchNotifCount, 60000);
    return () => clearInterval(iv);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => loadJobs(value, selectedCategory), 400);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadJobs(searchQuery, category);
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await loadJobs(searchQuery, selectedCategory);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) loadJobs(searchQuery, selectedCategory, page + 1, true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0)
      touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      const d = e.touches[0].clientY - touchStartY.current;
      if (d > 0) { setPullDistance(Math.min(d, 100)); if (d > 80 && !refreshing) handleRefresh(); }
    }
  };
  const handleTouchEnd = () => setPullDistance(0);

  const timeAgo = (dateStr: string) => {
    const h = Math.floor((Date.now() - new Date(dateStr).getTime()) / 3600000);
    if (h < 1) return 'только что';
    if (h < 24) return `${h}ч назад`;
    return `${Math.floor(h / 24)}д назад`;
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80,
    }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: PIWORK_THEME.spacing.md }}>
          <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0 }}>Лента</h1>
          <button
            onClick={() => router.push('/notifications')}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 4 }}
          >
            🔔
            {unreadNotifs > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                minWidth: 16, height: 16, backgroundColor: '#EF4444',
                borderRadius: 8, fontSize: 9, fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${PIWORK_THEME.colors.bgSecondary}`, padding: '0 2px',
              }}>{unreadNotifs > 99 ? '99+' : unreadNotifs}</span>
            )}
          </button>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', height: 48,
          backgroundColor: PIWORK_THEME.colors.bgPrimary,
          border: `1px solid ${PIWORK_THEME.colors.border}`,
          borderRadius: PIWORK_THEME.radius.lg,
          paddingLeft: PIWORK_THEME.spacing.md, paddingRight: PIWORK_THEME.spacing.md,
          marginBottom: PIWORK_THEME.spacing.md,
        }}>
          <span style={{ fontSize: 18, marginRight: 8, color: PIWORK_THEME.colors.textSecondary }}>🔍</span>
          <input
            type="text" placeholder="Поиск задач..." value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              flex: 1, backgroundColor: 'transparent', border: 'none',
              color: PIWORK_THEME.colors.textPrimary, fontSize: PIWORK_THEME.typography.body.fontSize, outline: 'none',
            }}
          />
          {searchQuery && (
            <button onClick={() => handleSearchChange('')}
              style={{ background: 'none', border: 'none', color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 18 }}>
              ✕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.sm, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategoryChange(cat)} style={{
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              backgroundColor: selectedCategory === cat ? PIWORK_THEME.colors.primary : 'transparent',
              color: selectedCategory === cat ? '#fff' : PIWORK_THEME.colors.textSecondary,
              border: selectedCategory === cat ? 'none' : `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.md, fontSize: PIWORK_THEME.typography.small.fontSize,
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{CATEGORY_RU[cat] || cat}</button>
          ))}
        </div>
      </header>

      <main
        ref={mainRef}
        style={{
          flex: 1, overflowY: 'auto', padding: PIWORK_THEME.spacing.md,
          WebkitOverflowScrolling: 'touch', position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: PIWORK_THEME.spacing.md, alignContent: 'start',
          maxWidth: 1024, margin: '0 auto', width: '100%',
        }}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      >
        {pullDistance > 0 && (
          <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ fontSize: 20, opacity: Math.min(pullDistance / 80, 1) }}>
              {refreshing ? '↻' : '⬇️'}
            </div>
          </div>
        )}

        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              height: 160, backgroundColor: PIWORK_THEME.colors.bgSecondary,
              borderRadius: PIWORK_THEME.radius.lg, opacity: 0.7,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))
        ) : error ? (
          <div style={{ textAlign: 'center', padding: PIWORK_THEME.spacing.xl, gridColumn: '1 / -1' }}>
            <p style={{ color: '#EF4444', marginBottom: PIWORK_THEME.spacing.md }}>{error}</p>
            <button onClick={() => loadJobs(searchQuery, selectedCategory)} style={{
              backgroundColor: PIWORK_THEME.colors.primary, color: '#fff',
              border: 'none', borderRadius: PIWORK_THEME.radius.md,
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`, cursor: 'pointer',
            }}>Повторить</button>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {jobs.map((job, index) => (
              <Link key={job.id} href={`/task/${job.id}`} style={{
                textDecoration: 'none',
                animation: `slideUp 200ms ease-out ${Math.min(index * 50, 200)}ms both`,
              }}>
                <div style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg, padding: PIWORK_THEME.spacing.md,
                  cursor: 'pointer', transition: 'all 200ms ease',
                  display: 'flex', flexDirection: 'column', height: '100%',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.primary; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.border; }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: PIWORK_THEME.spacing.sm }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: PIWORK_THEME.colors.textPrimary, flex: 1, marginRight: 8 }}>
                      {job.title}
                    </h3>
                    <span style={{
                      fontSize: 11, padding: '2px 8px',
                      backgroundColor: PIWORK_THEME.colors.bgPrimary,
                      color: PIWORK_THEME.colors.textSecondary, borderRadius: PIWORK_THEME.radius.sm, whiteSpace: 'nowrap',
                    }}>{CATEGORY_RU[job.category] || job.category}</span>
                  </div>
                  <p style={{
                    fontSize: PIWORK_THEME.typography.small.fontSize, color: PIWORK_THEME.colors.textSecondary,
                    margin: 0, marginBottom: PIWORK_THEME.spacing.sm, flex: 1,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{job.description}</p>
                  {job.skills && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: PIWORK_THEME.spacing.sm }}>
                      {job.skills.split(',').slice(0, 3).map((s) => (
                        <span key={s} style={{
                          fontSize: 11, padding: '2px 6px',
                          backgroundColor: `${PIWORK_THEME.colors.primary}20`,
                          color: PIWORK_THEME.colors.primary, borderRadius: PIWORK_THEME.radius.sm,
                        }}>{s.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
                    paddingTop: PIWORK_THEME.spacing.sm, marginTop: 'auto',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>{job.budget}π</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>{job.applications} откликов</span>
                      <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>{timeAgo(job.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Load more */}
            {hasMore && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', paddingTop: PIWORK_THEME.spacing.md }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    padding: '12px 32px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${PIWORK_THEME.colors.border}`,
                    borderRadius: PIWORK_THEME.radius.lg,
                    color: PIWORK_THEME.colors.textSecondary,
                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                    fontSize: 14, fontWeight: 600,
                  }}
                >
                  {loadingMore ? 'Загружаем...' : 'Загрузить ещё'}
                </button>
              </div>
            )}

            <div style={{ gridColumn: '1 / -1', textAlign: 'center', paddingTop: 8 }}>
              <p style={{ fontSize: 11, color: PIWORK_THEME.colors.textTertiary, margin: 0 }}>
                Показано {jobs.length} задач{hasMore ? '' : ' · всё загружено'}
              </p>
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center', padding: PIWORK_THEME.spacing.xl,
            color: PIWORK_THEME.colors.textSecondary, gridColumn: '1 / -1',
          }}>
            <p style={{ fontSize: 40, margin: 0 }}>🔍</p>
            <p style={{ fontSize: PIWORK_THEME.typography.body.fontSize, margin: '8px 0 0' }}>
              Нет задач по этому критерию
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
