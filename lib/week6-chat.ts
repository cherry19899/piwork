// Week 6: Chat Service with Firebase
// Handles messaging between job creator and freelancer

import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';

export interface Message {
  id?: string;
  taskId: string;
  senderId: string;
  senderName: string;
  content: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export async function sendMessage(
  taskId: string,
  senderId: string,
  senderName: string,
  content: string,
  imageUrl?: string
) {
  try {
    const messageRef = await addDoc(collection(db, 'messages'), {
      taskId,
      senderId,
      senderName,
      content,
      imageUrl,
      isRead: false,
      createdAt: Timestamp.now(),
    });
    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getMessageHistory(taskId: string) {
  try {
    const q = query(
      collection(db, 'messages'),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export function subscribeToMessages(taskId: string, callback: (messages: Message[]) => void) {
  const q = query(
    collection(db, 'messages'),
    where('taskId', '==', taskId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    callback(messages);
  });
}

export async function markMessageAsRead(messageId: string) {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    await updateDoc(messageDoc, { isRead: true });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

export async function compressImage(file: File, maxWidth: number = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) reject(new Error('Could not get canvas context'));

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Could not compress image'));
        }, 'image/jpeg', 0.8);
      };
    };
    reader.onerror = reject;
  });
}
