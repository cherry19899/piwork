'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';

const categories = ['All', 'Design', 'Writing', 'Data', 'Audio', 'Video'];

const tasksData = [
  {
    id: 1,
    title: 'Написать описания товаров',
    creator: 'TechStore',
    creatorAvatar: '🏢',
    category: 'Writing',
    budget: 45,
    deadline: '2 дня',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Дизайн графики для соцсетей',
    creator: 'CreativeTeam',
    creatorAvatar: '🎨',
    category: 'Design',
    budget: 75,
    deadline: '1 день',
    status: 'Open',
  },
  {
    id: 3,
    title: 'Ввод данных в таблицу',
    creator: 'DataPro',
    creatorAvatar: '📊',
    category: 'Data',
    budget: 30,
    deadline: '4 часа',
    status: 'Open',
  },
  {
    id: 4,
    title: 'Транскрипция видео',
    creator: 'MediaCorp',
    creatorAvatar: '🎬',
    category: 'Audio',
    budget: 60,
    deadline: '3 дня',
    status: 'Open',
  },
];

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
const [isLoading, setIsLoading] = useState(false);

  const filteredTasks = tasksData.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mainRef.current && mainRef.current.scrollTop === 0) {
      const distance = e.touches[0].clientY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(distance);
        if (distance > 80) {
          handleRefresh();
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setPullDistance(0);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: 80,
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
        }}
      >
        <h1
          style={{
            fontSize: PIWORK_THEME.typography.h1.fontSize,
            fontWeight: 700,
            margin: 0,
            marginBottom: PIWORK_THEME.spacing.md,
          }}
        >
          Лента
        </h1>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 48,
            backgroundColor: PIWORK_THEME.colors.bgPrimary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            paddingLeft: PIWORK_THEME.spacing.md,
            paddingRight: PIWORK_THEME.spacing.md,
            marginBottom: PIWORK_THEME.spacing.md,
          }}
        >
          <span style={{ fontSize: 18, marginRight: 8, color: PIWORK_THEME.colors.textSecondary }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: PIWORK_THEME.colors.textPrimary,
              fontSize: PIWORK_THEME.typography.body.fontSize,
              outline: 'none',
            }}
          />
        </div>

        {/* Category Filters */}
        <div
          ref={filterScrollRef}
          style={{
            display: 'flex',
            gap: PIWORK_THEME.spacing.sm,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollBehavior: 'smooth',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
                backgroundColor:
                  selectedCategory === category ? PIWORK_THEME.colors.primary : 'transparent',
                color:
                  selectedCategory === category
                    ? PIWORK_THEME.colors.textPrimary
                    : PIWORK_THEME.colors.textSecondary,
                border:
                  selectedCategory === category
                    ? 'none'
                    : `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.md,
                fontSize: PIWORK_THEME.typography.small.fontSize,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={mainRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: PIWORK_THEME.spacing.md,
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: PIWORK_THEME.spacing.md,
          alignContent: 'start',
          maxWidth: 1024,
          margin: '0 auto',
          width: '100%',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-Refresh Indicator */}
        {pullDistance > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              transition: pullDistance > 80 ? 'none' : 'transform 200ms ease-out',
            }}
          >
            {pullDistance > 80 ? (
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: '2px solid ' + PIWORK_THEME.colors.primary,
                  borderTop: '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            ) : (
              <div style={{ fontSize: 20, opacity: pullDistance / 80 }}>⬇️</div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                style={{
                  animation: `slideUp 200ms ease-out ${i * 50}ms both`,
                }}
              >
                <div
                  style={{
                    height: 200,
                    backgroundColor: PIWORK_THEME.colors.bgSecondary,
                    borderRadius: PIWORK_THEME.radius.lg,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            ))}
          </>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => (
            <Link
              key={task.id}
              href={`/task/${task.id}`}
              style={{
                textDecoration: 'none',
                animation: `slideUp 200ms ease-out ${index * 50}ms both`,
              }}
            >
              <div
                style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg,
                  padding: PIWORK_THEME.spacing.md,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    PIWORK_THEME.colors.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    PIWORK_THEME.colors.border;
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    margin: 0,
                    marginBottom: PIWORK_THEME.spacing.sm,
                    color: PIWORK_THEME.colors.textPrimary,
                  }}
                >
                  {task.title}
                </h3>

                <div style={{ flex: 1, marginBottom: PIWORK_THEME.spacing.md }}>
                  <p
                    style={{
                      fontSize: PIWORK_THEME.typography.small.fontSize,
                      color: PIWORK_THEME.colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    {task.deadline}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
                    paddingTop: PIWORK_THEME.spacing.md,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: PIWORK_THEME.colors.primary,
                    }}
                  >
                    {task.budget}π
                  </div>

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: PIWORK_THEME.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {task.creatorAvatar}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: PIWORK_THEME.spacing.xl,
              color: PIWORK_THEME.colors.textSecondary,
              gridColumn: '1 / -1',
            }}
          >
            <p style={{ fontSize: PIWORK_THEME.typography.body.fontSize, margin: 0 }}>
              🔍 Нет задач по этому критерию
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
