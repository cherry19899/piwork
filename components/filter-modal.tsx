'use client';

import { useState } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export interface FilterOptions {
  budgetMin: number;
  budgetMax: number;
  deadline: 'any' | 'today' | 'week';
  categories: string[];
  minRating: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  resultsCount?: number;
}

const categories = [
  'Design',
  'Writing',
  'Data',
  'Audio',
  'Video',
  'Development',
  'Marketing',
];

export function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  resultsCount,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    budgetMin: initialFilters?.budgetMin || 0,
    budgetMax: initialFilters?.budgetMax || 1000,
    deadline: initialFilters?.deadline || 'any',
    categories: initialFilters?.categories || [],
    minRating: initialFilters?.minRating || 0,
  });

  const handleBudgetChange = (
    type: 'min' | 'max',
    value: number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type === 'min' ? 'budgetMin' : 'budgetMax']: value,
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      budgetMin: 0,
      budgetMax: 1000,
      deadline: 'any',
      categories: [],
      minRating: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 40,
          animation: 'fadeIn 200ms ease-out',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 400,
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          padding: PIWORK_THEME.spacing.lg,
          zIndex: 50,
          animation: 'slideUp 200ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: PIWORK_THEME.spacing.lg,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Filters
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: PIWORK_THEME.colors.textSecondary,
              fontSize: 24,
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        {/* Results Counter */}
        {resultsCount !== undefined && (
          <div
            style={{
              fontSize: PIWORK_THEME.typography.small.fontSize,
              color: PIWORK_THEME.colors.textSecondary,
              marginBottom: PIWORK_THEME.spacing.md,
              padding: `${PIWORK_THEME.spacing.md}px`,
              backgroundColor: PIWORK_THEME.colors.bgPrimary,
              borderRadius: PIWORK_THEME.radius.md,
            }}
          >
            Showing {resultsCount} results
          </div>
        )}

        {/* Budget Range */}
        <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.md,
            }}
          >
            Budget Range (π)
          </h3>

          <div style={{ display: 'flex', gap: PIWORK_THEME.spacing.md }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                Min
              </label>
              <input
                type="number"
                value={filters.budgetMin}
                onChange={(e) =>
                  handleBudgetChange('min', Number(e.target.value))
                }
                style={{
                  width: '100%',
                  padding: `${PIWORK_THEME.spacing.sm}px`,
                  backgroundColor: PIWORK_THEME.colors.bgPrimary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.md,
                  color: PIWORK_THEME.colors.textPrimary,
                  fontSize: PIWORK_THEME.typography.body.fontSize,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                Max
              </label>
              <input
                type="number"
                value={filters.budgetMax}
                onChange={(e) =>
                  handleBudgetChange('max', Number(e.target.value))
                }
                style={{
                  width: '100%',
                  padding: `${PIWORK_THEME.spacing.sm}px`,
                  backgroundColor: PIWORK_THEME.colors.bgPrimary,
                  border: `1px solid ${PIWORK_THEME.colors.border}`,
                  borderRadius: PIWORK_THEME.radius.md,
                  color: PIWORK_THEME.colors.textPrimary,
                  fontSize: PIWORK_THEME.typography.body.fontSize,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.md,
            }}
          >
            Deadline
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: PIWORK_THEME.spacing.sm,
            }}
          >
            {['any', 'today', 'week'].map((deadline) => (
              <label
                key={deadline}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: PIWORK_THEME.spacing.sm,
                }}
              >
                <input
                  type="radio"
                  name="deadline"
                  value={deadline}
                  checked={filters.deadline === deadline}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      deadline: e.target.value as FilterOptions['deadline'],
                    }))
                  }
                  style={{
                    cursor: 'pointer',
                    width: 18,
                    height: 18,
                  }}
                  aria-label={`Deadline: ${deadline}`}
                />
                <span style={{ fontSize: PIWORK_THEME.typography.body.fontSize }}>
                  {deadline === 'any'
                    ? 'Any time'
                    : deadline === 'today'
                      ? 'Today'
                      : 'This week'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.md,
            }}
          >
            Categories
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: PIWORK_THEME.spacing.sm,
            }}
          >
            {categories.map((category) => (
              <label
                key={category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: PIWORK_THEME.spacing.sm,
                }}
              >
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  style={{
                    cursor: 'pointer',
                    width: 18,
                    height: 18,
                  }}
                  aria-label={`Category: ${category}`}
                />
                <span style={{ fontSize: PIWORK_THEME.typography.body.fontSize }}>
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Minimum Rating */}
        <div style={{ marginBottom: PIWORK_THEME.spacing.lg }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              margin: 0,
              marginBottom: PIWORK_THEME.spacing.md,
            }}
          >
            Minimum Rating
          </h3>

          <label style={{ display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.sm }}>
            <input
              type="checkbox"
              checked={filters.minRating >= 4}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: e.target.checked ? 4 : 0,
                }))
              }
              style={{
                cursor: 'pointer',
                width: 18,
                height: 18,
              }}
              aria-label="Only show 4+ star rated freelancers"
            />
            <span style={{ fontSize: PIWORK_THEME.typography.body.fontSize }}>
              4+ stars only
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: PIWORK_THEME.spacing.md,
            marginTop: PIWORK_THEME.spacing.lg,
          }}
        >
          <button
            onClick={handleReset}
            style={{
              padding: `${PIWORK_THEME.spacing.md}px`,
              backgroundColor: 'transparent',
              color: PIWORK_THEME.colors.primary,
              border: `2px solid ${PIWORK_THEME.colors.primary}`,
              borderRadius: PIWORK_THEME.radius.lg,
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                `${PIWORK_THEME.colors.primary}10`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                'transparent';
            }}
            aria-label="Reset filters"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            style={{
              padding: `${PIWORK_THEME.spacing.md}px`,
              backgroundColor: PIWORK_THEME.colors.primary,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: PIWORK_THEME.radius.lg,
              fontSize: PIWORK_THEME.typography.body.fontSize,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                PIWORK_THEME.colors.primary;
            }}
            aria-label="Apply filters"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
