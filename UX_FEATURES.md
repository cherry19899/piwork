# PiWork UX Features Documentation

## Empty States with Illustrations

### Overview
Empty states provide visual feedback when content is unavailable, with SVG illustrations in purple color scheme and clear call-to-action buttons.

### Components

#### EmptyState Component (`/components/empty-states.tsx`)

Three state types with unique illustrations:

**1. No Tasks State**
- Icon: Empty box illustration (SVG)
- Title: "No tasks match filters"
- Description: Encourages filter adjustment
- CTA: "Clear filters" button
- Use when: Task feed has no results

```tsx
<EmptyState
  type="tasks"
  onAction={() => clearFilters()}
/>
```

**2. No Messages State**
- Icon: Empty chat bubble illustration
- Title: "Start conversation"
- Description: Prompts browsing tasks
- CTA: "Browse tasks" button
- Use when: Messages list is empty

```tsx
<EmptyState
  type="messages"
  onAction={() => navigate('/feed')}
/>
```

**3. No Earnings State**
- Icon: Graph illustration
- Title: "Complete your first task"
- Description: Encourages task completion
- CTA: "Find work" button
- Use when: User profile shows zero earnings

```tsx
<EmptyState
  type="earnings"
  onAction={() => navigate('/feed')}
/>
```

### Design System
- Purple color scheme: #8B5CF6 primary
- SVG illustrations scale responsively
- 48px minimum touch target on buttons
- Semantic HTML with proper ARIA labels

---

## Interactive Tooltips

### Overview
Context-aware tooltips guide users through key interactions on first use, with localStorage persistence and "Don't show again" option.

### Component (`/components/interactive-tooltip.tsx`)

**Features:**
- Position support: top, bottom, left, right
- Auto-positioning with arrow indicator
- Dismissable via X button or "Don't show again" checkbox
- localStorage-based persistence
- Smooth fade-in animation

### Onboarding Tooltips

**1. Create Task Tooltip**
```tsx
<InteractiveTooltip
  id="create-task-first"
  text="Tap here to create your first task and start earning Pi"
  position="bottom"
>
  <button>+</button>
</InteractiveTooltip>
```

**2. Set Budget Tooltip**
```tsx
<InteractiveTooltip
  id="set-fair-budget"
  text="Set fair budget that reflects the work complexity"
  position="top"
>
  <input placeholder="Budget in Pi" />
</InteractiveTooltip>
```

**3. First Chat Tooltip**
```tsx
<InteractiveTooltip
  id="send-work-photo"
  text="Send photo of your completed work to get paid"
  position="top"
>
  <button>📎</button>
</InteractiveTooltip>
```

### Storage
- localStorage key: `tooltip-{id}`
- Value: 'true' when dismissed
- Auto-clears on app uninstall

---

## Gestures and Shortcuts

### Hooks (`/hooks/use-gestures.ts`)

#### 1. Swipe Gesture
```tsx
const { onTouchStart, onTouchEnd } = useSwipe(
  () => console.log('Swiped left - Apply'),
  () => console.log('Swiped right - Share'),
  50 // threshold in pixels
);

return <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
```

**Use Cases:**
- Task cards: swipe left to apply, right to share
- Chat messages: swipe actions for reply/delete

#### 2. Long Press Gesture
```tsx
const { onMouseDown, onMouseUp, onMouseLeave } = useLongPress(
  () => showProfilePreview(),
  500 // duration in ms
);

return <div onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
```

**Use Cases:**
- Avatar quick preview on profile page
- Context menu triggers

#### 3. Double Tap Gesture
```tsx
const { handleTap } = useDoubleTap(() => {
  likeMessage();
}, 300);

return <div onDoubleClick={handleTap}>
```

**Use Cases:**
- Like/unlike messages in chat
- Quick reactions

#### 4. Shake Detection
```tsx
useShakeDetection(() => {
  undoLastAction();
}, 15 // threshold
);
```

**Use Cases:**
- Undo functionality on device shake
- Reset filters on home screen

#### 5. Pull to Refresh
```tsx
const { onTouchStart, onTouchMove, onTouchEnd, pullDistance } = usePullToRefresh(
  () => refreshMessages()
);

return <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
```

**Use Cases:**
- Load older messages in chat
- Refresh task feed
- Reload earnings data

### Components Using Gestures

#### SwipeableTaskCard (`/components/swipeable-task-card.tsx`)
- Visual feedback during swipe (left/right action backgrounds)
- Snap animations at thresholds
- Hint text: "← Swipe" for discovery
- Calls onApply on left swipe > 50px
- Calls onShare on right swipe > 50px

#### LikeableMessage (`/components/likeable-message.tsx`)
- Double-tap to like/unlike
- Heart emoji animation (scale + rise + fade)
- Like indicator in timestamp area
- 600ms animation duration

---

## Implementation Checklist

- [ ] Add EmptyState to task feed (no results)
- [ ] Add EmptyState to messages page (no conversations)
- [ ] Add EmptyState to earnings section
- [ ] Wrap + button with tooltip (create-task-first)
- [ ] Wrap budget input with tooltip (set-fair-budget)
- [ ] Wrap paperclip button with tooltip (send-work-photo)
- [ ] Replace regular task cards with SwipeableTaskCard
- [ ] Replace messages with LikeableMessage
- [ ] Add pull-to-refresh to chat page
- [ ] Add shake detection for undo (if applicable)
- [ ] Test all tooltips on first load
- [ ] Verify localStorage persistence
- [ ] Test all gestures on mobile devices

---

## Performance Considerations

1. **Lazy loading animations**: Only load animation styles when needed
2. **Event delegation**: Use passive touch listeners where possible
3. **localStorage limit**: Tooltips use minimal storage (one boolean per ID)
4. **Gesture debouncing**: Swipe and shake events automatically throttled
5. **CSS animations**: Hardware-accelerated with `transform`

---

## Accessibility Notes

- All tooltips include close buttons (X)
- Screen reader labels on checkbox inputs
- Gestures have keyboard alternatives (shortcuts)
- Empty states include semantic HTML
- 2px focus indicator on all interactive elements
