/**
 * Notification Service
 * Handles FCM push notifications, permissions, and token management
 */

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db } from './firebase';
import { doc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

let messaging = null;

// Initialize FCM messaging
export const initializeMessaging = () => {
  try {
    if (!messaging) {
      messaging = getMessaging();
    }
    return messaging;
  } catch (error) {
    console.log('[FCM] Messaging not available:', error);
    return null;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId) => {
  if (!('Notification' in window)) {
    console.log('[Notifications] Notifications not supported');
    return null;
  }

  try {
    // Check if service worker is available
    if (!('serviceWorker' in navigator)) {
      console.log('[FCM] Service Worker not supported');
      return null;
    }

    // Register service worker
    await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });

    const msg = initializeMessaging();
    if (!msg) return null;

    // Request permission
    if (Notification.permission === 'granted') {
      const token = await getToken(msg, {
        vapidKey: process.env.REACT_APP_FCM_VAPID_KEY,
      });
      
      if (token && userId) {
        await saveFCMToken(userId, token);
      }
      
      return token;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(msg, {
          vapidKey: process.env.REACT_APP_FCM_VAPID_KEY,
        });
        
        if (token && userId) {
          await saveFCMToken(userId, token);
        }
        
        return token;
      }
    }
  } catch (error) {
    console.error('[FCM] Error requesting permission:', error);
  }

  return null;
};

// Save FCM token to Firestore
export const saveFCMToken = async (userId, token) => {
  if (!userId || !token) return;

  try {
    const userTokensRef = doc(db, `users/${userId}`);
    await setDoc(
      userTokensRef,
      {
        fcmTokens: arrayUnion(token),
        lastTokenUpdate: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log('[FCM] Token saved to Firestore');
  } catch (error) {
    console.error('[FCM] Error saving token:', error);
  }
};

// Remove FCM token from Firestore (logout)
export const removeFCMToken = async (userId, token) => {
  if (!userId || !token) return;

  try {
    const userTokensRef = doc(db, `users/${userId}`);
    await setDoc(
      userTokensRef,
      {
        fcmTokens: arrayRemove(token),
      },
      { merge: true }
    );
    console.log('[FCM] Token removed from Firestore');
  } catch (error) {
    console.error('[FCM] Error removing token:', error);
  }
};

// Listen for foreground notifications
export const listenToForegroundNotifications = (callback) => {
  try {
    const msg = initializeMessaging();
    if (!msg) return () => {};

    return onMessage(msg, (payload) => {
      console.log('[FCM] Foreground notification:', payload);
      
      if (callback) {
        callback({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data,
        });
      }
    });
  } catch (error) {
    console.error('[FCM] Error listening to messages:', error);
    return () => {};
  }
};

// Send notification (client-side trigger for testing)
export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pi-icon.svg',
      badge: '/pi-badge.svg',
      tag: 'piwork',
      ...options,
    });
  }
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Short, non-intrusive beep: 880Hz for 100ms
    oscillator.frequency.value = 880;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.log('[Audio] Could not play notification sound:', error);
  }
};

export default {
  initializeMessaging,
  requestNotificationPermission,
  saveFCMToken,
  removeFCMToken,
  listenToForegroundNotifications,
  sendNotification,
  playNotificationSound,
};
