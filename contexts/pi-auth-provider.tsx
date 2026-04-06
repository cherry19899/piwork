'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  piAddress: string;
  username: string;
  email?: string;
  region: string;
  language: string;
  reputation: number;
  jobsCompleted: number;
  jobsPosted: number;
  totalEarnings: number;
  trustCircle: string[];
  referralCode: string;
  createdAt: Date;
  kycVerified: boolean;
}

export interface TrustCircleConnection {
  userId: string;
  trustLevel: 'friend' | 'friend_of_friend' | 'verified';
  connectedAt: Date;
  mutualConnections: number;
}

export interface PiAuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  trustCircle: TrustCircleConnection[];
  loginWithPi: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getTrustCircle: () => TrustCircleConnection[];
  verifyUserInTrustCircle: (userId: string) => boolean;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export const PiAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trustCircle, setTrustCircle] = useState<TrustCircleConnection[]>([]);

  const loginWithPi = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pi SDK will be integrated here
      // For now, mock implementation
      const mockUser: UserProfile = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        piAddress: 'pi_address_' + Math.random().toString(36).substr(2, 9),
        username: 'User_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        region: 'IN',
        language: 'en',
        reputation: 4.8,
        jobsCompleted: 12,
        jobsPosted: 5,
        totalEarnings: 245.50,
        trustCircle: [],
        referralCode: 'PW' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        createdAt: new Date(),
        kycVerified: false,
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setTrustCircle([]);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }, [user]);

  const getTrustCircle = useCallback((): TrustCircleConnection[] => {
    return trustCircle;
  }, [trustCircle]);

  const verifyUserInTrustCircle = useCallback((userId: string): boolean => {
    return trustCircle.some(conn => conn.userId === userId);
  }, [trustCircle]);

  const value: PiAuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    trustCircle,
    loginWithPi,
    logout,
    updateProfile,
    getTrustCircle,
    verifyUserInTrustCircle,
  };

  return <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>;
};

export const usePiAuth = (): PiAuthContextType => {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error('usePiAuth must be used within a PiAuthProvider');
  }
  return context;
};
