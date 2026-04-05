// Push Notifications Service with Firebase Cloud Messaging
// Handles FCM token registration, notification sending, and handling

import { db } from './firebase';
import { doc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string>;
}

export interface PushNotification {
  id?: string;
  userId: string;
  title: string;
  body: string;
  type: 'application' | 'message' | 'completion' | 'rating' | 'system';
  taskId?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

// Register FCM token
export async function registerFCMToken(userId: string, token: string) {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      fcmTokens: [token],
      lastTokenUpdate: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error registering FCM token:', error);
    throw error;
  }
}

// Request notification permission and get token
export async function requestNotificationPermission(): Promise<string | null> {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return null;
  }

  if (Notification.permission === 'granted') {
    // Get token from service worker
    return getServiceWorkerToken();
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return getServiceWorkerToken();
    }
  }
  return null;
}

// Get FCM token from service worker
async function getServiceWorkerToken(): Promise<string | null> {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      // This would be implemented in the service worker
      return 'fcm-token-placeholder';
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  return null;
}

// Store notification in Firestore for history
export async function storeNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  taskId?: string
) {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      body,
      type,
      taskId,
      isRead: false,
      createdAt: Timestamp.now(),
    });
    return notificationRef.id;
  } catch (error) {
    console.error('Error storing notification:', error);
    throw error;
  }
}

// Send notification for new application
export async function notifyNewApplication(
  creatorId: string,
  taskId: string,
  taskTitle: string,
  freelancerName: string
) {
  const title = 'New Application';
  const body = `${freelancerName} applied to "${taskTitle}"`;
  
  return storeNotification(creatorId, title, body, 'application', taskId);
}

// Send notification for new message
export async function notifyNewMessage(
  recipientId: string,
  taskId: string,
  senderName: string
) {
  const title = 'New Message';
  const body = `${senderName} sent you a message`;
  
  return storeNotification(recipientId, title, body, 'message', taskId);
}

// Send notification for task completion
export async function notifyTaskCompletion(
  freelancerId: string,
  taskId: string,
  taskTitle: string
) {
  const title = 'Task Completed';
  const body = `Your work on "${taskTitle}" has been marked complete`;
  
  return storeNotification(freelancerId, title, body, 'completion', taskId);
}

// Send notification for rating received
export async function notifyRatingReceived(
  userId: string,
  raterName: string,
  rating: number
) {
  const title = 'New Rating';
  const body = `${raterName} gave you ${rating} stars`;
  
  return storeNotification(userId, title, body, 'rating');
}
