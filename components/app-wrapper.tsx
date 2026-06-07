'use client';

import { useEffect, type ReactNode } from "react";
import { PiAuthProvider } from "@/contexts/pi-auth-context";
import { OfflineProvider } from "@/lib/offline-context";
import { OfflineBanner } from "@/components/offline-banner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workpro-api.onrender.com';

export function AppWrapper({ children }: { children: ReactNode }) {
  // On mount, clear stale pending Pi payments older than 10 min from crashed sessions
  // Runs once per session with a 30s delay to avoid cancelling in-flight payments
  useEffect(() => {
    const SESSION_KEY = 'piwork_cleared_pending';
    const lastCleared = parseInt(localStorage.getItem(SESSION_KEY) || '0');
    // Only clear once per hour max
    if (Date.now() - lastCleared < 60 * 60 * 1000) return;
    const timer = setTimeout(() => {
      try {
        const uid = JSON.parse(localStorage.getItem('piUser') || 'null')?.uid;
        if (!uid) return;
        const token = localStorage.getItem('authToken');
        fetch(`${API_URL}/api/payments/clear-pending`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': uid,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }).then(() => {
          localStorage.setItem(SESSION_KEY, String(Date.now()));
        }).catch(() => {});
      } catch (_) {}
    }, 30000); // 30s delay — well after any in-flight payment would complete
    return () => clearTimeout(timer);
  }, []);

  return (
    <PiAuthProvider>
      <OfflineProvider>
        <OfflineBanner />
        {children}
      </OfflineProvider>
    </PiAuthProvider>
  );
}
