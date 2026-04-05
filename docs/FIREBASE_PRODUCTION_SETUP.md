# Firebase Production Setup Guide for Piwork

## 1. Collection Structure

### users
```
uid (doc ID)
├── username: string
├── kyc_status: "pending" | "verified" | "rejected"
├── rating: number (0-5)
├── completed_tasks: number
├── created_at: timestamp
├── language: string
├── country_code: string
├── avatar_url: string (optional)
├── bio: string (optional)
├── skills: array<string>
├── verified_categories: array<string>
└── unread_message_count: number
```

### tasks
```
task_id (doc ID)
├── creator_uid: string
├── title: string
├── description: string
├── category: string
├── budget: number (in Pi)
├── deadline: timestamp
├── status: "open" | "assigned" | "in_progress" | "completed" | "cancelled"
├── created_at: timestamp
├── assigned_to: string (optional)
├── applications: number
├── completion_date: timestamp (optional)
├── escrow_status: "pending" | "locked" | "released"
└── tags: array<string>
```

### messages
```
message_id (doc ID)
├── task_id: string
├── sender_uid: string
├── text: string
├── attachments: array<object> (optional)
├── timestamp: timestamp
├── read_status: boolean
└── read_by: array<string>
```

### transactions
```
tx_id (doc ID)
├── task_id: string
├── payer_uid: string
├── payee_uid: string
├── amount: number
├── status: "pending" | "approved" | "completed" | "failed" | "cancelled"
├── pi_txid: string (optional)
├── created_at: timestamp
├── completed_at: timestamp (optional)
└── escrow_locked_at: timestamp (optional)
```

## 2. Required Firestore Indexes

Deploy via: `firebase deploy --only firestore:indexes`

See `/firestore.indexes.json` for complete index configuration.

**Critical Indexes** (platform will fail without these on 1000+ documents):
- `tasks.status + tasks.created_at` - Task feed sorting
- `tasks.creator_uid + tasks.status` - User profile
- `tasks.assigned_to + tasks.status` - Freelancer dashboard
- `tasks.category + tasks.budget` - Category filtering
- `tasks.deadline` - Expiration checking
- `messages.task_id + messages.timestamp` - Message history

## 3. Cloud Functions Deployment

### Prerequisites
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### Deploy Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### Enabled Triggers

1. **onTaskCreated** - Publishes notifications to category subscribers
2. **onTaskStatusChanged** - Notifies creator and freelancer of status updates
3. **onMessageCreated** - Sends push notification and increments unread count
4. **checkExpiredTasks** - Runs every 10 minutes to auto-cancel expired tasks
5. **cleanupOldNotifications** - Runs hourly to remove 30+ day old notifications

### Cloud Function Environment Variables

Set in Firebase Console > Functions > Runtime Environment Variables:

```
PI_NETWORK_ENV=mainnet|testnet
SENTRY_DSN=https://your-sentry-key@sentry.io/...
FCM_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json
```

## 4. Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own profile and public data
    match /users/{userId} {
      allow read: if request.auth.uid == userId || resource.data.profile_public == true;
      allow write: if request.auth.uid == userId;
    }

    // Tasks are publicly readable if open/assigned
    match /tasks/{taskId} {
      allow read: if resource.data.status in ['open', 'assigned', 'completed'];
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.creator_uid || 
                       request.auth.uid == resource.data.assigned_to;
    }

    // Messages are only visible to task participants
    match /messages/{messageId} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/tasks/$(request.resource.data.task_id)).data.creator_uid == request.auth.uid ||
        get(/databases/$(database)/documents/tasks/$(request.resource.data.task_id)).data.assigned_to == request.auth.uid;
    }

    // Transactions are visible to payer/payee
    match /transactions/{txId} {
      allow read: if request.auth.uid == resource.data.payer_uid ||
                     request.auth.uid == resource.data.payee_uid;
      allow create: if request.auth != null;
    }
  }
}
```

## 5. Performance Tuning

### Query Limits
- Task feed: Max 20 per page (pagination)
- User tasks: Max 50
- Freelancer dashboard: Max 50
- Message history: Max 50

### Caching Strategy
- Task feed: Cache 5 minutes (SWR)
- User profile: Cache 10 minutes
- Message history: Cache real-time with Cloud Firestore listeners

### Index Monitoring
- Monitor index creation status in Firebase Console
- Once all indexes are built (green status), queries will be instant
- First query may take 30-60 seconds while indexes build

## 6. Backup Strategy

### Automated Backups
- Enable daily automated backups in Firebase Console
- Set retention to 30 days
- Location: nearest region

### Manual Backups
```bash
gcloud firestore export gs://your-bucket/backup-$(date +%s)
```

## 7. Monitoring and Alerts

### Key Metrics to Monitor
- Query latency (target: <500ms for indexed queries)
- Storage growth (0.5-1 GB per 100K users)
- Write operations (scale Cloud Functions concurrency)
- Function execution times (target: <5s for triggers)

### Set Up Alerts
In Firebase Console:
- Alert if functions fail > 5% of executions
- Alert if queries exceed 2 second latency
- Alert if storage exceeds 90% of quota

## 8. Cost Estimation

### Typical Costs (1000 active users):
- Document reads: ~$0.06/day (5M daily reads)
- Document writes: ~$0.12/day (10M daily writes)
- Cloud Functions: ~$0.50/day (event processing)
- Messaging (FCM): Free for first 1M/day
- Total: ~$20-30/month baseline

### Cost Optimization
- Use collection group queries sparingly
- Implement message cleanup (daily for old notifications)
- Archive completed tasks after 90 days
- Use batch writes for bulk operations

## 9. Troubleshooting

### "Too many indexed properties" error
- Reduce composite indexes
- Use query filtering instead of index combinations

### "Query is not supported by index" error
- Verify all required indexes are created (check firestore.indexes.json)
- Allow 30 minutes for new indexes to build

### High latency queries
- Check if using correct indexes
- Verify no full-collection scans
- Consider pagination if query returns >1000 docs

### Cloud Function timeout
- Increase timeout in firebase.json (default 60s, max 540s)
- For long operations, use PubSub instead of direct triggers
- Monitor logs in Cloud Functions console
