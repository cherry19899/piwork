'use client';

import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { useNotifications } from '@/lib/notification-context';

export function NotificationBanner() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  const notification = notifications[0];

  const typeColors = {
    info: { bg: '#3B82F6', icon: 'ℹ️' },
    success: { bg: '#22C55E', icon: '✓' },
    error: { bg: '#EF4444', icon: '✕' },
    warning: { bg: '#F59E0B', icon: '⚠️' },
  };

  const typeConfig = typeColors[notification.type];
  const notificationCount = notifications.length;

  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        animation: 'slideDown 300ms ease-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: PIWORK_THEME.spacing.md,
          width: '100%',
          height: 64,
          backgroundColor: '#1A1A1A',
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          borderLeft: `4px solid ${typeConfig.bg}`,
          paddingLeft: PIWORK_THEME.spacing.md,
          paddingRight: PIWORK_THEME.spacing.md,
          animation: 'slideInDown 300ms ease-out',
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: `${typeConfig.bg}20`,
            color: typeConfig.bg,
            flexShrink: 0,
          }}
          role="img"
          aria-label={notification.type}
        >
          {notification.icon || typeConfig.icon}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: PIWORK_THEME.colors.textPrimary,
            }}
          >
            {notification.title}
            {notificationCount > 1 && (
              <span
                style={{
                  marginLeft: PIWORK_THEME.spacing.sm,
                  fontSize: 12,
                  color: PIWORK_THEME.colors.textSecondary,
                  fontWeight: 400,
                }}
              >
                +{notificationCount - 1}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 14,
              color: PIWORK_THEME.colors.textSecondary,
            }}
          >
            {notification.message}
          </div>
        </div>

        {/* View Button */}
        {notification.action && (
          <button
            onClick={() => {
              notification.action?.callback();
              removeNotification(notification.id);
            }}
            style={{
              padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
              backgroundColor: typeConfig.bg,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: PIWORK_THEME.radius.md,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 200ms ease',
              flexShrink: 0,
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            View
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={() => removeNotification(notification.id)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.textSecondary,
            fontSize: 18,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            transition: 'color 200ms ease',
          }}
          aria-label="Close notification"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = PIWORK_THEME.colors.textPrimary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              PIWORK_THEME.colors.textSecondary;
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
