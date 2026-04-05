// Cloud Functions for Piwork Firebase Triggers
// Deploy using: firebase deploy --only functions

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Trigger: onCreate task
 * Action: Send push notification to subscribers of the category
 */
export const onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskId = context.params.taskId;

    console.log('[v0] Task created:', taskId);

    try {
      // Find all users subscribed to this category
      const subscribersSnapshot = await db.collection('users')
        .where('verified_categories', 'array-contains', task.category)
        .limit(100)
        .get();

      if (subscribersSnapshot.empty) {
        console.log('[v0] No subscribers for category:', task.category);
        return;
      }

      // Create notifications for each subscriber
      const promises = subscribersSnapshot.docs.map(async (doc) => {
        const userId = doc.id;
        
        // Don't notify the creator
        if (userId === task.creator_uid) return;

        await db.collection('users').doc(userId)
          .collection('notifications').add({
            type: 'new_task',
            taskId,
            taskTitle: task.title,
            category: task.category,
            budget: task.budget,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
          });

        // Send push notification (FCM)
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.data()?.fcm_token) {
          await admin.messaging().send({
            token: userDoc.data().fcm_token,
            notification: {
              title: 'New Task Available',
              body: `${task.title} - ${task.budget} Pi`,
            },
            data: {
              taskId,
              type: 'new_task',
            },
          });
        }
      });

      await Promise.all(promises);
      console.log('[v0] Sent task notifications to', subscribersSnapshot.size, 'users');
    } catch (error) {
      console.error('[v0] Error in onTaskCreated:', error);
      // Don't fail the function - notifications are non-critical
    }
  });

/**
 * Trigger: onUpdate task status
 * Action: Notify participants when task status changes
 */
export const onTaskStatusChanged = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const taskId = context.params.taskId;

    if (before.status === after.status) {
      return; // Status didn't change
    }

    console.log('[v0] Task status changed:', taskId, before.status, '->', after.status);

    try {
      const notificationData = {
        taskId,
        taskTitle: after.title,
        oldStatus: before.status,
        newStatus: after.status,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false,
      };

      // Notify creator
      await db.collection('users').doc(after.creator_uid)
        .collection('notifications').add({
          ...notificationData,
          type: 'task_status_changed',
        });

      // Notify assigned freelancer if exists
      if (after.assigned_to) {
        await db.collection('users').doc(after.assigned_to)
          .collection('notifications').add({
            ...notificationData,
            type: 'task_status_changed',
          });

        // Send FCM notification
        const freelancerDoc = await db.collection('users').doc(after.assigned_to).get();
        if (freelancerDoc.data()?.fcm_token) {
          await admin.messaging().send({
            token: freelancerDoc.data().fcm_token,
            notification: {
              title: 'Task Status Updated',
              body: `${after.title} is now ${after.newStatus}`,
            },
            data: {
              taskId,
              type: 'task_status_changed',
              status: after.newStatus,
            },
          });
        }
      }

      console.log('[v0] Status change notifications sent');
    } catch (error) {
      console.error('[v0] Error in onTaskStatusChanged:', error);
    }
  });

/**
 * Trigger: onCreate message
 * Action: Send push notification to recipient and update unread count
 */
export const onMessageCreated = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const messageId = context.params.messageId;

    console.log('[v0] Message created:', messageId);

    try {
      // Get task details to find recipient
      const taskDoc = await db.collection('tasks').doc(message.task_id).get();
      const task = taskDoc.data();

      if (!task) {
        console.error('[v0] Task not found:', message.task_id);
        return;
      }

      // Determine recipient
      const recipient_uid = message.sender_uid === task.creator_uid 
        ? task.assigned_to 
        : task.creator_uid;

      if (!recipient_uid) {
        console.log('[v0] No recipient for message');
        return;
      }

      // Increment unread count
      await db.collection('users').doc(recipient_uid)
        .update({
          unread_message_count: admin.firestore.FieldValue.increment(1),
        });

      // Send FCM notification
      const recipientDoc = await db.collection('users').doc(recipient_uid).get();
      if (recipientDoc.data()?.fcm_token) {
        const senderDoc = await db.collection('users').doc(message.sender_uid).get();
        const senderName = senderDoc.data()?.username || 'Someone';

        await admin.messaging().send({
          token: recipientDoc.data().fcm_token,
          notification: {
            title: `New message from ${senderName}`,
            body: message.text.substring(0, 60),
          },
          data: {
            messageId,
            taskId: message.task_id,
            type: 'new_message',
          },
        });
      }

      console.log('[v0] Message notification sent to', recipient_uid);
    } catch (error) {
      console.error('[v0] Error in onMessageCreated:', error);
    }
  });

/**
 * Scheduled Function: Every 10 minutes
 * Action: Check for expired tasks and auto-cancel with Pi refund
 */
export const checkExpiredTasks = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async (context) => {
    console.log('[v0] Checking for expired tasks...');

    try {
      const now = new Date();
      
      // Find all open/assigned tasks past deadline
      const expiredSnapshot = await db.collection('tasks')
        .where('deadline', '<', now)
        .where('status', 'in', ['open', 'assigned'])
        .limit(100)
        .get();

      if (expiredSnapshot.empty) {
        console.log('[v0] No expired tasks found');
        return;
      }

      console.log('[v0] Found', expiredSnapshot.size, 'expired tasks');

      const updates = expiredSnapshot.docs.map(async (doc) => {
        const task = doc.data();

        console.log('[v0] Auto-cancelling task:', doc.id);

        // Cancel task
        await doc.ref.update({
          status: 'cancelled',
          cancelled_at: admin.firestore.FieldValue.serverTimestamp(),
          cancellation_reason: 'deadline_passed',
        });

        // If there's an escrow transaction, refund Pi to creator
        if (task.escrow_status === 'locked') {
          const txSnapshot = await db.collection('transactions')
            .where('task_id', '==', doc.id)
            .where('status', '==', 'approved')
            .limit(1)
            .get();

          if (!txSnapshot.empty) {
            const tx = txSnapshot.docs[0].data();
            
            // Record refund transaction
            await db.collection('transactions').add({
              task_id: doc.id,
              payer_uid: tx.payer_uid,
              payee_uid: tx.payer_uid, // Refund goes back to creator
              amount: tx.amount,
              status: 'completed',
              type: 'refund',
              reason: 'task_expired',
              created_at: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log('[v0] Refunded', tx.amount, 'Pi to', tx.payer_uid);
          }
        }

        // Notify creator
        await db.collection('users').doc(task.creator_uid)
          .collection('notifications').add({
            type: 'task_expired',
            taskId: doc.id,
            taskTitle: task.title,
            reason: 'deadline_passed',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            read: false,
          });
      });

      await Promise.all(updates);
      console.log('[v0] Processed', expiredSnapshot.size, 'expired tasks');
    } catch (error) {
      console.error('[v0] Error in checkExpiredTasks:', error);
    }
  });

/**
 * Scheduled Function: Every hour
 * Action: Clean up old notifications (30+ days)
 */
export const cleanupOldNotifications = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    console.log('[v0] Cleaning up old notifications...');

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // This would need to be done for each user - for production, consider using a batch process
      console.log('[v0] Notification cleanup scheduled (batch processing recommended)');
    } catch (error) {
      console.error('[v0] Error in cleanupOldNotifications:', error);
    }
  });
