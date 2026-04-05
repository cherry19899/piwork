/**
 * Main App Component
 * Sets up routing, providers, and Pi SDK initialization
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { initPiSdk } from './services/piSdk';
import { initializeMessaging, listenToForegroundNotifications, playNotificationSound } from './services/notifications';

// Screens
import LoginScreen from './screens/Login';
import FeedScreen from './screens/Feed';
import CreateTaskScreen from './screens/CreateTask';
import TaskDetailScreen from './screens/TaskDetail';
import ChatScreen from './screens/Chat';
import ProfileScreen from './screens/Profile';

// Loading screen
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: '18px',
  }}>
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>π</div>
      <div>Initializing PiWork...</div>
    </div>
  </div>
);

// Error screen for when Pi is not available
const PiBrowserRequiredScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: '20px',
  }}>
    <div>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>π</div>
      <h1>Pi Network Required</h1>
      <p>PiWork must be opened in the Pi Browser or Pi App.</p>
      <p style={{ color: '#737373', fontSize: '14px' }}>
        Download the Pi App to continue.
      </p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

// App content with routes
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <LoginScreen />}
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-task"
        element={
          <ProtectedRoute>
            <CreateTaskScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/task/:taskId"
        element={
          <ProtectedRoute>
            <TaskDetailScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute>
            <ChatScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
};

// Main App component
const App = () => {
  const [piReady, setPiReady] = useState(false);
  const [piError, setPiError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Pi SDK
        await initPiSdk();
        setPiReady(true);
        console.log('[App] Pi SDK initialized');

        // Initialize FCM messaging
        initializeMessaging();
        console.log('[App] FCM messaging initialized');

        // Listen to foreground notifications
        const unsubscribe = listenToForegroundNotifications((notification) => {
          console.log('[App] Foreground notification received:', notification);
          playNotificationSound();
          
          // Show notification in UI (can be replaced with toast/modal)
          // This is handled by the service worker for background notifications
        });

        return unsubscribe;
      } catch (error) {
        setPiError(error instanceof Error ? error.message : 'Failed to initialize Pi SDK');
        console.error('[App] Initialization error:', error);
      }
    };

    const cleanup = initializeApp().catch((err) => {
      console.error('[App] Initialization cleanup error:', err);
    });

    return () => {
      if (cleanup instanceof Function) {
        cleanup();
      }
    };
  }, []);

  if (piError) {
    return <PiBrowserRequiredScreen />;
  }

  if (!piReady) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
