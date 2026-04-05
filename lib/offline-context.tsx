'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OfflineState {
  isOnline: boolean;
  lastSyncTime?: Date;
  pendingActions: PendingAction[];
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface PendingAction {
  id: string;
  type: 'message' | 'task' | 'profile';
  data: any;
  timestamp: Date;
  status: 'pending' | 'synced' | 'conflict';
  conflictData?: any;
}

interface OfflineContextType extends OfflineState {
  addPendingAction: (action: Omit<PendingAction, 'id' | 'timestamp' | 'status'>) => void;
  syncPendingActions: () => Promise<void>;
  resolvePendingConflict: (id: string, choice: 'local' | 'remote') => void;
  clearSyncedActions: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OfflineState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingActions: [],
    syncStatus: 'idle',
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev) => ({
        ...prev,
        isOnline: true,
        syncStatus: 'syncing',
      }));
      syncPendingActions();
    };

    const handleOffline = () => {
      setState((prev) => ({
        ...prev,
        isOnline: false,
        syncStatus: 'idle',
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load pending actions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('piwork_pending_actions');
    if (stored) {
      try {
        const actions = JSON.parse(stored);
        setState((prev) => ({ ...prev, pendingActions: actions }));
      } catch (err) {
        console.error('[v0] Failed to load pending actions:', err);
      }
    }
  }, []);

  // Save pending actions to localStorage
  useEffect(() => {
    localStorage.setItem('piwork_pending_actions', JSON.stringify(state.pendingActions));
  }, [state.pendingActions]);

  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp' | 'status'>) => {
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      status: 'pending',
    };

    setState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, newAction],
    }));
  };

  const syncPendingActions = async () => {
    if (!state.isOnline || state.pendingActions.length === 0) {
      setState((prev) => ({ ...prev, syncStatus: 'idle' }));
      return;
    }

    setState((prev) => ({ ...prev, syncStatus: 'syncing' }));

    try {
      // Simulate sync - in production, this would make API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setState((prev) => ({
        ...prev,
        pendingActions: prev.pendingActions.map((action) => ({
          ...action,
          status: 'synced',
        })),
        lastSyncTime: new Date(),
        syncStatus: 'idle',
      }));
    } catch (err) {
      console.error('[v0] Sync failed:', err);
      setState((prev) => ({ ...prev, syncStatus: 'error' }));
    }
  };

  const resolvePendingConflict = (id: string, choice: 'local' | 'remote') => {
    setState((prev) => ({
      ...prev,
      pendingActions: prev.pendingActions.map((action) =>
        action.id === id
          ? {
              ...action,
              status: 'synced',
              data: choice === 'local' ? action.data : action.conflictData,
            }
          : action
      ),
    }));
  };

  const clearSyncedActions = () => {
    setState((prev) => ({
      ...prev,
      pendingActions: prev.pendingActions.filter((action) => action.status !== 'synced'),
    }));
  };

  return (
    <OfflineContext.Provider
      value={{
        ...state,
        addPendingAction,
        syncPendingActions,
        resolvePendingConflict,
        clearSyncedActions,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
