'use client';

import { useNotifications } from '@/lib/notification-context';
import { notificationService } from '@/lib/notification-service';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';

export function NotificationDemo() {
  const { addNotification } = useNotifications();

  const handleSendInAppNotification = (type: 'info' | 'success' | 'error' | 'warning') => {
    const messages = {
      info: {
        title: 'New Message',
        message: 'You have a new message from TechStore',
        icon: '💬',
      },
      success: {
        title: 'Task Completed',
        message: 'Your task has been marked as complete',
        icon: '✓',
      },
      error: {
        title: 'Error',
        message: 'Something went wrong. Please try again.',
        icon: '✕',
      },
      warning: {
        title: 'Warning',
        message: 'Your session will expire soon',
        icon: '⚠️',
      },
    };

    const config = messages[type];
    addNotification({
      title: config.title,
      message: config.message,
      type,
      icon: config.icon,
      action: {
        label: 'View',
        callback: () => console.log('View clicked'),
      },
      groupId: 'demo-group',
    });
  };

  const handleSendSystemNotification = async () => {
    const permission = await notificationService.requestPermission();
    if (permission === 'granted') {
      await notificationService.sendNotification({
        title: 'PiWork Notification',
        body: 'You have a new task available matching your skills!',
        icon: '🎯',
        sound: 'default',
        groupId: 'tasks',
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: PIWORK_THEME.spacing.md,
        padding: PIWORK_THEME.spacing.lg,
      }}
    >
      <h2
        style={{
          fontSize: PIWORK_THEME.typography.h2.fontSize,
          fontWeight: 700,
          margin: 0,
          marginBottom: PIWORK_THEME.spacing.md,
        }}
      >
        Notification Examples
      </h2>

      {/* In-app notifications */}
      <div>
        <h3
          style={{
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            margin: '0 0 ' + PIWORK_THEME.spacing.md + 'px 0',
            color: PIWORK_THEME.colors.textSecondary,
          }}
        >
          In-App Notifications
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: PIWORK_THEME.spacing.sm,
          }}
        >
          {(['info', 'success', 'error', 'warning'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleSendInAppNotification(type)}
              style={{
                padding: `${PIWORK_THEME.spacing.md}px`,
                backgroundColor: PIWORK_THEME.colors.primary,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: PIWORK_THEME.radius.md,
                fontSize: PIWORK_THEME.typography.body.fontSize,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 200ms ease',
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              Send {type} Notification
            </button>
          ))}
        </div>
      </div>

      {/* System notifications */}
      <div>
        <h3
          style={{
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            margin: '0 0 ' + PIWORK_THEME.spacing.md + 'px 0',
            color: PIWORK_THEME.colors.textSecondary,
          }}
        >
          System Push Notifications
        </h3>
        <button
          onClick={handleSendSystemNotification}
          style={{
            padding: `${PIWORK_THEME.spacing.md}px`,
            backgroundColor: PIWORK_THEME.colors.success,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: PIWORK_THEME.radius.md,
            fontSize: PIWORK_THEME.typography.body.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'all 200ms ease',
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          Send System Notification
        </button>
      </div>
    </div>
  );
}
