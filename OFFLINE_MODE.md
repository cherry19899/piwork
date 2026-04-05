# Offline Mode & Synchronization Guide

## Overview
PiWork provides seamless offline support with automatic synchronization when connection is restored.

## Offline Features

### Offline Indicator
- **Banner**: 32px height, #F59E0B (amber) background, black text
- **Position**: Fixed at top of screen
- **Content**: "📡 You're offline • Cached data visible • Messages will be sent when online"
- **Auto-hide**: When connection restored

### Cached Data Access
Users can continue browsing:
- Completed tasks and history
- Chat conversations (last synced messages)
- Profile information
- Previous search results
- Saved filters

### Offline Write Operations

**Queued Messages**
- Messages stored locally with timestamp
- Visual indicator: "sending..." or queued state
- Send automatically when online
- Resend option if failed

**Draft Tasks**
- Task creation stored as draft
- Auto-save on every change
- Restore draft on return to creation page
- Clear draft on successful submission

**Profile Updates**
- Profile changes queued for sync
- Optimistic UI updates
- Conflict resolution on sync

## Synchronization System

### Auto-Sync on Reconnect
1. **Detection**: Automatic via `online` event listener
2. **Trigger**: Syncing badge appears on profile
3. **Process**:
   - Queue pending actions in priority order
   - Batch API requests for efficiency
   - Handle conflicts if present
   - Update UI with synced data
4. **Completion**: Badge removes when complete

### Syncing Badge
- **Location**: Profile page (top-right of avatar)
- **States**:
  - "Syncing..." (pulse animation, primary color)
  - "Sync failed" (error state, red, exclamation icon)
- **Duration**: Shows only during active sync

### Pending Actions Storage
- **Storage**: localStorage as JSON
- **Key**: `piwork_pending_actions`
- **Data**: Array of {id, type, data, timestamp, status}
- **Persistence**: Survives browser refresh

## Conflict Resolution

### Conflict Detection
Conflicts occur when same resource modified on different device:
- Message edited
- Task updated
- Profile changed

### Resolution UI
**Modal Dialog**:
- Title: "Conflicting Changes"
- Description: Explains resource and conflict type
- Two buttons side-by-side:
  - "YOUR CHANGES" (left, purple border)
  - "CLOUD VERSION" (right, gray border)
- Progress indicator: "1 of 3" (if multiple conflicts)
- Data display: Text preview of both versions

### User Choice
- **Select "YOUR CHANGES"**: Keep local version, override cloud
- **Select "CLOUD VERSION"**: Accept remote changes
- Sequential resolution: Shows next conflict after choice
- Modal closes when all conflicts resolved

### Conflict Data Structure
```typescript
{
  id: string;
  type: 'message' | 'task' | 'profile';
  localData: any;      // User's local version
  remoteData: any;     // Server version
  timestamp: Date;     // When conflict detected
}
```

## Implementation Details

### OfflineContext Hook
```typescript
const {
  isOnline,              // boolean: network status
  syncStatus,            // 'idle' | 'syncing' | 'error'
  pendingActions,        // array of pending operations
  addPendingAction,      // add queued operation
  syncPendingActions,    // trigger manual sync
  resolvePendingConflict,// resolve by choosing local/remote
  clearSyncedActions,    // cleanup after sync
} = useOffline();
```

### Components Available
- `OfflineBanner`: Top indicator banner
- `SyncingBadge`: Profile syncing status (absolute positioned)
- `ConflictResolutionModal`: Conflict display and resolution

### Integration Example
```typescript
// In a message input component
const { addPendingAction } = useOffline();

const sendMessage = (text: string) => {
  addPendingAction({
    type: 'message',
    data: { chatId, text, timestamp },
  });
};

// Conflict resolution in profile
const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
const { resolvePendingConflict } = useOffline();

const handleResolve = (id: string, choice: 'local' | 'remote') => {
  resolvePendingConflict(id, choice);
};
```

## Best Practices

### For Messages
1. Show "pending" state with icon
2. Enable retry if send fails
3. Move to history when synced
4. Mark as read when delivered

### For Tasks
1. Auto-save draft frequently
2. Show unsaved indicator
3. Prompt before discarding
4. Allow resuming draft after return

### For Profile
1. Show optimistic updates
2. Lock fields during sync
3. Display error if conflict
4. Preserve last known good state

## Testing Offline Mode

### Chrome DevTools
1. Open DevTools → Network tab
2. Click throttling dropdown
3. Select "Offline"
4. Interact with app
5. Toggle back to online

### Network Information API
```typescript
const connection = navigator.connection || navigator.mozConnection;
connection.addEventListener('change', () => {
  console.log('Connection status:', navigator.onLine);
});
```

## Limitations & Edge Cases

### Device Storage
- localStorage limited to ~5-10MB per domain
- Older devices may have smaller limits
- Large media files not cached

### Conflict Prevention
- Server timestamps prevent most conflicts
- Last-write-wins strategy default
- User choice available for complex cases

### Connection Flakiness
- Automatic retries with exponential backoff
- Queue persists across browser sessions
- Manual sync option for users
