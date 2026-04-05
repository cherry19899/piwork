// Week 5: Applications and Selection System
// Handles freelancer applications to jobs with notifications

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface Application {
  id?: string;
  taskId: string;
  freelancerId: string;
  freelancerName: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function submitApplication(
  taskId: string,
  freelancerId: string,
  freelancerName: string,
  message: string
) {
  try {
    const applicationRef = await addDoc(collection(db, 'applications'), {
      taskId,
      freelancerId,
      freelancerName,
      message,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return applicationRef.id;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
}

export async function getApplicationsForTask(taskId: string) {
  try {
    const q = query(collection(db, 'applications'), where('taskId', '==', taskId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function selectFreelancer(taskId: string, applicationId: string, taskStatus: string = 'in-progress') {
  try {
    const appDoc = doc(db, 'applications', applicationId);
    await updateDoc(appDoc, {
      status: 'accepted',
      updatedAt: Timestamp.now(),
    });

    const taskDoc = doc(db, 'tasks', taskId);
    await updateDoc(taskDoc, {
      status: taskStatus,
      selectedApplicationId: applicationId,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error selecting freelancer:', error);
    throw error;
  }
}
