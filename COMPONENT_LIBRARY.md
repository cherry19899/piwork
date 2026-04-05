# PiWork Component Library

A comprehensive, accessible component library for the PiWork micro-freelancing platform built with React and TypeScript.

## Components

### Buttons

#### AccessibleButton
- **Variants**: `primary`, `secondary`, `danger`, `ghost`
- **Sizes**: `sm` (40px), `md` (48px), `lg` (56px)
- **Features**: 
  - Full keyboard support with visible focus (2px purple outline)
  - Loading state with spinner
  - Minimum 48px touch targets
  - ARIA labels and descriptions
  - Scale animation on click (0.97)

```tsx
import { AccessibleButton } from '@/components/ui/accessible-button';

<AccessibleButton
  variant="primary"
  size="md"
  onClick={() => console.log('clicked')}
  ariaLabel="Submit form"
>
  Submit
</AccessibleButton>
```

### Inputs

#### AccessibleInput
- **Types**: `text`, `number`, `email`, `password`, `tel`
- **Features**:
  - Label with required indicator
  - Error messages with ARIA alerts
  - Focus highlight (2px colored border)
  - Auto-complete support
  - Required field validation

#### AccessibleTextarea
- Multiple rows support
- Auto-resize capability
- Same error handling as input

#### AccessibleSelect
- Keyboard navigation
- Option grouping ready
- Error state support

```tsx
import { AccessibleInput, AccessibleTextarea, AccessibleSelect } from '@/components/ui/accessible-input';

<AccessibleInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  required
  error={error}
  onChange={(value) => setEmail(value)}
/>

<AccessibleSelect
  label="Category"
  options={[
    { value: 'design', label: 'Design' },
    { value: 'writing', label: 'Writing' },
  ]}
  onChange={(value) => setCategory(value)}
/>
```

### Cards & Content

#### AccessibleCard
- **Variants**: `task`, `user`, `review`
- **Features**:
  - Keyboard interactive (Enter/Space to activate)
  - Hover effects and elevation
  - Semantic HTML (article/button)
  - ARIA roles and labels

#### AccessibleBadge
- **Variants**: `status`, `notification`, `rating`
- **Features**: 
  - Color-coded for different types
  - Semantic roles
  - Accessible labels

#### AccessibleAvatar
- **Sizes**: `sm` (32px), `md` (40px), `lg` (80px)
  - Image support with alt text
  - Fallback initials or letters
  - Circular with centered content

#### AccessibleIcon
- **Sizes**: `compact` (20px), `default` (24px)
- **Features**:
  - Screen reader labels
  - Aria-hidden for decorative icons
  - Semantic role handling

```tsx
import { AccessibleCard, AccessibleBadge, AccessibleAvatar, AccessibleIcon } from '@/components/ui/accessible-card';

<AccessibleCard variant="task" ariaLabel="Design project">
  <h3>UI Design</h3>
  <AccessibleBadge variant="status">Open</AccessibleBadge>
</AccessibleCard>

<AccessibleAvatar size="md" alt="User profile" initials="JD" />
```

## Accessibility Features

### Contrast & Color
- **Minimum contrast ratio**: 4.5:1 for all text
- **Color-coded states**: Primary (purple), Success (green), Danger (red)
- **Not reliant on color alone**: Icons and text labels included

### Focus & Navigation
- **Visible focus states**: 2px purple outline with 2px offset
- **Keyboard support**: All interactive elements keyboard accessible
- **Tab order**: Logical and intuitive
- **Skip links**: Available for power users

### Touch & Interaction
- **Minimum touch targets**: 48px × 48px for all interactive elements
- **Visual feedback**: Scale animations on interaction
- **Loading states**: Clear feedback during async operations

### Motion & Animation
- **Reduced motion support**: All animations respect `prefers-reduced-motion`
- **Page transitions**: 300ms slide animations (disabled on reduced motion)
- **Component animations**: 200ms stagger for list items

### Screen Readers
- **ARIA labels**: All interactive elements have accessible names
- **ARIA descriptions**: Additional context where needed
- **ARIA live regions**: Error messages announced
- **Role attributes**: Proper semantic roles for all components

### Text & Typography
- **Font scaling**: Responsive sizing with CSS clamp
- **Line height**: 1.4-1.6 for body text
- **Font families**: System fonts for optimal rendering

## Usage in Pages

### Feed Page
Uses responsive grid (2 columns on tablet+) with:
- Skeleton loaders during fetch
- Staggered card animations (50ms between items)
- Pull-to-refresh indicator
- Accessible category filters

### Chat Page
Features:
- Message animations (200ms slide up)
- Loading states in send button
- Keyboard input (Enter to send)
- Split-view on tablets (40% list / 60% messages)

### Profile Page
Includes:
- Tab navigation with keyboard support
- Portfolio grid with 1:1 aspect ratio
- Review cards with ratings and dates
- Floating action button

## Storybook

View all components in isolation:

```bash
npm run storybook
```

Storybook includes:
- All component variants
- Interactive controls
- Accessibility panel
- Mobile/tablet/desktop viewports
- Dark mode testing

## Testing Accessibility

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with VoiceOver (macOS/iOS) or NVDA (Windows)
3. **Contrast Checker**: Verify 4.5:1 minimum ratio
4. **Color Blindness**: Test with simulator tools
5. **Reduced Motion**: Enable in OS settings and verify animations are disabled

## Contributing

When adding new components:

1. Include `aria-label` or `aria-describedby` for all interactive elements
2. Ensure minimum 48px × 48px touch targets
3. Add visible focus styles (2px purple outline)
4. Respect `prefers-reduced-motion` media query
5. Add Storybook stories with all variants
6. Test with keyboard and screen reader
7. Verify 4.5:1 contrast ratio
