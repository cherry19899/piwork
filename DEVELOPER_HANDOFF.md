# PiWork Developer Handoff Guide

## Quick Start for Developers

### Project Setup
```bash
npm install
npm run dev
# Storybook: npm run storybook
```

### File Structure
```
piwork/
├── app/                    # Next.js app pages
├── components/
│   ├── ui/                 # Reusable components with stories
│   ├── [feature].tsx       # Feature components
│   └── [feature].stories.tsx  # Storybook stories
├── hooks/                  # Custom React hooks
├── lib/
│   ├── piwork-design-tokens.ts  # Theme configuration
│   ├── offline-context.tsx       # Offline state management
│   └── notification-context.tsx  # Notification management
├── public/
│   ├── icons/              # SVG icons (24px)
│   ├── illustrations/      # PNG illustrations (2x resolution)
│   └── animations/         # Lottie JSON animations
└── .storybook/             # Storybook configuration
```

### Key Configurations

#### Design Tokens (`lib/piwork-design-tokens.ts`)
Centralized theme configuration - update here for design changes:
```typescript
export const PIWORK_THEME = {
  colors: {
    primary: '#8B5CF6',
    bgPrimary: '#000000',
    border: '#2A2A2A',
    // ... more colors
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
    // ... 4px grid
  },
  typography: {
    h1: { fontSize: 28, fontWeight: 700 },
    // ... all type scales
  },
};
```

#### CSS Variables (`app/globals.css`)
For dynamic theming without code changes:
```css
:root {
  --color-primary: #8B5CF6;
  --space-md: 16px;
  --font-size-body: 14px;
  /* ... all variables */
}
```

### Component Development Pattern

```typescript
// 1. Create component file
// components/my-component.tsx
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export function MyComponent() {
  return (
    <div style={{ 
      padding: PIWORK_THEME.spacing.md,
      color: PIWORK_THEME.colors.textPrimary,
    }}>
      {/* Content */}
    </div>
  );
}

// 2. Create story file for Storybook
// components/my-component.stories.tsx
export default {
  title: 'Components/MyComponent',
  component: MyComponent,
};

export const Default = {};
export const WithLoading = { args: { isLoading: true } };
```

### Using Gestures & Hooks

```typescript
import { useSwipe, useLongPress, useDoubleTap } from '@/hooks/use-gestures';
import { useAutoLock } from '@/hooks/use-auto-lock';
import { useOffline } from '@/lib/offline-context';

// Gesture detection
const { x, y, direction } = useSwipe(elementRef, {
  onSwipe: (dir) => console.log('Swiped:', dir),
  threshold: 50,
});

// Auto-lock after inactivity
const timeUntilLock = useAutoLock({
  timeout: 300000, // 5 minutes
  onLock: () => router.push('/lock'),
});

// Offline state
const { isOnline, addPendingAction, syncStatus } = useOffline();
```

## Design Assets

### Icons
- **Location**: `public/icons/`
- **Format**: SVG
- **Size**: 24x24px default
- **Variants**: 20px (compact), 32px (large)
- **Usage**:
```tsx
<img src="/icons/check.svg" alt="Completed" width={24} height={24} />
```

### Illustrations
- **Location**: `public/illustrations/`
- **Format**: PNG (2x resolution)
- **Typical**: 200px × 200px file (100px × 100px display)
- **Usage**:
```tsx
<img 
  src="/illustrations/empty-state.png" 
  alt="Empty state" 
  width={100} 
  height={100}
  srcSet="/illustrations/empty-state.png 1x, /illustrations/empty-state@2x.png 2x"
/>
```

### Animations
- **Location**: `public/animations/`
- **Format**: Lottie JSON
- **Usage**:
```typescript
import Lottie from 'lottie-react';
import animationData from '@/public/animations/loading.json';

<Lottie animationData={animationData} loop autoplay />
```

## Spacing Guidelines

All spacing follows strict 4px grid:
- Use `PIWORK_THEME.spacing` constants
- Never use arbitrary px values
- Always use multiples of 4px

```typescript
// ✅ Correct
padding: PIWORK_THEME.spacing.md,        // 16px
gap: PIWORK_THEME.spacing.sm,            // 8px

// ❌ Incorrect
padding: 15,    // Not on 4px grid
margin: '20px', // Use tokens instead
```

