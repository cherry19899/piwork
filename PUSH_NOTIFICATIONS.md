# Push Notifications System Documentation

## Overview

PiWork uses Firebase Cloud Messaging (FCM) for reliable, cross-platform push notifications. The system handles both background notifications (via Service Worker) and foreground notifications (in-app alerts).

## Architecture

### 1. Client-Side Setup

#### Service Worker Registration
- **File**: `/public/firebase-messaging-sw.js`
- Handles background notifications when app is closed
- Implements deep linking to specific screens based on notification type
- Auto-focuses existing app window or opens new one

#### FCM Token Management
- **Service**: `/src/services/notifications.js`
- Requests notification permission on first login
- Stores FCM token in Firestore at `users/{uid}/fcmTokens` (array)
- Removes tokens on logout
- Handles token refresh automatically via Firebase SDK

#### Foreground Notifications
- **App.jsx** initializes `listenToForegroundNotifications()`
- Plays notification sound for user awareness
- Can display toast/modal in active app
- Allows immediate interaction without waiting for background notification

### 2. Firestore Schema

```firestore
users/{uid}
├── fcmTokens: string[] // Array of active FCM tokens
├── lastTokenUpdate: timestamp
├── arbitrator: boolean
├── admin: boolean
└── verified: boolean
```

### 3. Cloud Functions

#### sendNotification (Callable HTTP Function)

**Trigger**: Called from client or other Cloud Functions

**Parameters**:
```javascript
{
  userId: "user_id",           // Recipient user ID (required)
  title: "Notification Title",  // (required)
  body: "Notification body",    // (required)
  data: {                        // Optional metadata
    type: "task|chat|message|dispute",
    taskId: "task_123",
    userId: "sender_id",
    link: "/task/123"
  }
}
```

**Response**:
```javascript
{
  success: true,
  sentCount: 2,           // Successfully sent to 2 tokens
  failedCount: 0
}
```

#### Automatic Triggers

**onTaskCreated**: Sends "New Task Available" to relevant freelancers
- Triggers: When document created in `tasks` collection
- Sends to: All users with `role === "freelancer"`
- Data: `type: "task"`, `taskId`

**onMessageSent**: Sends "New message from X" to chat participant
- Triggers: When document created in `chats/{chatId}/messages`
- Sends to: Other chat participant
- Data: `type: "message"`, `chatId`, sender info

**onTaskCompleted**: Sends "Task Completed" to client
- Triggers: When task status changes to "completed"
- Sends to: Task creator (client)
- Data: `type: "task"`, `taskId`

## Implementation Guide

### Step 1: Enable Firebase Cloud Messaging

1. Go to Firebase Console → Cloud Messaging
2. Generate or copy your VAPID key
3. Add to `.env`:
   ```
   REACT_APP_FCM_VAPID_KEY=your_vapid_key_here
   ```

### Step 2: Deploy Cloud Functions

```bash
cd functions
npm install firebase-functions firebase-admin
firebase deploy --only functions:sendNotification,functions:onTaskCreated,functions:onMessageSent,functions:onTaskCompleted
```

### Step 3: Configure Firestore Security Rules

```firestore
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  allow write: if request.auth.uid == userId;
  allow create: if request.auth.uid != null;
}

match /chats/{chatId} {
  allow read: if request.auth.uid in resource.data.participants;
  match /messages/{message} {
    allow read, write: if request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
  }
}

match /tasks/{taskId} {
  allow read: if true; // Tasks are public to view
  allow create: if request.auth.uid != null;
  allow update, delete: if request.auth.uid == resource.data.clientId;
}
```

### Step 4: Handle Deep Links in App Routes

The notification system automatically routes based on `data.type`:

- **task**: `/task/{taskId}`
- **chat**: `/chat/{chatId}`
- **message**: `/chat/{userId}`
- **dispute**: `/disputes/{taskId}`
- **default**: `/`

## Usage Examples

### Sending Notification from Cloud Function

```javascript
// In onTaskCreated trigger
const callable = admin.functions().httpsCallable('sendNotification');
await callable({
  userId: freelancerId,
  title: 'New Task: Web Design',
  body: 'Budget: 100 π • Deadline: 3 days',
  data: {
    type: 'task',
    taskId: 'task_123',
    link: '/task/task_123',
  }
});
```

### Sending Notification from Client

```javascript
// In React component
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const sendNotif = httpsCallable(functions, 'sendNotification');

await sendNotif({
  userId: 'recipient_uid',
  title: 'Message Received',
  body: 'Check your messages',
  data: {
    type: 'message',
    chatId: 'chat_123'
  }
});
```

## Notification Flow

```
Task Created
    ↓
onTaskCreated trigger fires
    ↓
Query freelancers from Firestore
    ↓
Call sendNotification for each
    ↓
Get user's FCM tokens
    ↓
Send via Firebase Messaging
    ↓
Service Worker receives (background)
    ├→ Shows notification
    └→ User clicks → Deep link navigates to task
    ↓
App foreground listens and plays sound
```

## Troubleshooting

### Tokens Not Saving
- Check: Service Worker registration successful?
- Check: `REACT_APP_FCM_VAPID_KEY` in environment variables?
- Check: User granted notification permission?

### Notifications Not Received
- Verify FCM tokens in Firestore: `users/{uid}/fcmTokens`
- Check browser console for FCM errors
- Ensure app is properly subscribed to Cloud Messaging

### Deep Links Not Working
- Verify notification `data.link` format
- Check routing rules in App.jsx
- Service Worker must have access to open URL

## Best Practices

1. **Token Management**: Remove invalid tokens immediately
2. **Throttling**: Limit notifications per user per hour
3. **Segmentation**: Use data fields to target specific audiences
4. **Testing**: Use Firebase Console to test notifications
5. **Analytics**: Track notification engagement via custom events

## Security Considerations

- FCM tokens are stored per-device (not per user ID)
- Tokens can be refreshed by Firebase SDK automatically
- Use Cloud Functions for server-side authorization checks
- Validate user permissions before sending notifications
- Never include sensitive data in notification payload
