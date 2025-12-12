'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/app/types/api';
import { authApi, profileApi, tokenManager } from '@/app/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!tokenManager.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const response = await profileApi.getProfile();
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      setUser(null);
      tokenManager.clearTokens();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!tokenManager.isAuthenticated()) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const response = await profileApi.getProfile();
      if (mounted) {
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setUser(null);
          tokenManager.clearTokens();
        }
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    if (response.success && response.data) {
      setUser(response.data.user);
      return { success: true };
    }

    return {
      success: false,
      error: response.error?.message || '로그인에 실패했습니다',
    };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
