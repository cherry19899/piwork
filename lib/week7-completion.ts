// Week 7: Deal Completion and Rating System
// Handles deal completion, payment confirmation, and mutual rating

import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { completePayment } from './pi-payment';

export interface Transaction {
  id?: string;
  taskId: string;
  taskTitle: string;
  taskAmount: number;
  paymentId: string;
  completedBy: string;
  completedAt: Timestamp;
  status: 'completed' | 'failed';
}

export interface Rating {
  id?: string;
  taskId: string;
  ratedBy: string;
  ratedUser: string;
  rating: number; // 1-5
  comment: string;
  categories: {
    quality: number;
    communication: number;
    speed: number;
    professionalism: number;
  };
  createdAt: Timestamp;
}

export async function completeTask(
  taskId: string,
  paymentId: string,
  taskTitle: string,
  taskAmount: number
) {
  try {
    // Call Pi payment completion
    const paymentResult = await completePayment(paymentId);

    if (!paymentResult) {
      throw new Error('Payment completion failed');
    }

    // Record transaction
    const txRef = await addDoc(collection(db, 'transactions'), {
      taskId,
      taskTitle,
      taskAmount,
      paymentId,
      completedAt: Timestamp.now(),
      status: 'completed',
    } as Transaction);

    // Update task status
    const taskDoc = doc(db, 'tasks', taskId);
    await updateDoc(taskDoc, {
      status: 'completed',
      completedAt: Timestamp.now(),
      transactionId: txRef.id,
    });

    return txRef.id;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
}

export async function submitRating(
  taskId: string,
  ratedBy: string,
  ratedUser: string,
  rating: number,
  comment: string,
  categories: { quality: number; communication: number; speed: number; professionalism: number }
) {
  try {
    const ratingRef = await addDoc(collection(db, 'ratings'), {
      taskId,
      ratedBy,
      ratedUser,
      rating,
      comment,
      categories,
      createdAt: Timestamp.now(),
    });

    // Update user reputation (using weighted review system)
    const userRatingsQuery = query(collection(db, 'ratings'), where('ratedUser', '==', ratedUser));
    const userRatings = await getDocs(userRatingsQuery);
    
    const totalRating = userRatings.docs.reduce((sum, doc) => sum + doc.data().rating, 0);
    const averageRating = totalRating / (userRatings.docs.length || 1);

    const userDoc = doc(db, 'users', ratedUser);
    await updateDoc(userDoc, {
      averageRating,
      totalReviews: userRatings.docs.length,
    });

    return ratingRef.id;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
}

export async function getRatingsForUser(userId: string) {
  try {
    const q = query(collection(db, 'ratings'), where('ratedUser', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating));
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
}
