// Firestore Index Definitions for Production Performance
// These MUST be created in Firebase Console or via firestore.indexes.json

export const FIRESTORE_INDEXES = {
  // Collection: tasks
  // Composite Index: status + created_at (REQUIRED for task feed sorting)
  taskStatusCreatedAt: {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'created_at', order: 'DESCENDING' },
    ],
    queryScope: 'COLLECTION',
  },

  // Composite Index: creator_uid + status (REQUIRED for user profile)
  taskCreatorStatus: {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'creator_uid', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
    ],
    queryScope: 'COLLECTION',
  },

  // Composite Index: assigned_to + status (REQUIRED for freelancer dashboard)
  taskAssignedStatus: {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'assigned_to', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
    ],
    queryScope: 'COLLECTION',
  },

  // Composite Index: category + budget (REQUIRED for category filtering)
  taskCategoryBudget: {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'budget', order: 'ASCENDING' },
    ],
    queryScope: 'COLLECTION',
  },

  // Single field index: deadline (REQUIRED for expiration checking)
  taskDeadline: {
    collectionGroup: 'tasks',
    fields: [
      { fieldPath: 'deadline', order: 'ASCENDING' },
    ],
    queryScope: 'COLLECTION',
  },

  // Composite Index: task_id + timestamp (REQUIRED for message history)
  messageTaskTimestamp: {
    collectionGroup: 'messages',
    fields: [
      { fieldPath: 'task_id', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
    ],
    queryScope: 'COLLECTION',
  },
};

// Query optimization helpers
export const createTaskFeedQuery = (db: any) => {
  // Uses: tasks.status + tasks.created_at
  return db.collection('tasks')
    .where('status', '==', 'open')
    .orderBy('created_at', 'desc')
    .limit(20);
};

export const createUserTasksQuery = (db: any, userId: string) => {
  // Uses: tasks.creator_uid + tasks.status
  return db.collection('tasks')
    .where('creator_uid', '==', userId)
    .where('status', 'in', ['open', 'assigned', 'in_progress'])
    .limit(50);
};

export const createFreelancerDashboardQuery = (db: any, userId: string) => {
  // Uses: tasks.assigned_to + tasks.status
  return db.collection('tasks')
    .where('assigned_to', '==', userId)
    .where('status', 'in', ['assigned', 'in_progress', 'completed'])
    .limit(50);
};

export const createCategoryFilterQuery = (db: any, category: string, maxBudget: number) => {
  // Uses: tasks.category + tasks.budget
  return db.collection('tasks')
    .where('category', '==', category)
    .where('budget', '<=', maxBudget)
    .where('status', '==', 'open')
    .orderBy('budget', 'desc')
    .limit(20);
};

export const createExpiredTasksQuery = (db: any, now: Date) => {
  // Uses: tasks.deadline
  return db.collection('tasks')
    .where('deadline', '<', now)
    .where('status', 'in', ['open', 'assigned'])
    .limit(100);
};

export const createMessageHistoryQuery = (db: any, taskId: string) => {
  // Uses: messages.task_id + messages.timestamp
  return db.collection('messages')
    .where('task_id', '==', taskId)
    .orderBy('timestamp', 'desc')
    .limit(50);
};
