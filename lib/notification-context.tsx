'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  icon?: string;
  action?: {
    label: string;
    callback: () => void;
  };
  groupId?: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp'>) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: Date.now(),
      };

      setNotifications((prev) => {
        const updated = [...prev, newNotification];

        // Group notifications by chatId, max 3 per group
        if (notification.groupId) {
          const groupCount = updated.filter((n) => n.groupId === notification.groupId).length;
          if (groupCount > 3) {
            // Remove oldest notification from this group
            const oldestInGroup = updated.find((n) => n.groupId === notification.groupId);
            if (oldestInGroup) {
              return updated.filter((n) => n.id !== oldestInGroup.id);
            }
          }
        }

        return updated;
      });

      // Auto-remove after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
