'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { getJobs, type Job } from '@/lib/workpro-api';

const categories = ['All', 'Design', 'Writing', 'Data', 'Audio', 'Video', 'Other'];

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadJobs = useCallback(async (search?: string, category?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getJobs({
        status: 'open',
        search: search || undefined,
        category: (category && category !== 'All') ? category : undefined,
        limit: 30,
      });
      setJobs(result.jobs || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadJobs(value, selectedCategory);
    }, 400);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      const distance = e.touches[0].clientY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
        if (distance > 80 && !refreshing) handleRefresh();
      }
    }
  };

  const handleTouchEnd = () => setPullDistance(0);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'только что';
    if (h < 24) return `${h}ч назад`;
    return `${Math.floor(h / 24)}д назад`;
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary, paddingBottom: 80,
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
      }}>
        <h1 style={{ fontSize: PIWORK_THEME.typography.h1.fontSize, fontWeight: 700, margin: 0, marginBottom: PIWORK_THEME.spacing.md }}>
          Лента
        </h1>

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
            type="text"
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              flex: 1, backgroundColor: 'transparent', border: 'none',
              color: PIWORK_THEME.colors.textPrimary,
              fontSize: PIWORK_THEME.typography.body.fontSize, outline: 'none',
            }}
          />
          {searchQuery && (
            <button onClick={() => handleSearchChange('')}
              style={{ background: 'none', border: 'none', color: PIWORK_THEME.colors.textSecondary, cursor: 'pointer', fontSize: 18 }}>
              ✕
            </button>
          )}
        </div>

        <div style={{
          display: 'flex', gap: PIWORK_THEME.spacing.sm, overflowX: 'auto',
          paddingBottom: 4, scrollbarWidth: 'none',
        }}>
          {categories.map((category) => (
            <button key={category} onClick={() => handleCategoryChange(category)} style={{
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              backgroundColor: selectedCategory === category ? PIWORK_THEME.colors.primary : 'transparent',
              color: selectedCategory === category ? '#fff' : PIWORK_THEME.colors.textSecondary,
              border: selectedCategory === category ? 'none' : `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize,
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 200ms ease', flexShrink: 0,
            }}>
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} style={{
        flex: 1, overflowY: 'auto', padding: PIWORK_THEME.spacing.md,
        WebkitOverflowScrolling: 'touch', position: 'relative',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: PIWORK_THEME.spacing.md, alignContent: 'start',
        maxWidth: 1024, margin: '0 auto', width: '100%',
      }}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      >
        {pullDistance > 0 && (
          <div style={{
            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 20, opacity: Math.min(pullDistance / 80, 1) }}>
              {refreshing ? '↻' : '⬇️'}
            </div>
          </div>
        )}

        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              height: 160, backgroundColor: PIWORK_THEME.colors.bgSecondary,
              borderRadius: PIWORK_THEME.radius.lg,
              animation: 'pulse 1.5s ease-in-out infinite',
              opacity: 0.7,
            }} />
          ))
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: PIWORK_THEME.spacing.xl,
            gridColumn: '1 / -1',
          }}>
            <p style={{ color: '#EF4444', marginBottom: PIWORK_THEME.spacing.md }}>{error}</p>
            <button onClick={() => loadJobs(searchQuery, selectedCategory)} style={{
              backgroundColor: PIWORK_THEME.colors.primary, color: '#fff',
              border: 'none', borderRadius: PIWORK_THEME.radius.md,
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              cursor: 'pointer', fontSize: PIWORK_THEME.typography.small.fontSize,
            }}>
              Повторить
            </button>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job, index) => (
            <Link key={job.id} href={`/task/${job.id}`} style={{
              textDecoration: 'none',
              animation: `slideUp 200ms ease-out ${Math.min(index * 50, 200)}ms both`,
            }}>
              <div style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: PIWORK_THEME.spacing.md,
                cursor: 'pointer', transition: 'all 200ms ease',
                display: 'flex', flexDirection: 'column', height: '100%',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.primary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = PIWORK_THEME.colors.border; }}
                onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
                onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: PIWORK_THEME.spacing.sm }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700, margin: 0,
                    color: PIWORK_THEME.colors.textPrimary, flex: 1, marginRight: 8,
                  }}>
                    {job.title}
                  </h3>
                  <span style={{
                    fontSize: 11, padding: '2px 8px',
                    backgroundColor: PIWORK_THEME.colors.bgPrimary,
                    color: PIWORK_THEME.colors.textSecondary,
                    borderRadius: PIWORK_THEME.radius.sm, whiteSpace: 'nowrap',
                  }}>
                    {job.category}
                  </span>
                </div>

                <p style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary, margin: 0,
                  marginBottom: PIWORK_THEME.spacing.sm, flex: 1,
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {job.description}
                </p>

                {job.skills && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: PIWORK_THEME.spacing.sm }}>
                    {job.skills.split(',').slice(0, 3).map((s) => (
                      <span key={s} style={{
                        fontSize: 11, padding: '2px 6px',
                        backgroundColor: `${PIWORK_THEME.colors.primary}20`,
                        color: PIWORK_THEME.colors.primary,
                        borderRadius: PIWORK_THEME.radius.sm,
                      }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
                  paddingTop: PIWORK_THEME.spacing.sm, marginTop: 'auto',
                }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: PIWORK_THEME.colors.primary }}>
                    {job.budget}π
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>
                      {job.applications} откликов
                    </span>
                    <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary }}>
                      {timeAgo(job.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
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
