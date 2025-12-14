'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useMeeting } from '@/app/contexts/MeetingContext';
import { useTeam } from '@/app/contexts/TeamContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { MeetingStatusBadge } from '@/app/components/meeting';

export default function Home() {
  const { meetings, isLoading: meetingsLoading, fetchMeetings } = useMeeting();
  const { currentTeam, isLoading: teamLoading } = useTeam();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentTeam) {
      fetchMeetings();
    }
  }, [isAuthenticated, currentTeam, fetchMeetings]);

  // 최근 3개 회의록
  const recentMeetings = meetings.slice(0, 3);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  // 통계 계산
  const completedCount = meetings.filter((m) => m.status === 'completed').length;
  const processingCount = meetings.filter(
    (m) => m.status !== 'completed' && m.status !== 'failed'
  ).length;

  const isLoading = authLoading || teamLoading;

  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-8">
        <h1 className="text-headline">
          회의록을
          <br />
          더 스마트하게.
        </h1>
        <p className="text-intro text-[var(--text-secondary)] max-w-md mx-auto">
          AI가 자동으로 회의 내용을 분석하고
          <br />
          핵심만 요약해드립니다.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/record" className="link-apple text-[17px]">
            새 회의록 만들기 →
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/record"
            className="group flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-all"
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10 text-[var(--link)]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="text-eyebrow text-[var(--text-primary)]">새 회의록</span>
            <span className="text-body text-[var(--text-secondary)] mt-1">녹음하기</span>
          </Link>
          <Link
            href="/meetings"
            className="group flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-all"
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10 text-[var(--text-primary)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <span className="text-eyebrow text-[var(--text-primary)]">전체 회의록</span>
            <span className="text-body text-[var(--text-secondary)] mt-1">모두 보기</span>
          </Link>
        </div>
      </section>

      {/* Recent Meetings */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-headline-3">최근 회의록</h2>
            <p className="text-body text-[var(--text-secondary)] mt-1">
              {currentTeam ? `${currentTeam.name}의 최근 회의록입니다` : '최근에 요약된 회의록입니다'}
            </p>
          </div>
          <Link href="/meetings" className="link-apple text-[17px]">
            전체 보기
          </Link>
        </div>

        {/* Loading State */}
        {(isLoading || meetingsLoading) && (
          <div className="space-y-0 divide-y divide-[var(--border-light)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-6 animate-pulse">
                <div className="h-5 w-48 bg-[var(--border-light)] rounded mb-3" />
                <div className="h-4 w-full bg-[var(--border-light)] rounded mb-2" />
                <div className="h-4 w-24 bg-[var(--border-light)] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !meetingsLoading && recentMeetings.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[var(--border-light)] rounded-2xl">
            <p className="text-[var(--text-secondary)] mb-4">
              {!isAuthenticated
                ? '로그인하여 회의록을 확인하세요'
                : !currentTeam
                  ? '팀을 선택해주세요'
                  : '아직 회의록이 없습니다'}
            </p>
            {isAuthenticated && currentTeam && (
              <Link href="/record" className="link-apple">
                첫 회의록 만들기 →
              </Link>
            )}
            {!isAuthenticated && (
              <Link href="/login" className="link-apple">
                로그인하기 →
              </Link>
            )}
          </div>
        )}

        {/* Meeting List */}
        {!isLoading && !meetingsLoading && recentMeetings.length > 0 && (
          <div className="space-y-0 divide-y divide-[var(--border-light)]">
            {recentMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="block py-6 hover:bg-[var(--background-secondary)] -mx-6 px-6 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-eyebrow text-[var(--text-primary)]">{meeting.title}</h3>
                  <MeetingStatusBadge status={meeting.status} />
                </div>
                {meeting.summary && (
                  <p className="text-body text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {meeting.summary}
                  </p>
                )}
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
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      {isAuthenticated && currentTeam && (
        <section className="space-y-8">
          <h2 className="text-headline-3">한눈에 보기</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center py-6">
              <p className="text-headline-2 text-[var(--link)]">{meetings.length}</p>
              <p className="text-caption text-[var(--text-secondary)] mt-2">총 회의록</p>
            </div>
            <div className="text-center py-6 border-x border-[var(--border-light)]">
              <p className="text-headline-2 text-[#34c759]">{completedCount}</p>
              <p className="text-caption text-[var(--text-secondary)] mt-2">완료됨</p>
            </div>
            <div className="text-center py-6">
              <p className="text-headline-2 text-[#ff9500]">{processingCount}</p>
              <p className="text-caption text-[var(--text-secondary)] mt-2">처리중</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
