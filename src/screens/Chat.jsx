import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs, startAfter, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { useAuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import styles from './Chat.module.css';

export default function Chat() {
  const { task_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to messages with real-time updates
  useEffect(() => {
    if (!task_id || !user) return;

    const q = query(
      collection(db, 'messages'),
      where('taskId', '==', task_id),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      }));
      
      setMessages(newMessages.reverse());
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setLoading(false);
    }, error => {
      console.error('Error subscribing to messages:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [task_id, user]);

  // Load older messages
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || !lastVisible || !task_id) return;

    try {
      const q = query(
        collection(db, 'messages'),
        where('taskId', '==', task_id),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible),
        limit(20)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const olderMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date()
      }));

      setMessages(prev => [...olderMessages.reverse(), ...prev]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  }, [task_id, lastVisible, hasMore]);

  // Handle scroll to load more
  const handleScroll = (e) => {
    const element = e.target;
    if (element.scrollTop < 100 && !loading && hasMore) {
      loadMoreMessages();
    }
  };

  // Handle file attachment
  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File too large. Max 10MB.');
        return;
      }
      setAttachments(prev => [...prev, file]);
    });
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;

    setSending(true);
    try {
      const attachmentUrls = [];

      // Upload attachments
      for (const file of attachments) {
        const storageRef = ref(storage, `messages/${task_id}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        attachmentUrls.push({
          name: file.name,
          url: url,
          type: file.type
        });
      }

      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        taskId: task_id,
        senderId: user.uid,
        senderName: user.displayName,
        senderAvatar: user.photoURL,
        text: newMessage,
        attachments: attachmentUrls,
        timestamp: serverTimestamp(),
        read: false
      });

      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Try again.');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Please log in to view messages
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h1>Task Chat</h1>
      </div>

      <div className={styles.messagesContainer} ref={messagesContainerRef} onScroll={handleScroll}>
        {loading && <div className={styles.loading}>Loading messages...</div>}
        
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${msg.senderId === user.uid ? styles.own : styles.other}`}
          >
            <img src={msg.senderAvatar || '/default-avatar.png'} alt={msg.senderName} className={styles.avatar} />
            <div className={styles.messageContent}>
              <div className={styles.messageName}>{msg.senderName}</div>
              <div className={styles.messageText}>{msg.text}</div>
              {msg.attachments?.length > 0 && (
                <div className={styles.attachments}>
                  {msg.attachments.map((att, idx) => (
                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className={styles.attachment}>
                      📎 {att.name}
                    </a>
                  ))}
                </div>
              )}
              <div className={styles.time}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        {attachments.length > 0 && (
          <div className={styles.attachmentsList}>
            {attachments.map((att, idx) => (
              <div key={idx} className={styles.attachmentItem}>
                <span>{att.name}</span>
                <button type="button" onClick={() => removeAttachment(idx)}>✕</button>
              </div>
            ))}
          </div>
        )}
        
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.input}
            disabled={sending}
          />
          
          <label className={styles.attachBtn}>
            📎
            <input
              type="file"
              multiple
              onChange={handleFileAttach}
              style={{ display: 'none' }}
              disabled={sending}
            />
          </label>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={sending}
            disabled={!newMessage.trim() && attachments.length === 0}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
