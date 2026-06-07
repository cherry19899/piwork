'use client';

import { useEffect, type ReactNode } from "react";
import { PiAuthProvider } from "@/contexts/pi-auth-context";
import { OfflineProvider } from "@/lib/offline-context";
import { OfflineBanner } from "@/components/offline-banner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workpro-api.onrender.com';

export function AppWrapper({ children }: { children: ReactNode }) {
  // On mount, clear any stale pending Pi payments from crashed sessions
  useEffect(() => {
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
        }).catch(() => {});
      } catch (_) {}
    }, 3000);
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
