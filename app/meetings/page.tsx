'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMeeting } from '@/app/contexts/MeetingContext';
import { useTeam } from '@/app/contexts/TeamContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { MeetingStatusBadge } from '@/app/components/meeting';

export default function MeetingsPage() {
  const { meetings, isLoading, error, fetchMeetings } = useMeeting();
  const { currentTeam, isLoading: teamLoading } = useTeam();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 인증 완료 후 회의록 불러오기 (팀 유무와 관계없이)
    if (isAuthenticated && !teamLoading) {
      fetchMeetings();
    }
  }, [isAuthenticated, teamLoading, fetchMeetings]);

  // 검색 필터링
  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.summary && meeting.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="py-8 space-y-10">
        <div className="space-y-4">
          <div className="h-10 w-32 bg-[var(--border-light)] rounded-lg animate-pulse" />
          <div className="h-6 w-64 bg-[var(--border-light)] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-8 space-y-10">
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">로그인이 필요합니다</p>
          <Link href="/login" className="link-apple mt-4 inline-block">
            로그인하기 →
          </Link>
        </div>
      </div>
    );
  }

  if (!currentTeam) {
    return (
      <div className="py-8 space-y-10">
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">팀을 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-headline">회의록</h1>
        <p className="text-intro text-[var(--text-secondary)]">
          {currentTeam.name}의 모든 회의록을 확인하세요
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="회의록 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[var(--background-secondary)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] border border-[var(--border-light)]"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-[14px] text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-6 animate-pulse">
              <div className="h-5 w-48 bg-[var(--border-light)] rounded mb-3" />
              <div className="h-4 w-full bg-[var(--border-light)] rounded mb-2" />
              <div className="h-4 w-2/3 bg-[var(--border-light)] rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredMeetings.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--border-light)] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8 text-[var(--text-tertiary)]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            {searchQuery ? '검색 결과가 없습니다' : '아직 회의록이 없습니다'}
          </p>
          {!searchQuery && (
            <Link href="/record" className="link-apple">
              첫 회의록 만들기 →
            </Link>
          )}
        </div>
      )}

      {/* Meeting list */}
      {!isLoading && filteredMeetings.length > 0 && (
        <div className="divide-y divide-[var(--border-light)]">
          {filteredMeetings.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="block py-6 hover:bg-[var(--background-secondary)] -mx-6 px-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-eyebrow text-[var(--text-primary)] line-clamp-1">
                  {meeting.title}
                </h3>
                <MeetingStatusBadge status={meeting.status} />
              </div>
              {meeting.summary && (
                <p className="text-body text-[var(--text-secondary)] line-clamp-2 mb-4">
                  {meeting.summary}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-[var(--text-tertiary)]">
                    {formatDate(meeting.created_at)}
                  </span>
                  {meeting.duration && (
                    <>
                      <span className="text-caption text-[var(--text-tertiary)]">·</span>
                      <span className="text-caption text-[var(--text-tertiary)]">
                        {Math.floor(meeting.duration / 60)}분
                      </span>
                    </>
                  )}
                </div>
                <span className="text-caption text-[var(--text-tertiary)]">
                  {meeting.created_by_name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
