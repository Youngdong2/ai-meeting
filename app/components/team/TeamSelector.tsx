'use client';

import { useState, useRef, useEffect } from 'react';
import { useTeam } from '@/app/contexts/TeamContext';
import { useAuth } from '@/app/contexts/AuthContext';

export default function TeamSelector() {
  const { teams, currentTeam, isLoading, setCurrentTeam } = useTeam();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="px-3 py-2">
        <div className="h-9 bg-[var(--border-light)] rounded-lg animate-pulse" />
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="px-3 py-2">
        <div className="text-[13px] text-[var(--text-secondary)] text-center py-2">
          소속된 팀이 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[var(--background)] border border-[var(--border-light)] rounded-lg hover:border-[var(--border)] transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[var(--link)] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-semibold">
              {currentTeam?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-[14px] font-medium text-[var(--text-primary)] truncate">
            {currentTeam?.name}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-3 right-3 mt-1 bg-[var(--background)] border border-[var(--border-light)] rounded-lg shadow-lg overflow-hidden z-50">
          <div className="py-1">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  setCurrentTeam(team);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--border-light)] transition-colors ${
                  currentTeam?.id === team.id ? 'bg-[var(--border-light)]' : ''
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-[var(--link)] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[11px] font-semibold">
                    {team.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium text-[var(--text-primary)] truncate">
                    {team.name}
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">
                    {team.member_count}명
                  </div>
                </div>
                {currentTeam?.id === team.id && (
                  <svg className="w-4 h-4 text-[var(--link)]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
