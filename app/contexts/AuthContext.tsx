'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/app/types/api';
import { authApi, tokenManager } from '@/app/lib/api';

const USER_STORAGE_KEY = 'user_data';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// localStorage에서 사용자 정보 가져오기
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

// localStorage에 사용자 정보 저장
const setStoredUser = (user: User | null): void => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 상태 업데이트 시 localStorage도 함께 업데이트
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    setStoredUser(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenManager.isAuthenticated()) {
      updateUser(null);
      setIsLoading(false);
      return;
    }
    // 저장된 사용자 정보가 있으면 사용
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, [updateUser]);

  useEffect(() => {
    const initAuth = () => {
      if (!tokenManager.isAuthenticated()) {
        updateUser(null);
        setIsLoading(false);
        return;
      }

      // 저장된 사용자 정보가 있으면 사용
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      } else {
        // 토큰은 있지만 사용자 정보가 없으면 로그아웃 처리
        tokenManager.clearTokens();
        updateUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, [updateUser]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    if (response.success && response.data) {
      updateUser(response.data.user);
      return { success: true };
    }

    return {
      success: false,
      error: response.error?.message || '로그인에 실패했습니다',
    };
  };

  const logout = async () => {
    await authApi.logout();
    updateUser(null);
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
