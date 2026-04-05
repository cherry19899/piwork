/**
 * useAuth Hook
 * Manages authentication state and Pi Network login
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { authenticate, getUser } from '../services/piSdk';
import { db } from '../services/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { requestNotificationPermission, removeFCMToken } from '../services/notifications';

const AUTH_STORAGE_KEY = 'piwork_auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userClaims, setUserClaims] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializingRef = useRef(false);

  // Initialize auth on mount
  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    const initAuth = async () => {
      try {
        // Check localStorage first
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          setUser(authData);
          console.log('[useAuth] User restored from localStorage');
        }

        // Verify with Pi SDK
        const piUser = await getUser();
        if (piUser) {
          setUser(piUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(piUser));
          
          // Fetch custom claims from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', piUser.uid));
            if (userDoc.exists()) {
              setUserClaims({
                arbitrator: userDoc.data().arbitrator || false,
                admin: userDoc.data().admin || false,
                verified: userDoc.data().verified || false
              });
            }
          } catch (err) {
            console.log('[useAuth] Could not load custom claims:', err);
          }
          
          console.log('[useAuth] User verified with Pi SDK');
        }
      } catch (err) {
        console.log('[useAuth] No active session');
        setError(null); // Not an error, just not logged in
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Authenticate with Pi
      const authResult = await authenticate();
      console.log('[useAuth] Authentication result:', authResult);

      // Get user data
      const piUser = await getUser();
      
      // Check if first login
      const userRef = doc(db, 'users', piUser.uid);
      const userSnap = await getDoc(userRef);
      const isFirstLogin = !userSnap.exists();

      // Save/update user in Firestore
      const userData = {
        uid: piUser.uid,
        username: piUser.username,
        walletAddress: piUser.walletAddress,
        isFirstLogin,
        createdAt: isFirstLogin ? new Date().toISOString() : userSnap.data()?.createdAt,
        lastLogin: new Date().toISOString(),
      };

      if (isFirstLogin) {
        await setDoc(userRef, userData);
        console.log('[useAuth] New user created in Firestore');
      } else {
        await updateDoc(userRef, { lastLogin: new Date().toISOString() });
        console.log('[useAuth] User login updated');
      }

      // Set user state and localStorage
      setUser(piUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(piUser));
      console.log('[useAuth] Login successful');

      // Request FCM permission on first login
      if (isFirstLogin) {
        try {
          await requestNotificationPermission(piUser.uid);
          console.log('[useAuth] FCM permission requested');
        } catch (err) {
          console.log('[useAuth] FCM permission error (non-critical):', err);
        }
      }

      return piUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('[useAuth] Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Remove FCM token from Firestore
      if (user?.uid) {
        try {
          // Get current token from localStorage or sessionStorage
          const tokenKey = 'piwork_fcm_token';
          const token = localStorage.getItem(tokenKey);
          if (token) {
            await removeFCMToken(user.uid, token);
          }
        } catch (err) {
          console.log('[useAuth] FCM token removal error (non-critical):', err);
        }
      }
      
      // Clear localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.clear();
      
      // Clear state
      setUser(null);
      setError(null);
      
      console.log('[useAuth] Logout successful');
      
      // Redirect to login
      window.location.href = '/login';
    } catch (err) {
      console.error('[useAuth] Logout error:', err);
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user && !loading;

  return {
    user,
    userClaims,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };
};

export default useAuth;
