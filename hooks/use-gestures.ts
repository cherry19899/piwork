'use client';

import { useEffect, useRef, useCallback } from 'react';

// Swipe gesture hook
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleSwipe = useCallback(() => {
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > threshold;
    const isSwipeRight = distance < -threshold;

    if (isSwipeLeft && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isSwipeRight && onSwipeRight) {
      onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  return { onTouchStart, onTouchEnd };
}

// Long press hook
export function useLongPress(
  callback: () => void,
  duration = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseDown = useCallback(() => {
    timeoutRef.current = setTimeout(callback, duration);
  }, [callback, duration]);

  const onMouseUp = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { onMouseDown, onMouseUp, onMouseLeave };
}

// Double tap hook
export function useDoubleTap(callback: () => void, delay = 300) {
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, delay);
    } else if (tapCountRef.current === 2) {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
      callback();
      tapCountRef.current = 0;
    }
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  return { handleTap };
}

// Shake detection hook
export function useShakeDetection(callback: () => void, threshold = 15) {
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastZRef = useRef(0);
  const countRef = useRef(0);

  useEffect(() => {
    let lastTime = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.acceleration;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        const speed =
          Math.sqrt(x * x + y * y + z * z) /
          (diffTime / 1000);

        if (speed > threshold) {
          countRef.current += 1;
          if (countRef.current > 2) {
            callback();
            countRef.current = 0;
          }
        }
      }
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, [callback, threshold]);
}

// Pull to refresh hook
export function usePullToRefresh(onRefresh: () => void) {
  const touchStartY = useRef(0);
  const pullDistance = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    pullDistance.current = Math.max(0, currentY - touchStartY.current);

    if (pullDistance.current > 80) {
      onRefresh();
      pullDistance.current = 0;
    }
  };

  const onTouchEnd = () => {
    pullDistance.current = 0;
  };

  return { onTouchStart, onTouchMove, onTouchEnd, pullDistance: pullDistance.current };
}
