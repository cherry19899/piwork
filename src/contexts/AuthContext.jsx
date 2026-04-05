/**
 * Auth Context Provider
 * Provides authentication state globally throughout the app
 * Includes user custom claims for role-based access control
 */

import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
