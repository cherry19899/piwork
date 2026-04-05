'use client';

import { useState, useRef, useEffect } from 'react';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'user';
}

interface SearchProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
  resultsCount?: number;
  placeholder?: string;
}

// Mock data for autocomplete
const allTasks = [
  'Написать описания товаров',
  'Дизайн графики для соцсетей',
  'Ввод данных в таблицу',
  'Транскрипция видео',
  'Веб-дизайн лендинга',
  'Создание иконок',
];

export function AdvancedSearch({
  onSearch,
  onFilter,
  resultsCount,
  placeholder = 'Search tasks...',
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('piwork_search_history');
    if (saved) {
      setSearchHistory(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Handle search input
  const handleInputChange = (value: string) => {
    setQuery(value);

    if (value.length > 0) {
      // Generate autocomplete suggestions
      const filtered = allTasks
        .filter((task) =>
          task.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to history
      const newHistory = [
        searchQuery,
        ...searchHistory.filter((h) => h !== searchQuery),
      ].slice(0, 5);

      setSearchHistory(newHistory);
      localStorage.setItem('piwork_search_history', JSON.stringify(newHistory));

      // Trigger search
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: PIWORK_THEME.spacing.lg }}>
      {/* Results counter */}
      {resultsCount !== undefined && (
        <div
          style={{
            fontSize: PIWORK_THEME.typography.small.fontSize,
            color: PIWORK_THEME.colors.textSecondary,
            marginBottom: PIWORK_THEME.spacing.sm,
            paddingLeft: PIWORK_THEME.spacing.md,
          }}
        >
          {resultsCount} results found
        </div>
      )}

      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          gap: PIWORK_THEME.spacing.sm,
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderRadius: PIWORK_THEME.radius.lg,
          border: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.sm}px`,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 18, color: PIWORK_THEME.colors.textSecondary }}>
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (query.length > 0) setShowSuggestions(true);
            else if (searchHistory.length > 0) setShowSuggestions(true);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          placeholder={placeholder}
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.textPrimary,
            fontSize: PIWORK_THEME.typography.body.fontSize,
            outline: 'none',
            padding: `${PIWORK_THEME.spacing.sm}px 0`,
          }}
          aria-label="Search tasks"
        />

        <button
          onClick={onFilter}
          style={{
            backgroundColor: PIWORK_THEME.colors.primary,
            border: 'none',
            color: '#FFFFFF',
            padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
            borderRadius: PIWORK_THEME.radius.md,
            cursor: 'pointer',
            fontSize: 16,
            transition: 'all 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#7C3AED';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              PIWORK_THEME.colors.primary;
          }}
          aria-label="Open filters"
          title="Advanced filters"
        >
          🎛️
        </button>
      </div>

      {/* Autocomplete and History Suggestions */}
      {showSuggestions && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: PIWORK_THEME.spacing.sm,
            backgroundColor: PIWORK_THEME.colors.bgSecondary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            zIndex: 10,
            maxHeight: 300,
            overflowY: 'auto',
          }}
        >
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <>
              <div
                style={{
                  padding: PIWORK_THEME.spacing.sm,
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  fontWeight: 600,
                  borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
                }}
              >
                Suggestions
              </div>
              {suggestions.map((suggestion, i) => (
                <button
                  key={`suggestion-${i}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{
                    width: '100%',
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: PIWORK_THEME.colors.textPrimary,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      PIWORK_THEME.colors.bgPrimary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'transparent';
                  }}
                >
                  <span style={{ marginRight: PIWORK_THEME.spacing.sm }}>
                    🔍
                  </span>
                  {suggestion}
                </button>
              ))}
            </>
          )}

          {/* Search history */}
          {searchHistory.length > 0 && suggestions.length === 0 && (
            <>
              <div
                style={{
                  padding: PIWORK_THEME.spacing.sm,
                  fontSize: PIWORK_THEME.typography.small.fontSize,
                  color: PIWORK_THEME.colors.textSecondary,
                  fontWeight: 600,
                  borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
                }}
              >
                Recent searches
              </div>
              {searchHistory.map((historyItem, i) => (
                <button
                  key={`history-${i}`}
                  onClick={() => handleSelectSuggestion(historyItem)}
                  style={{
                    width: '100%',
                    padding: `${PIWORK_THEME.spacing.md}px`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: PIWORK_THEME.colors.textPrimary,
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: PIWORK_THEME.typography.body.fontSize,
                    borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
                    transition: 'all 200ms ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      PIWORK_THEME.colors.bgPrimary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      'transparent';
                  }}
                >
                  <span>
                    <span style={{ marginRight: PIWORK_THEME.spacing.sm }}>
                      🕐
                    </span>
                    {historyItem}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Empty state */}
          {suggestions.length === 0 && searchHistory.length === 0 && (
            <div
              style={{
                padding: PIWORK_THEME.spacing.lg,
                textAlign: 'center',
                color: PIWORK_THEME.colors.textSecondary,
                fontSize: PIWORK_THEME.typography.body.fontSize,
              }}
            >
              No suggestions
            </div>
          )}
        </div>
      )}
    </div>
  );
}
