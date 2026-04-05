const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function: sendNotification
 * Sends FCM push notification to a user
 * 
 * Trigger: Callable HTTP function
 * 
 * Parameters:
 * - userId: Recipient user ID
 * - title: Notification title
 * - body: Notification body
 * - data: Additional data object (taskId, type, link, etc.)
 */
exports.sendNotification = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { userId, title, body, data: notificationData } = data;

  if (!userId || !title || !body) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'userId, title, and body are required'
    );
  }

  try {
    // Get user's FCM tokens from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const tokens = userDoc.data().fcmTokens || [];

    if (tokens.length === 0) {
      console.log(`[sendNotification] No FCM tokens for user ${userId}`);
      return { success: false, message: 'No tokens available' };
    }

    // Prepare notification payload
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        click_action: '/',
        ...notificationData,
      },
      webpush: {
        fcmOptions: {
          link: notificationData?.link || '/',
        },
        notification: {
          icon: '/pi-icon.svg',
          badge: '/pi-badge.svg',
          tag: 'piwork-notification',
          clickAction: '/',
        },
      },
    };

    // Send to all tokens
    const results = await Promise.allSettled(
      tokens.map(token => 
        admin.messaging().send({
          ...message,
          token,
        })
      )
    );

    // Track failed tokens and remove them
    const failedTokens = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`[sendNotification] Failed to send to token ${index}:`, result.reason);
        failedTokens.push(tokens[index]);
      }
    });

    // Remove invalid tokens from Firestore
    if (failedTokens.length > 0) {
      await admin.firestore()
        .collection('users')
        .doc(userId)
        .update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(...failedTokens),
        });
      console.log(`[sendNotification] Removed ${failedTokens.length} invalid tokens`);
    }

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    return {
      success: true,
      sentCount: successCount,
      failedCount: failedTokens.length,
    };
  } catch (error) {
    console.error('[sendNotification] Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification');
  }
});

/**
 * Cloud Function: onTaskCreated
 * Triggers when a new task is created and sends notifications to relevant users
 */
exports.onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskId = context.params.taskId;

    console.log(`[onTaskCreated] New task created: ${taskId}`);

    try {
      // Get all freelancers (could be filtered by skills/category)
      const freelancersSnapshot = await admin.firestore()
        .collection('users')
        .where('role', '==', 'freelancer')
        .limit(10) // Limit to first 10 for demo
        .get();

      // Send notifications to freelancers
      const notificationPromises = freelancersSnapshot.docs.map(doc =>
        admin.firestore().collection('functions').doc('sendNotification').call({
          userId: doc.id,
          title: 'New Task Available',
          body: task.title,
          data: {
            type: 'task',
            taskId,
            link: `/task/${taskId}`,
          },
        })
      );

      await Promise.allSettled(notificationPromises);
      console.log(`[onTaskCreated] Sent notifications to ${freelancersSnapshot.size} freelancers`);
    } catch (error) {
      console.error('[onTaskCreated] Error:', error);
    }
  });

/**
 * Cloud Function: onMessageSent
 * Triggers when a new message is sent in a chat
 */
exports.onMessageSent = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const { chatId } = context.params;

    console.log(`[onMessageSent] New message in chat: ${chatId}`);

    try {
      // Get chat document to find recipient
      const chatDoc = await admin.firestore()
        .collection('chats')
        .doc(chatId)
        .get();

      if (!chatDoc.exists) return;

      const chat = chatDoc.data();
      const recipientId = chat.participants.find(id => id !== message.senderId);

      if (!recipientId) return;

      // Send notification to recipient
      const callable = admin.functions().httpsCallable('sendNotification');
      await callable({
        userId: recipientId,
        title: `New message from ${message.senderName}`,
        body: message.text || '[Attachment]',
        data: {
          type: 'message',
          chatId,
          userId: message.senderId,
          link: `/chat/${chatId}`,
        },
      });

      console.log(`[onMessageSent] Notification sent to ${recipientId}`);
    } catch (error) {
      console.error('[onMessageSent] Error:', error);
    }
  });

/**
 * Cloud Function: onTaskCompleted
 * Triggers when a task is marked as completed
 */
exports.onTaskCompleted = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const oldTask = change.before.data();
    const newTask = change.after.data();
    const { taskId } = context.params;

    // Check if status changed to completed
    if (oldTask.status !== 'completed' && newTask.status === 'completed') {
      console.log(`[onTaskCompleted] Task completed: ${taskId}`);

      try {
        // Get client (task creator)
        const clientId = newTask.clientId;

        // Send notification
        const callable = admin.functions().httpsCallable('sendNotification');
        await callable({
          userId: clientId,
          title: 'Task Completed',
          body: `Work on "${newTask.title}" has been submitted`,
          data: {
            type: 'task',
            taskId,
            link: `/task/${taskId}`,
          },
        });

        console.log(`[onTaskCompleted] Notification sent to client ${clientId}`);
      } catch (error) {
        console.error('[onTaskCompleted] Error:', error);
      }
    }
  });
