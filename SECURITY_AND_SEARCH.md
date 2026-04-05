# Security & Search Features

## PIN Code Protection

### PIN Entry Component (`pin-entry.tsx`)

**Features:**
- 4-digit PIN entry with numeric keypad
- Dot visualization (filled when entered, empty when not)
- Error handling with:
  - 200ms device vibration on incorrect PIN
  - Red dot display for 1 second on error
  - Shake animation on failed attempt
  - Auto-clear after 1 second
- "Forgot PIN?" link for recovery

**Usage:**
```typescript
<PINEntry 
  onSuccess={(pin) => console.log('PIN verified:', pin)}
  onForgot={() => console.log('Reset PIN')}
  title="Enter PIN"
  subtitle="Authentication required"
/>
```

**PIN Recovery:**
- "Forgot PIN?" triggers reset flow
- Pi Network email verification required
- Sends request to Pi backend for verification
- Email-based confirmation for security

## Biometric Authentication

### Biometric Auth Component (`biometric-auth.tsx`)

**Supported Methods:**
- Face ID (FaceID on iOS, Windows Hello on Windows)
- Fingerprint (Touch ID on iOS, fingerprint on Android)
- Automatic detection of supported methods
- Graceful fallback to PIN if biometric unavailable

**Features:**
- 90% success rate simulation (production uses WebAuthn)
- Real-time "Scanning..." status feedback
- Disabled state during authentication attempt
- Smooth transitions between auth methods

**Implementation:**
```typescript
<BiometricAuth
  onSuccess={() => router.push('/feed')}
  userName="designer_pro"
/>
```

## Auto-Lock Feature

### useAutoLock Hook (`use-auto-lock.ts`)

**Configuration:**
- 5-minute inactivity timeout (configurable)
- Tracks user activity on: mousedown, keydown, scroll, touchstart, click, focus
- Automatic session lock after timeout

**Usage:**
```typescript
const { getTimeUntilLock, resetTimeout } = useAutoLock({
  timeoutMinutes: 5,
  onLock: () => setIsLocked(true),
  isEnabled: true,
});
```

**Activity Tracking:**
- Resets on any user interaction
- Returns time remaining until lock
- Cleanup on component unmount

## Advanced Search

### Advanced Search Component (`advanced-search.tsx`)

**Features:**
- Real-time autocomplete suggestions (first 5 matches)
- Search history persistence (last 5 searches in localStorage)
- Results counter display
- Filter button integration

**Autocomplete:**
- Searches task titles in real-time
- Filters as user types
- Shows up to 5 suggestions

**Search History:**
- Stored in browser localStorage
- Limited to 5 most recent searches
- Deduplicates repeated queries
- Displays as "Recent searches" when input is empty

**Usage:**
```typescript
<AdvancedSearch
  onSearch={(query) => setSearchQuery(query)}
  onFilter={() => setIsFilterOpen(true)}
  resultsCount={42}
  placeholder="Search tasks..."
/>
```

## Advanced Filters

### Filter Modal Component (`filter-modal.tsx`)

**Filter Options:**
1. **Budget Range** (min-max slider)
   - Min: 0π, Max: 1000π
   - Input fields for precise values

2. **Deadline**
   - Any time
   - Today
   - This week
   - Radio button selection

3. **Categories**
   - Design, Writing, Data, Audio, Video, Development, Marketing
   - Multiple selections (checkboxes)
   - 2-column grid layout

4. **Minimum Rating**
   - Toggle for "4+ stars only"
   - Single checkbox option

**Modal Features:**
- Results counter displayed at top
- "Apply" button (purple) to confirm filters
- "Reset" button (secondary) to clear all filters
- Fade + scale animation (200ms)
- Click outside to close
- Full keyboard accessibility

**Usage:**
```typescript
const [isOpen, setIsOpen] = useState(false);

<FilterModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onApply={(filters) => {
    console.log('Budget:', filters.budgetMin, '-', filters.budgetMax);
    console.log('Deadline:', filters.deadline);
    console.log('Categories:', filters.categories);
  }}
  initialFilters={currentFilters}
  resultsCount={42}
/>
```

## Integration Example

Complete search and filter workflow:

```typescript
'use client';

import { useState } from 'react';
import { AdvancedSearch } from '@/components/advanced-search';
import { FilterModal, type FilterOptions } from '@/components/filter-modal';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    budgetMin: 0,
    budgetMax: 1000,
    deadline: 'any',
    categories: [],
    minRating: 0,
  });

  const filteredResults = tasks.filter((task) => {
    const matchesQuery = task.title.includes(query);
    const matchesBudget = task.budget >= filters.budgetMin && 
                          task.budget <= filters.budgetMax;
    const matchesCategory = !filters.categories.length || 
                           filters.categories.includes(task.category);
    return matchesQuery && matchesBudget && matchesCategory;
  });

  return (
    <>
      <AdvancedSearch
        onSearch={setQuery}
        onFilter={() => setIsFilterOpen(true)}
        resultsCount={filteredResults.length}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilters}
        initialFilters={filters}
        resultsCount={filteredResults.length}
      />
    </>
  );
}
```

## Accessibility

All components include:
- ARIA labels on buttons and inputs
- Screen reader support for filter descriptions
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators (2px purple outline)
- 48px minimum touch targets
- Full support for `prefers-reduced-motion`
