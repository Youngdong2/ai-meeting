'use client';

import { useEffect, use } from 'react';
import Link from 'next/link';
import { useMeeting } from '@/app/contexts/MeetingContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { MeetingStatusBadge } from '@/app/components/meeting';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = use(params);
  const { currentMeeting, isLoading, error, fetchMeeting, clearCurrentMeeting } = useMeeting();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMeeting(parseInt(id, 10));
    }

    return () => {
      clearCurrentMeeting();
    };
  }, [id, isAuthenticated, fetchMeeting, clearCurrentMeeting]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 시간 포맷팅 (초 -> 분:초)
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  if (authLoading || isLoading) {
    return (
      <div className="py-8 space-y-12">
        <div className="space-y-4">
          <div className="h-4 w-24 bg-[var(--border-light)] rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-[var(--border-light)] rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-[var(--border-light)] rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-20 bg-[var(--border-light)] rounded animate-pulse" />
          <div className="h-24 w-full bg-[var(--border-light)] rounded-lg animate-pulse" />
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

  if (error) {
    return (
      <div className="py-8 space-y-10">
        <Link href="/meetings" className="link-apple inline-flex items-center gap-1 text-body">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          회의록 목록
        </Link>
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentMeeting) {
    return (
      <div className="py-8 space-y-10">
        <Link href="/meetings" className="link-apple inline-flex items-center gap-1 text-body">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          회의록 목록
        </Link>
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">회의록을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/meetings" className="link-apple inline-flex items-center gap-1 text-body">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          회의록 목록
        </Link>
        <div className="flex items-start justify-between">
          <h1 className="text-headline-2">{currentMeeting.title}</h1>
          <MeetingStatusBadge status={currentMeeting.status} />
        </div>
        <div className="flex items-center gap-2 text-body text-[var(--text-secondary)]">
          <span>{formatDate(currentMeeting.created_at)}</span>
          {currentMeeting.duration && (
            <>
              <span>·</span>
              <span>{formatDuration(currentMeeting.duration)}</span>
            </>
          )}
          <span>·</span>
          <span>{currentMeeting.created_by_name}</span>
        </div>
      </div>

      {/* Processing Status (if not completed) */}
      {currentMeeting.status !== 'completed' && currentMeeting.status !== 'failed' && (
        <section className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-[15px] font-medium text-blue-800">처리 중입니다</p>
              <p className="text-[13px] text-blue-600">
                {currentMeeting.status === 'transcribing' && '음성을 텍스트로 변환하고 있습니다...'}
                {currentMeeting.status === 'correcting' && '텍스트를 교정하고 있습니다...'}
                {currentMeeting.status === 'summarizing' && '내용을 요약하고 있습니다...'}
                {currentMeeting.status === 'compressing' && '파일을 압축하고 있습니다...'}
                {currentMeeting.status === 'pending' && '처리 대기 중입니다...'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Failed Status */}
      {currentMeeting.status === 'failed' && (
        <section className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[15px] font-medium text-red-800">처리에 실패했습니다</p>
          <p className="text-[13px] text-red-600 mt-1">다시 시도하거나 관리자에게 문의하세요</p>
        </section>
      )}

      {/* Summary */}
      {currentMeeting.summary && (
        <section className="space-y-4">
          <h2 className="text-headline-3">요약</h2>
          <p className="text-intro text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
            {currentMeeting.summary}
          </p>
        </section>
      )}

      {/* Key Points */}
      {currentMeeting.key_points && currentMeeting.key_points.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-headline-3">핵심 포인트</h2>
          <ul className="space-y-4">
            {currentMeeting.key_points.map((point, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 bg-[var(--link)] text-white rounded-full flex items-center justify-center text-caption font-semibold">
                  {index + 1}
                </span>
                <span className="text-body text-[var(--text-primary)] pt-0.5">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Action Items */}
      {currentMeeting.action_items && currentMeeting.action_items.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-headline-3">할일 목록</h2>
          <div className="divide-y divide-[var(--border-light)]">
            {currentMeeting.action_items.map((item, index) => (
              <div key={index} className="py-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[var(--border)] bg-transparent mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-body text-[var(--text-primary)]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transcript */}
      {currentMeeting.full_script && (
        <section className="space-y-4">
          <h2 className="text-headline-3">전체 스크립트</h2>
          <div className="p-6 bg-[var(--background-secondary)] rounded-xl max-h-96 overflow-y-auto">
            <pre className="text-body text-[var(--text-secondary)] whitespace-pre-wrap font-sans">
              {currentMeeting.full_script}
            </pre>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button className="flex-1 py-3 text-[var(--link)] text-body font-medium border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors">
          공유하기
        </button>
        <button className="flex-1 py-3 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity">
          수정하기
        </button>
      </div>
    </div>
  );
}
