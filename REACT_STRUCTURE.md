# PiWork React Structure

This document outlines the React-based project structure for PiWork.

## Directory Structure

```
/src
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   ├── Avatar.jsx
│   ├── Badge.jsx
│   └── ...
├── screens/            # Full page screens
│   ├── Login.jsx
│   ├── Feed.jsx
│   ├── CreateTask.jsx
│   ├── TaskDetail.jsx
│   ├── Chat.jsx
│   ├── Profile.jsx
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useAuth.js     # Authentication state and methods
│   ├── useTasks.js    # Task management
│   ├── useChat.js     # Messaging functionality
│   └── usePayments.js # Pi payment handling
├── services/          # External services
│   ├── piSdk.js       # Pi Network SDK integration
│   ├── firebase.js    # Firebase initialization
│   └── notifications.js # Push notifications
├── utils/             # Utility functions
│   ├── formatDate.js  # Date formatting
│   ├── formatPi.js    # Currency formatting
│   └── validateInput.js # Form validation
├── contexts/          # React Context providers
│   └── AuthContext.jsx # Global auth state
├── App.jsx            # Main app component with routing
└── index.jsx          # Entry point
```

## Key Files

### Services (`/src/services`)

#### piSdk.js
- `initPiSdk()` - Initialize Pi Network SDK
- `authenticate()` - User login via Pi
- `getUser()` - Get authenticated user info
- `createPayment()` - Create payment transaction
- `completePayment()` - Complete payment
- `signMessage()` - Sign message for verification

#### firebase.js
- Initializes Firebase with Firestore, Auth, Storage
- Exports: `auth`, `db`, `storage`

#### notifications.js
- `requestNotificationPermission()` - Ask user for notifications
- `sendNotification()` - Send system notification
- `playNotificationSound()` - Play notification sound

### Hooks (`/src/hooks`)

#### useAuth.js
```javascript
const { user, loading, error, login, logout, isAuthenticated } = useAuth();
```
- Manages user authentication
- Persists to localStorage
- Auto-restores on app reload
- Saves user to Firestore on first login

#### useTasks.js
```javascript
const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, applyForTask } = useTasks(userId);
```
- CRUD operations for tasks
- Real-time updates via Firestore subscription
- Application management

#### useChat.js
```javascript
const { chats, messages, loading, error, fetchChats, subscribeToChat, sendMessage, getOrCreateChat } = useChat(userId);
```
- Chat management
- Real-time messaging
- Message history retrieval

#### usePayments.js
```javascript
const { loading, error, createTaskPayment, completeTaskPayment, cancelPayment } = usePayments(userId);
```
- Payment lifecycle management
- Pi Network integration
- Payment record storage

### Utilities (`/src/utils`)

#### formatDate.js
- `formatDate(date, format)` - Format dates (short, long, time, full)
- `formatRelativeTime(date)` - "2h ago" style formatting
- `getTimeRemaining(deadline)` - Time left until deadline

#### formatPi.js
- `formatPi(amount)` - Format as π amount
- `parsePi(string)` - Extract Pi amount from string
- `getPiDisplayValue()` - Show Pi with optional USD equivalent
- `validatePiAmount()` - Validate Pi amounts

#### validateInput.js
- `validateEmail()` - Email validation
- `validateUsername()` - 3-20 alphanumeric
- `validatePassword()` - 8+ chars, 1 uppercase, 1 number
- `validatePin()` - 4-digit PIN
- `validateTaskTitle()` - 5-100 characters
- `validateBudget()` - 0-10000 Pi range
- `getValidationError()` - Get error message for field

## Usage Examples

### Authentication
```javascript
import { useAuthContext } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuthContext();

  const handleLogin = async () => {
    try {
      const user = await login();
      console.log('Logged in:', user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Tasks
```javascript
import useTasks from '../hooks/useTasks';
import { useAuthContext } from '../contexts/AuthContext';

function TaskList() {
  const { user } = useAuthContext();
  const { tasks, loading, createTask } = useTasks(user.uid);

  const handleCreateTask = async () => {
    const taskId = await createTask({
      title: 'New Task',
      description: 'Task description',
      budget: 50,
      deadline: new Date().toISOString(),
      category: 'Design',
    });
  };

  return <div>{/* render tasks */}</div>;
}
```

### Payments
```javascript
import usePayments from '../hooks/usePayments';
import { useAuthContext } from '../contexts/AuthContext';

function PaymentButton() {
  const { user } = useAuthContext();
  const { createTaskPayment, completeTaskPayment } = usePayments(user.uid);

  const handlePayment = async () => {
    const payment = await createTaskPayment(taskId, 50, 'Task payment');
    // After user confirms in Pi app
    const completed = await completeTaskPayment(payment.id, payment.piPaymentId, txid);
  };

  return <button onClick={handlePayment}>Pay</button>;
}
```

## Environment Variables

Create a `.env.local` file:

```
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Pi Network Integration

The app uses Pi Network's browser API:
- Sandbox mode for development
- Mainnet for production
- Requires opening in Pi Browser or Pi App
- Users authenticate with their Pi account
- Payments are processed through Pi Network

## Firestore Collections

- `users/` - User profiles and settings
- `tasks/` - Task listings and metadata
- `chats/` - Chat rooms
- `chats/{chatId}/messages` - Chat messages
- `payments/` - Payment records
