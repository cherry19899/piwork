// Firebase Operations Utilities for Piwork
// High-level operations using properly indexed queries

import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import {
  PiWorkTask,
  PiWorkUser,
  PiWorkMessage,
} from '@/lib/firebase-schema';

/**
 * Get task feed for home page
 * Uses: tasks.status + tasks.created_at index
 */
export async function getTaskFeed(pageSize: number = 20) {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('status', '==', 'open'),
      orderBy('created_at', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkTask & { id: string })[];
  } catch (error) {
    console.error('[v0] Error fetching task feed:', error);
    throw error;
  }
}

/**
 * Get tasks created by user
 * Uses: tasks.creator_uid + tasks.status index
 */
export async function getUserTasks(userId: string) {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('creator_uid', '==', userId),
      where('status', 'in', ['open', 'assigned', 'in_progress', 'completed']),
      limit(50)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkTask & { id: string })[];
  } catch (error) {
    console.error('[v0] Error fetching user tasks:', error);
    throw error;
  }
}

/**
 * Get freelancer's active tasks
 * Uses: tasks.assigned_to + tasks.status index
 */
export async function getFreelancerDashboard(userId: string) {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('assigned_to', '==', userId),
      where('status', 'in', ['assigned', 'in_progress']),
      limit(50)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkTask & { id: string })[];
  } catch (error) {
    console.error('[v0] Error fetching freelancer dashboard:', error);
    throw error;
  }
}

/**
 * Filter tasks by category and budget
 * Uses: tasks.category + tasks.budget index
 */
export async function filterTasksByCategory(
  category: string,
  maxBudget: number,
  pageSize: number = 20
) {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('category', '==', category),
      where('budget', '<=', maxBudget),
      where('status', '==', 'open'),
      orderBy('budget', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkTask & { id: string })[];
  } catch (error) {
    console.error('[v0] Error filtering tasks:', error);
    throw error;
  }
}

/**
 * Get message history for a task
 * Uses: messages.task_id + messages.timestamp index
 */
export async function getMessageHistory(taskId: string, pageSize: number = 50) {
  try {
    const q = query(
      collection(db, 'messages'),
      where('task_id', '==', taskId),
      orderBy('timestamp', 'desc'),
      limit(pageSize)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkMessage & { id: string })[];
  } catch (error) {
    console.error('[v0] Error fetching message history:', error);
    throw error;
  }
}

/**
 * Find expired tasks (called by scheduled function)
 * Uses: tasks.deadline index
 */
export async function findExpiredTasks() {
  try {
    const now = new Date();
    const q = query(
      collection(db, 'tasks'),
      where('deadline', '<', now),
      where('status', 'in', ['open', 'assigned']),
      limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (PiWorkTask & { id: string })[];
  } catch (error) {
    console.error('[v0] Error finding expired tasks:', error);
    throw error;
  }
}

/**
 * Increment unread message count for user
 */
export async function incrementUnreadMessages(userId: string, increment: number = 1) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      unread_message_count: increment(increment),
    });
    console.log('[v0] Incremented unread messages for', userId);
  } catch (error) {
    console.error('[v0] Error incrementing unread messages:', error);
    throw error;
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  newStatus: string
) {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: newStatus,
      updated_at: serverTimestamp(),
    });
    console.log('[v0] Updated task', taskId, 'status to', newStatus);
  } catch (error) {
    console.error('[v0] Error updating task status:', error);
    throw error;
  }
}
