'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { PiworkButton } from './piwork-button';

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  hasPhotos: boolean;
}

interface ReviewsProps {
  reviews: Review[];
}

type FilterType = 'all' | '5-stars' | 'with-photos';

export function Reviews({ reviews }: ReviewsProps) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [displayCount, setDisplayCount] = useState(6);

  const filteredReviews = reviews
    .filter((review) => {
      if (filterType === '5-stars') return review.rating === 5;
      if (filterType === 'with-photos') return review.hasPhotos;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, displayCount);

  const hasMore = 
    reviews.filter((r) => {
      if (filterType === '5-stars') return r.rating === 5;
      if (filterType === 'with-photos') return r.hasPhotos;
      return true;
    }).length > displayCount;

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: PIWORK_THEME.spacing.md,
          marginBottom: PIWORK_THEME.spacing.lg,
          overflowX: 'auto',
        }}
      >
        {['all', '5-stars', 'with-photos'].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setFilterType(filter as FilterType);
              setDisplayCount(6);
            }}
            style={{
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              backgroundColor:
                filterType === filter ? PIWORK_THEME.colors.primary : 'transparent',
              color:
                filterType === filter
                  ? PIWORK_THEME.colors.textPrimary
                  : PIWORK_THEME.colors.textSecondary,
              border:
                filterType === filter
                  ? 'none'
                  : `1px solid ${PIWORK_THEME.colors.border}`,
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: PIWORK_THEME.typography.small.fontSize,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 200ms ease',
              textTransform: 'capitalize',
            }}
          >
            {filter === 'all' && 'All Reviews'}
            {filter === '5-stars' && '5 Stars'}
            {filter === 'with-photos' && 'With Photos'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.md }}>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: PIWORK_THEME.colors.bgSecondary,
                border: `1px solid ${PIWORK_THEME.colors.border}`,
                borderRadius: PIWORK_THEME.radius.lg,
                padding: PIWORK_THEME.spacing.md,
              }}
            >
              {/* Review Header */}
              <div
                style={{
                  display: 'flex',
                  gap: PIWORK_THEME.spacing.md,
                  marginBottom: PIWORK_THEME.spacing.md,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: PIWORK_THEME.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {review.avatar}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        margin: 0,
                        color: PIWORK_THEME.colors.textPrimary,
                      }}
                    >
                      {review.author}
                    </p>
                    <div
                      style={{
                        color: '#FBBF24',
                        fontSize: 12,
                        letterSpacing: 1,
                      }}
                    >
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: 10,
                      color: PIWORK_THEME.colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    {review.date}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <p
                style={{
                  fontSize: 14,
                  color: PIWORK_THEME.colors.textSecondary,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {review.text}
              </p>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: PIWORK_THEME.spacing.lg,
              color: PIWORK_THEME.colors.textSecondary,
            }}
          >
            <p style={{ fontSize: 14, margin: 0 }}>No reviews found</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: PIWORK_THEME.spacing.lg,
          }}
        >
          <button
            onClick={() => setDisplayCount(displayCount + 6)}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${PIWORK_THEME.colors.primary}`,
              color: PIWORK_THEME.colors.primary,
              padding: `${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.lg}px`,
              borderRadius: PIWORK_THEME.radius.lg,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textTransform: 'uppercase',
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
