'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoLockProps {
  timeoutMinutes?: number;
  onLock: () => void;
  isEnabled?: boolean;
}

export function useAutoLock({
  timeoutMinutes = 5,
  onLock,
  isEnabled = true,
}: UseAutoLockProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = useCallback(() => {
    if (!isEnabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    lastActivityRef.current = Date.now();

    timeoutRef.current = setTimeout(() => {
      onLock();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, onLock, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    // Events to track user activity
    const events = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus',
    ];

    const handleActivity = () => {
      resetTimeout();
    };

    // Initialize timeout
    resetTimeout();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      // Cleanup
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEnabled, resetTimeout]);

  const getTimeUntilLock = useCallback(() => {
    if (!timeoutRef.current) return timeoutMinutes * 60;

    const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
    const remaining = Math.max(0, timeoutMinutes * 60 - elapsed);

    return remaining;
  }, [timeoutMinutes]);

  return { getTimeUntilLock, resetTimeout };
}
