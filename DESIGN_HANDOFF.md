# PiWork UI Design Handoff Specification

## Overview
Complete design system and implementation specifications for PiWork mobile-first platform built on Pi Network.

## Grid System & Spacing
All spacing follows strict 4px grid system for consistency and alignment.

### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Application
- Padding/margins always use multiples of 4px
- Component internal spacing uses grid multiples
- Responsive breakpoints maintain grid alignment

## Color System

### Primary Palette (HEX)
- **Primary (Brand)**: #8B5CF6 (Violet)
- **Secondary**: #6B7280 (Gray)
- **Success**: #22C55E (Green)
- **Warning**: #F59E0B (Amber/Yellow)
- **Danger**: #EF4444 (Red)

### Dark Theme (OLED Optimized)
- **Background Primary**: #000000
- **Background Secondary**: #1A1A1A
- **Background Tertiary**: #2A2A2A
- **Border**: #2A2A2A
- **Text Primary**: #FFFFFF
- **Text Secondary**: #737373

### Contrast Ratios (WCAG AA)
- All text: minimum 4.5:1 for normal text, 3:1 for large text
- Interactive elements: 3:1 minimum

## Typography

### Font Families
- **Display/Headings**: System -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Body**: Same system font stack
- **Mono**: Menlo, Monaco, Courier New

### Type Scale (px)
- **h1**: 28px, weight 700, line-height 1.2
- **h2**: 24px, weight 700, line-height 1.2
- **h3**: 20px, weight 700, line-height 1.3
- **body**: 14px, weight 400, line-height 1.5
- **small**: 12px, weight 400, line-height 1.4
- **tiny**: 10px, weight 400, line-height 1.3

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Component Specifications

### Buttons
- **Height**: 48px (48px touch target)
- **Border Radius**: 12px
- **Font Size**: 14px
- **Font Weight**: 600
- **States**: Default, Hover, Active, Disabled, Loading
- **Variants**: Primary, Secondary, Danger, Ghost
- **Sizes**: Small (40px), Medium (48px), Large (56px)

### Input Fields
- **Height**: 48px
- **Border Radius**: 12px
- **Padding**: 16px (md)
- **Font Size**: 14px
- **Border**: 1px solid border color
- **States**: Default, Focus (2px purple outline), Error, Disabled

### Cards
- **Border Radius**: 12px (lg)
- **Padding**: 16px (md)
- **Border**: 1px solid border
- **Shadow**: None (OLED design)
- **Spacing**: 16px (md) gap between cards

### Modals
- **Overlay**: rgba(0, 0, 0, 0.8)
- **Container**: Max-width 360px
- **Border Radius**: 16px
- **Background**: #1A1A1A
- **Padding**: 24px (lg)
- **Animation**: Fade in 200ms, Scale 0.95→1

### Navigation (Bottom)
- **Height**: 64px (mobile), 80px (tablet 768px+)
- **Icon Size**: 24px (mobile), 32px (tablet)
- **Background**: #1A1A1A with backdrop blur
- **Border**: 1px solid border color

## Responsive Breakpoints

### Mobile First
- **Default**: 0px - 767px
- **Tablet**: 768px+
- **Desktop**: 1024px+ (max-width constraint)

### Layout Changes
- Feed: 1 column mobile → 2 columns tablet
- Chat: Full-width mobile → 40/60 split tablet
- Navigation: 64px height mobile → 80px tablet

## Animation Specifications

### Timing Functions
- **Ease-out**: Most transitions
- **Ease-in-out**: Smooth, sustained movements
- **Linear**: Rotations (spinners)

### Duration Standards
- **Fast**: 100ms (button clicks)
- **Standard**: 200ms (modals, state changes)
- **Slow**: 300ms (page transitions)

### Common Animations
- **Slide from right**: 300ms ease-out
- **Slide from left**: 300ms ease-out (back)
- **Fade in**: 200ms ease-out
- **Scale**: 200ms ease-out (0.95→1)
- **Pulse**: 1.5s ease-in-out infinite

## Assets Specifications

### Icons
- **Format**: SVG
- **Default Size**: 24px
- **Compact Size**: 20px
- **Large Size**: 32px
- **Viewbox**: 24x24
- **Stroke Width**: 1.5px

### Illustrations
- **Format**: PNG
- **Resolution**: 2x (retina)
- **Typical Sizes**: 200px, 300px (2x = 400px, 600px files)
- **Color Space**: sRGB
- **Format**: PNG-24 with transparency

### Animations (Lottie)
- **Format**: JSON (Lottie)
- **Framerate**: 30fps
- **Loop**: Yes for infinite animations
- **Duration**: Keep under 2 seconds for most interactions

## CSS Variables for Theming

### Color Tokens
```css
:root {
  --color-primary: #8B5CF6;
  --color-secondary: #6B7280;
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  
  --color-bg-primary: #000000;
  --color-bg-secondary: #1A1A1A;
  --color-bg-tertiary: #2A2A2A;
  --color-border: #2A2A2A;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #737373;
}
```

### Spacing Tokens
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}
```

### Typography Tokens
```css
:root {
  --font-family-system: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-size-h1: 28px;
  --font-size-h2: 24px;
  --font-size-body: 14px;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
}
```

## Accessibility Requirements

### WCAG AA Compliance
- Minimum contrast ratio 4.5:1 for normal text
- Minimum contrast ratio 3:1 for large text
- All interactive elements 48px minimum touch target
- Visible focus indicators (2px purple outline with 2px offset)

### Screen Reader Support
- Semantic HTML (button, input, section, etc.)
- ARIA labels for icons and visual elements
- ARIA live regions for dynamic content
- Proper heading hierarchy (h1, h2, h3)

### Keyboard Navigation
- Tab order follows visual order
- Focus visible on all interactive elements
- Escape to dismiss modals
- Enter/Space to activate buttons

### Motion Preferences
- Respect `prefers-reduced-motion` media query
- Disable all animations when requested
- Maintain functionality without animations

## Platform-Specific Guidelines

### iOS
- Safe area padding: 0 (handled by system)
- Gesture support: Swipe, long press, double tap
- Status bar: Light content
- Web App Icon: 180x180px

### Android
- Safe area padding: System managed
- Gesture support: Full touch support
- Status bar: Light content
- Web App Icon: 192x192px

## Build & Export Instructions

### Figma to Development
1. Export components as SVG (icons) or PNG 2x (illustrations)
2. Use figma2code or Manual implementation
3. Maintain layer naming conventions
4. Document component variations

### Storybook Specifications
- Component per file: `/components/ui/[name].tsx`
- Story per component: `/components/ui/[name].stories.tsx`
- Props documented with JSDoc
- Visual regression tests for each variant

### Design Assets Organization
```
public/
├── icons/          (SVG, 24px)
├── illustrations/  (PNG 2x)
└── animations/     (Lottie JSON)

components/ui/
├── [component].tsx
└── [component].stories.tsx
```

## Implementation Checklist

- [ ] All spacing uses 4px grid multiples
- [ ] All colors use HEX codes from palette
- [ ] Typography uses px with specified weights
- [ ] Components have Storybook stories
- [ ] Accessibility WCAG AA compliant
- [ ] Animations use specified durations
- [ ] Responsive breakpoints implemented
- [ ] CSS variables defined for theming
- [ ] Assets exported at correct specifications
- [ ] Cross-browser tested
- [ ] Mobile tested on iOS and Android
