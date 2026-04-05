import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthContext } from '../contexts/AuthContext';
import Button from '../components/Button';
import styles from './DisputeModal.module.css';

export default function DisputeModal({ taskId, isOpen, onClose, task }) {
  const { user, userClaims } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  // Check if user is arbitrator
  const isArbitrator = userClaims?.arbitrator === true;

  // Load dispute messages
  useEffect(() => {
    if (!isOpen || !taskId) return;

    const loadMessages = async () => {
      try {
        const q = query(
          collection(db, 'messages'),
          where('taskId', '==', taskId),
          orderBy('timestamp', 'asc')
        );

        const snapshot = await getDocs(q);
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));

        setMessages(msgs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setLoading(false);
      }
    };

    loadMessages();
  }, [isOpen, taskId]);

  // Resolve for client (return Pi)
  const handleResolveForClient = async () => {
    if (!isArbitrator || !task) return;

    setResolving(true);
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskDoc);

      if (!taskSnap.exists()) throw new Error('Task not found');

      const taskData = taskSnap.data();

      // Update task status
      await updateDoc(taskDoc, {
        status: 'resolved_client',
        resolvedBy: user.uid,
        resolution: 'client',
        resolvedAt: new Date(),
        notes: 'Dispute resolved in favor of client'
      });

      // Return funds to client - would trigger Pi SDK payment refund
      console.log(`[v0] Resolving dispute for client: ${taskData.clientId} - ${taskData.budget}π`);

      setShowConfirm(null);
      alert('Dispute resolved for client');
      onClose();
    } catch (error) {
      console.error('Error resolving for client:', error);
      alert('Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  };

  // Resolve for freelancer (pay)
  const handleResolveForFreelancer = async () => {
    if (!isArbitrator || !task) return;

    setResolving(true);
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskDoc);

      if (!taskSnap.exists()) throw new Error('Task not found');

      const taskData = taskSnap.data();

      // Update task status
      await updateDoc(taskDoc, {
        status: 'resolved_freelancer',
        resolvedBy: user.uid,
        resolution: 'freelancer',
        resolvedAt: new Date(),
        notes: 'Dispute resolved in favor of freelancer'
      });

      // Release funds to freelancer - would trigger Pi SDK payment completion
      console.log(`[v0] Resolving dispute for freelancer: ${taskData.freelancerId} - ${taskData.budget}π`);

      setShowConfirm(null);
      alert('Dispute resolved for freelancer');
      onClose();
    } catch (error) {
      console.error('Error resolving for freelancer:', error);
      alert('Failed to resolve dispute');
    } finally {
      setResolving(false);
    }
  };

  // Request more info
  const handleRequestInfo = async () => {
    if (!isArbitrator || !task) return;

    setResolving(true);
    try {
      const taskDoc = doc(db, 'tasks', taskId);
      await updateDoc(taskDoc, {
        disputeStatus: 'awaiting_info',
        infoRequestedAt: new Date(),
        infoRequestedBy: user.uid
      });

      alert('Information request sent to both parties');
      setShowConfirm(null);
    } catch (error) {
      console.error('Error requesting info:', error);
      alert('Failed to request information');
    } finally {
      setResolving(false);
    }
  };

  if (!isOpen) return null;

  if (!isArbitrator) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.error}>
            <h2>Access Denied</h2>
            <p>Only arbitrators can resolve disputes.</p>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h1>Dispute Resolution</h1>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.taskInfo}>
          <h2>{task?.title}</h2>
          <div className={styles.parties}>
            <div className={styles.party}>
              <span className={styles.label}>Client:</span>
              <span>{task?.clientName}</span>
            </div>
            <div className={styles.party}>
              <span className={styles.label}>Freelancer:</span>
              <span>{task?.freelancerName}</span>
            </div>
            <div className={styles.party}>
              <span className={styles.label}>Amount:</span>
              <span className={styles.budget}>{task?.budget}π</span>
            </div>
          </div>
        </div>

        <div className={styles.messagesSection}>
          <h3>Message History</h3>
          {loading ? (
            <div className={styles.loading}>Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className={styles.empty}>No messages in this dispute</div>
          ) : (
            <div className={styles.messages}>
              {messages.map(msg => (
                <div key={msg.id} className={styles.message}>
                  <img
                    src={msg.senderAvatar || '/default-avatar.png'}
                    alt={msg.senderName}
                    className={styles.avatar}
                  />
                  <div className={styles.messageContent}>
                    <div className={styles.messageName}>{msg.senderName}</div>
                    <div className={styles.messageText}>{msg.text}</div>
                    <div className={styles.time}>
                      {msg.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {showConfirm ? (
            <div className={styles.confirmBox}>
              <p>{showConfirm}</p>
              <div className={styles.confirmButtons}>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setShowConfirm(null)}
                  disabled={resolving}
                >
                  Cancel
                </Button>
                <Button
                  variant={showConfirm.includes('client') ? 'secondary' : 'danger'}
                  size="md"
                  loading={resolving}
                  onClick={
                    showConfirm.includes('client')
                      ? handleResolveForClient
                      : handleResolveForFreelancer
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowConfirm('Are you sure you want to resolve this dispute for the client and return their payment?')}
                disabled={resolving}
              >
                ↩ Resolve for Client
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowConfirm('Are you sure you want to resolve this dispute for the freelancer and release the payment?')}
                disabled={resolving}
              >
                ✓ Resolve for Freelancer
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleRequestInfo()}
                loading={resolving}
              >
                ❓ Request More Info
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
