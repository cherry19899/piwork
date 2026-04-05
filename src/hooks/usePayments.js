/**
 * usePayments Hook
 * Manages Pi Network payments
 */

import { useState, useCallback } from 'react';
import { createPayment, completePayment } from '../services/piSdk';
import { db } from '../services/firebase';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';

export const usePayments = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create payment for task completion
  const createTaskPayment = useCallback(async (taskId, amount, memo) => {
    if (!userId) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Create payment via Pi SDK
      const piPayment = await createPayment({
        amount,
        memo,
        metadata: {
          taskId,
          userId,
          type: 'task_completion',
        },
      });

      // Store payment record in Firestore
      const paymentRecord = {
        piPaymentId: piPayment.identifier,
        taskId,
        userId,
        amount,
        memo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentRecord);
      console.log('[usePayments] Payment initiated:', docRef.id);

      return {
        id: docRef.id,
        ...paymentRecord,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      console.error('[usePayments] Create error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Complete payment transaction
  const completeTaskPayment = useCallback(async (paymentId, piPaymentId, txid) => {
    try {
      setLoading(true);
      setError(null);

      // Verify with Pi SDK
      const piPayment = await completePayment(piPaymentId, txid);

      // Update payment status in Firestore
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status: 'completed',
        txid,
        completedAt: new Date().toISOString(),
      });

      console.log('[usePayments] Payment completed:', paymentId);

      return piPayment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete payment';
      setError(errorMessage);
      console.error('[usePayments] Complete error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel payment
  const cancelPayment = useCallback(async (paymentId) => {
    try {
      setLoading(true);
      setError(null);

      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
      });

      console.log('[usePayments] Payment cancelled:', paymentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel payment';
      setError(errorMessage);
      console.error('[usePayments] Cancel error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTaskPayment,
    completeTaskPayment,
    cancelPayment,
  };
};

export default usePayments;
