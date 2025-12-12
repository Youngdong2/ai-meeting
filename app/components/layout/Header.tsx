'use client';

import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--background)] border-b border-[var(--border-light)]">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[21px] font-semibold tracking-tight text-[var(--text-primary)]"
          >
            AI Meeting
          </Link>
        </div>
        {!isLoading && (
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-[14px] text-[var(--text-secondary)]">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-[14px] font-medium text-[var(--link)] hover:text-[var(--link-hover)] transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-[14px] font-medium text-white bg-[var(--link)] hover:bg-[var(--link-hover)] rounded-full transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
