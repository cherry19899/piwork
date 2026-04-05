'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { PiworkButton } from '@/components/piwork-button';
import { Reviews } from '@/components/reviews';

type TabType = 'about' | 'portfolio' | 'reviews';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isEditing, setIsEditing] = useState(false);

  const portfolioItems = [
    { id: 1, title: 'E-commerce Store Design', image: '🖼️' },
    { id: 2, title: 'Mobile App UI Kit', image: '📱' },
  ];

  const reviewsData = [
    {
      id: 1,
      author: 'TechStore',
      avatar: '🏢',
      rating: 5,
      text: 'Excellent work! Very professional and fast delivery. Highly recommended for all design projects.',
      date: '2024-01-15',
      hasPhotos: true,
    },
    {
      id: 2,
      author: 'CreativeTeam',
      avatar: '🎨',
      rating: 5,
      text: 'Outstanding design quality. The attention to detail was amazing. Will work together again!',
      date: '2024-01-10',
      hasPhotos: true,
    },
    {
      id: 3,
      author: 'Digital Co',
      avatar: '💻',
      rating: 5,
      text: 'Perfect execution. Great communication throughout the project.',
      date: '2024-01-05',
      hasPhotos: false,
    },
    {
      id: 4,
      author: 'Brand Studio',
      avatar: '✨',
      rating: 4,
      text: 'Good work overall. Minor revisions needed but very responsive to feedback.',
      date: '2023-12-28',
      hasPhotos: true,
    },
    {
      id: 5,
      author: 'Web Agency',
      avatar: '🌐',
      rating: 5,
      text: 'Amazing designer! Delivered ahead of schedule with exceptional quality.',
      date: '2023-12-20',
      hasPhotos: false,
    },
    {
      id: 6,
      author: 'Marketing Pro',
      avatar: '📊',
      rating: 5,
      text: 'Best designer I have worked with. Highly professional and creative.',
      date: '2023-12-15',
      hasPhotos: true,
    },
  ];

  const hasMore = false;

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
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md }}>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: PIWORK_THEME.colors.primary,
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ←
          </button>
          <h1
            style={{
              fontSize: PIWORK_THEME.typography.h2.fontSize,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Профиль
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: PIWORK_THEME.spacing.lg,
          overflowY: 'auto',
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            padding: PIWORK_THEME.spacing.lg,
            marginBottom: PIWORK_THEME.spacing.lg,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: PIWORK_THEME.colors.primary,
              margin: '0 auto ' + PIWORK_THEME.spacing.md + 'px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
            }}
          >
            👤
          </div>

          {/* Name with Edit Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
              }}
            >
              designer_pro
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: PIWORK_THEME.colors.primary,
                fontSize: 18,
                cursor: 'pointer',
                padding: 0,
              }}
              title="Edit profile"
            >
              ✏️
            </button>
          </div>

          {/* Username */}
          <p
            style={{
              fontSize: PIWORK_THEME.typography.small.fontSize,
              color: PIWORK_THEME.colors.textSecondary,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.lg,
            }}
          >
            @designer_pro
          </p>

          {/* Stats - 3 Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: PIWORK_THEME.spacing.md,
              marginBottom: PIWORK_THEME.spacing.lg,
              borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
              paddingTop: PIWORK_THEME.spacing.lg,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#22C55E',
                  marginBottom: 4,
                }}
              >
                24
              </div>
              <p
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  margin: 0,
                }}
              >
                Completed
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#FBBF24',
                  marginBottom: 4,
                  letterSpacing: 1,
                }}
              >
                ★★★★★
              </div>
              <p
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  margin: 0,
                }}
              >
                4.9 Rating
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: PIWORK_THEME.colors.primary,
                  marginBottom: 4,
                }}
              >
                2.3k π
              </div>
              <p
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  margin: 0,
                }}
              >
                Earnings
              </p>
            </div>
          </div>

          {/* Share Profile Button */}
          <PiworkButton variant="secondary" fullWidth={true}>
            Share Profile
          </PiworkButton>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: PIWORK_THEME.spacing.md,
            borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
            marginBottom: PIWORK_THEME.spacing.lg,
          }}
        >
          {['about', 'portfolio', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              style={{
                padding: `${PIWORK_THEME.spacing.md}px 0`,
                backgroundColor: 'transparent',
                border: 'none',
                color:
                  activeTab === tab
                    ? PIWORK_THEME.colors.primary
                    : PIWORK_THEME.colors.textSecondary,
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer',
                borderBottom:
                  activeTab === tab ? `2px solid ${PIWORK_THEME.colors.primary}` : 'none',
                marginBottom: -1,
                transition: 'all 200ms ease',
                textTransform: 'capitalize',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div
            style={{
              backgroundColor: PIWORK_THEME.colors.bgSecondary,
              border: `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.lg,
              padding: PIWORK_THEME.spacing.lg,
            }}
          >
            <h3
              style={{
                fontSize: PIWORK_THEME.typography.h2.fontSize,
                fontWeight: 600,
                margin: 0,
                marginBottom: PIWORK_THEME.spacing.md,
              }}
            >
              About Me
            </h3>
            <p
              style={{
                fontSize: PIWORK_THEME.typography.body.fontSize,
                color: PIWORK_THEME.colors.textSecondary,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Experienced designer and developer with 5+ years in creating stunning digital
              experiences. Specializing in UI/UX design, web development, and brand identity.
              Passionate about helping businesses grow through creative solutions.
            </p>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div style={{ position: 'relative' }}>
            {portfolioItems.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 8,
                  marginBottom: PIWORK_THEME.spacing.lg,
                }}
              >
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      aspectRatio: '1 / 1',
                      backgroundColor: PIWORK_THEME.colors.bgSecondary,
                      border: `1px solid ${PIWORK_THEME.colors.border}`,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        PIWORK_THEME.colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        PIWORK_THEME.colors.border;
                    }}
                  >
                    {item.image}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: PIWORK_THEME.colors.bgSecondary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.lg,
                  padding: PIWORK_THEME.spacing.xl,
                  textAlign: 'center',
                  marginBottom: PIWORK_THEME.spacing.lg,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: PIWORK_THEME.spacing.md }}>🖼️</div>
                <p
                  style={{
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    color: PIWORK_THEME.colors.textSecondary,
                    margin: 0,
                  }}
                >
                  No works yet
                </p>
              </div>
            )}

            {hasMore && (
              <div style={{ textAlign: 'center', marginBottom: PIWORK_THEME.spacing.lg }}>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: PIWORK_THEME.colors.primary,
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Show all ({portfolioItems.length})
                </button>
              </div>
            )}

            {/* Floating Add Button */}
            <button
              style={{
                position: 'fixed',
                bottom: 100,
                right: 20,
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: PIWORK_THEME.colors.primary,
                color: '#FFFFFF',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
              title="Add work to portfolio"
            >
              ➕
            </button>
          </div>
        )}

        {activeTab === 'reviews' && <Reviews reviews={reviewsData} />}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