## Color Usage

All colors from design palette only:
```typescript
// Use these primary colors
#8B5CF6  // Primary
#22C55E  // Success
#F59E0B  // Warning
#EF4444  // Danger
#000000  // Dark BG
#1A1A1A  // Secondary BG

// Access via tokens
PIWORK_THEME.colors.primary
PIWORK_THEME.colors.success
// Never use: 'lightblue', 'rgb(123, 45, 67)', etc.
```

## Typography Implementation

All text uses predefined scales:
```typescript
// ✅ Correct
fontSize: PIWORK_THEME.typography.body.fontSize,  // 14px
fontWeight: 600,

// ❌ Incorrect
fontSize: 13,
fontFamily: 'Comic Sans',
```

## Responsive Design

Mobile-first with breakpoint at 768px:
```typescript
// In component
const isTablet = window.innerWidth >= 768;

// Or use CSS
@media (min-width: 768px) {
  // Tablet styles
}
```

## Accessibility Checklist

- [ ] 4.5:1 contrast ratio for text
- [ ] 48px minimum touch targets
- [ ] Keyboard navigation support
- [ ] ARIA labels on icons/images
- [ ] Screen reader text where needed
- [ ] Focus visible with 2px outline
- [ ] `prefers-reduced-motion` respected

```typescript
// Add ARIA labels to icons
<button aria-label="Save task">💾</button>

// Screen reader only text
<span className="sr-only">Loading...</span>

// Semantic HTML
<button>, <input>, <select> instead of <div>
```

## Testing

### Storybook
```bash
npm run storybook  # View all components
# http://localhost:6006
```

### Accessibility
- Use DevTools → Lighthouse
- Check contrast with WebAIM
- Test keyboard navigation (Tab, Escape, Enter)
- Test with screen reader (VoiceOver, NVDA)

### Offline Mode
```typescript
// Chrome DevTools → Network → "Offline"
// Or programmatically:
navigator.onLine  // boolean
```

## Common Tasks

### Adding a New Component
1. Create `/components/new-component.tsx`
2. Create `/components/new-component.stories.tsx`
3. Import `PIWORK_THEME` for colors/spacing
4. Use semantic HTML + proper ARIA
5. Add to Storybook, test all variants

### Updating Colors
1. Edit `lib/piwork-design-tokens.ts` PIWORK_THEME
2. Or update `app/globals.css` CSS variables
3. All components automatically update

### Adding Gestures
1. Import hook: `import { useSwipe } from '@/hooks/use-gestures'`
2. Attach to element ref
3. Define callbacks (onSwipe, etc.)

### Implementing Offline Features
1. Wrap app in `OfflineProvider`
2. Use `useOffline()` hook
3. Check `isOnline` boolean
4. Call `addPendingAction()` to queue operations

## Performance Tips

- Use `next/image` for responsive images
- Implement skeleton loading for slow connections
- Lazy load heavy components with `React.lazy()`
- Use `useCallback` for event handlers
- Respect `prefers-reduced-motion` to skip expensive animations

## Security Notes

- Never store sensitive data in localStorage
- Use HttpOnly cookies for auth tokens
- Validate all user input
- Sanitize user-generated content
- Follow OWASP guidelines

## Deployment

- Build: `npm run build`
- Deploy to Vercel or any Node.js host
- Environment variables: See `.env.example`
- Database: Connect to Pi Network backend
- CDN: Use Vercel CDN or Cloudflare

## Support & Documentation

- **Design Spec**: `/DESIGN_HANDOFF.md`
- **Offline Guide**: `/OFFLINE_MODE.md`
- **UX Features**: `/UX_FEATURES.md`
- **Components**: `/COMPONENT_LIBRARY.md`
- **Notifications**: `/NOTIFICATIONS.md`
- **Security**: `/SECURITY_AND_SEARCH.md`

## Next Steps

1. Review Storybook for all components
2. Check `/DESIGN_HANDOFF.md` for specifications
3. Set up local development environment
4. Create a test component
5. Push to GitHub and deploy to Vercel
