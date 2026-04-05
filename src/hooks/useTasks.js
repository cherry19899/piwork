/**
 * useTasks Hook
 * Manages task fetching, creation, and filtering
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all available tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(collection(db, 'tasks'), where('status', '==', 'open'));
      const snapshot = await getDocs(q);
      
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(tasksList);
      console.log('[useTasks] Fetched', tasksList.length, 'tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('[useTasks] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'tasks'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    });

    return unsubscribe;
  }, [userId]);

  // Create new task
  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);

      const newTask = {
        ...taskData,
        creatorId: userId,
        status: 'open',
        createdAt: new Date().toISOString(),
        applicants: [],
        applications: [],
      };

      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      console.log('[useTasks] Task created:', docRef.id);

      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      console.error('[useTasks] Create error:', err);
      throw err;
    }
  }, [userId]);

  // Update task
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      setError(null);

      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      console.log('[useTasks] Task updated:', taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('[useTasks] Update error:', err);
      throw err;
    }
  }, []);

  // Delete task (only creator)
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);

      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('[useTasks] Task deleted:', taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      console.error('[useTasks] Delete error:', err);
      throw err;
    }
  }, []);

  // Apply for task
  const applyForTask = useCallback(async (taskId, applicationData) => {
    try {
      setError(null);

      const taskRef = doc(db, 'tasks', taskId);
      const application = {
        userId,
        appliedAt: new Date().toISOString(),
        ...applicationData,
      };

      // Add application to task
      await updateDoc(taskRef, {
        applications: [application],
      });

      console.log('[useTasks] Application submitted for task:', taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply';
      setError(errorMessage);
      console.error('[useTasks] Apply error:', err);
      throw err;
    }
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    applyForTask,
  };
};

export default useTasks;
