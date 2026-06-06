'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface PiUser {
  uid: string;
  username: string;
  payments_enabled?: boolean;
  balance_connects?: number;
  role?: string;
}

export function useAuth(redirectIfNoAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<PiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('piUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.uid) {
          setUser(parsed);
        } else if (redirectIfNoAuth) {
          router.replace('/login');
        }
      } else if (redirectIfNoAuth) {
        router.replace('/login');
      }
    } catch {
      if (redirectIfNoAuth) router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, [router, redirectIfNoAuth]);

  const logout = () => {
    localStorage.removeItem('piUser');
    localStorage.removeItem('authToken');
    router.replace('/login');
  };

  return { user, loading, logout };
}
