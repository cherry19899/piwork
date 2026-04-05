/**
 * useChat Hook
 * Manages real-time messaging with Firestore
 */

import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useChat = (userId) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's chats
  const fetchChats = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
      );

      const snapshot = await getDocs(q);
      const chatsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setChats(chatsList);
      console.log('[useChat] Fetched', chatsList.length, 'chats');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chats');
      console.error('[useChat] Fetch chats error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Subscribe to chat messages in real-time
  const subscribeToChat = useCallback((chatId) => {
    try {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .reverse();

        setMessages(messagesList);
      });

      return unsubscribe;
    } catch (err) {
      console.error('[useChat] Subscribe error:', err);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (chatId, content, type = 'text') => {
    if (!userId || !content) return;

    try {
      setError(null);

      const message = {
        senderId: userId,
        content,
        type, // 'text', 'image', 'file'
        createdAt: new Date().toISOString(),
        readBy: [userId],
      };

      const docRef = await addDoc(collection(db, `chats/${chatId}/messages`), message);
      console.log('[useChat] Message sent:', docRef.id);

      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      console.error('[useChat] Send error:', err);
      throw err;
    }
  }, [userId]);

  // Create or get chat with another user
  const getOrCreateChat = useCallback(async (otherUserId, taskId) => {
    try {
      setError(null);

      // Check if chat already exists
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', userId)
      );

      const snapshot = await getDocs(q);
      let existingChat = null;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.participants.includes(otherUserId)) {
          existingChat = { id: doc.id, ...data };
        }
      });

      if (existingChat) {
        console.log('[useChat] Using existing chat:', existingChat.id);
        return existingChat;
      }

      // Create new chat
      const newChat = {
        participants: [userId, otherUserId],
        taskId,
        createdAt: new Date().toISOString(),
        lastMessage: null,
        lastMessageAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'chats'), newChat);
      console.log('[useChat] Chat created:', docRef.id);

      return { id: docRef.id, ...newChat };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get/create chat';
      setError(errorMessage);
      console.error('[useChat] Get/Create error:', err);
      throw err;
    }
  }, [userId]);

  return {
    chats,
    messages,
    loading,
    error,
    fetchChats,
    subscribeToChat,
    sendMessage,
    getOrCreateChat,
  };
};

export default useChat;
