# Push Notifications System

PiWork features a comprehensive push notification system with both in-app and system notifications.

## In-App Notifications

In-app notifications appear as a banner at the top of the app with automatic grouping and management.

### Features
- **4 Types**: info, success, error, warning
- **Auto-grouping**: Max 3 notifications per group
- **Auto-dismiss**: 5-second timeout
- **Custom Actions**: Optional "View" button with callback
- **Visual Feedback**: Type-specific colors and icons

### Usage

```typescript
import { useNotifications } from '@/lib/notification-context';

export function MyComponent() {
  const { addNotification } = useNotifications();

  const handleAction = () => {
    addNotification({
      title: 'New Message',
      message: 'You received a message from TechStore',
      type: 'info',
      icon: '💬',
      action: {
        label: 'View',
        callback: () => console.log('Viewing message'),
      },
      groupId: 'messages',
    });
  };

  return <button onClick={handleAction}>Show Notification</button>;
}
```

### Types & Colors

- **info** (#3B82F6) - Informational messages
- **success** (#22C55E) - Successful actions
- **error** (#EF4444) - Errors and failures
- **warning** (#F59E0B) - Warnings and alerts

## System Push Notifications

System notifications appear outside the app and use the browser's native notification API.

### Features
- **Permission-based**: Requests user permission first
- **PiWork branding**: Custom icon and badge
- **Non-intrusive sound**: Short 880Hz beep
- **Auto-grouping**: Uses notification tags for grouping (max 3 per group)
- **Auto-close**: 6-second timeout

### Usage

```typescript
import { notificationService } from '@/lib/notification-service';

async function sendNotification() {
  const permission = await notificationService.requestPermission();
  
  if (permission === 'granted') {
    await notificationService.sendNotification({
      title: 'New Task',
      body: 'A new task matching your skills is available',
      icon: '/piwork-icon.png',
      sound: 'default',
      groupId: 'tasks',
    });
  }
}
```

## Setup

### 1. Add NotificationProvider to Layout

```typescript
// app/layout.tsx
import { NotificationProvider } from '@/lib/notification-context';
import { NotificationBanner } from '@/components/notification-banner';

export default function RootLayout({ children }) {
  return (
    <NotificationProvider>
      <NotificationBanner />
      {children}
    </NotificationProvider>
  );
}
```

### 2. Request Permission (Optional)

```typescript
import { notificationService } from '@/lib/notification-service';

// In a useEffect or on user action
const permission = await notificationService.requestPermission();
```

## Settings Integration

Users can manage notification preferences in Settings:

- **New Tasks**: Toggle new task notifications
- **Messages**: Toggle chat and direct message notifications
- **Task Updates**: Toggle task status change notifications
- **Promotions**: Toggle promotional notifications

## Accessibility

All notifications include:
- Proper ARIA labels and roles
- Screen reader announcements via `aria-live="polite"`
- Keyboard dismissible (ESC key support)
- High contrast ratios (4.5:1)
- 48px minimum touch targets for buttons

## Browser Support

- **In-app notifications**: All modern browsers
- **System notifications**: Requires Notifications API support
  - Chrome/Edge: Yes
  - Firefox: Yes
  - Safari: Yes (iOS 15.1+)
  - IE: No

## Best Practices

1. **Don't overwhelm users**: Limit notification frequency
2. **Be specific**: Use clear, concise messages
3. **Provide actions**: Include relevant action buttons
4. **Respect preferences**: Check user settings before sending
5. **Group related notifications**: Use `groupId` for related messages
6. **Use appropriate types**: Choose the right type for context

## Testing

Use the NotificationDemo component to test both notification types:

```typescript
import { NotificationDemo } from '@/components/notification-demo';

export default function TestPage() {
  return <NotificationDemo />;
}
```
