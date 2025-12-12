'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(251,251,253,0.8)] backdrop-blur-xl backdrop-saturate-[180%] dark:bg-[rgba(29,29,31,0.8)]">
      <div className="max-w-[734px] mx-auto px-6 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="text-[21px] font-semibold tracking-tight text-[var(--text-primary)]"
        >
          AI Meeting
        </Link>
        {!isLoading && (
          <>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-[14px] text-[var(--text-secondary)]">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-[14px] font-medium text-[var(--link)] hover:text-[var(--link-hover)] transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-[14px] font-medium text-[var(--link)] hover:text-[var(--link-hover)] transition-colors"
              >
                로그인
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
