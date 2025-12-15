'use client';

import { useEffect, use, useCallback, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useMeeting } from '@/app/contexts/MeetingContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { meetingApi } from '@/app/lib/api';
import {
  MeetingStatusBadge,
  ProcessingStatus,
  SpeakerMappingModal,
  EditMeetingModal,
  DeleteMeetingModal,
} from '@/app/components/meeting';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isProcessing = searchParams.get('processing') === 'true';
  const { currentMeeting, isLoading, error, fetchMeeting, clearCurrentMeeting } = useMeeting();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSpeakerModalOpen, setIsSpeakerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 외부 서비스 연동 상태
  const [isUploadingConfluence, setIsUploadingConfluence] = useState(false);
  const [isSharingSlack, setIsSharingSlack] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [serviceSuccess, setServiceSuccess] = useState<string | null>(null);

  const handleProcessingComplete = useCallback(() => {
    // Refresh meeting data when processing completes (silent refresh)
    fetchMeeting(parseInt(id, 10));
  }, [fetchMeeting, id]);

  // Confluence 업로드
  const [confluenceUrl, setConfluenceUrl] = useState<string | null>(null);

  const handleConfluenceUpload = async () => {
    setIsUploadingConfluence(true);
    setServiceError(null);
    setServiceSuccess(null);
    setConfluenceUrl(null);

    const response = await meetingApi.uploadToConfluence(parseInt(id, 10));

    if (response.success) {
      const url = response.data?.confluence_page_url;
      if (url) {
        setConfluenceUrl(url);
        setServiceSuccess('Confluence에 업로드되었습니다');
      } else {
        setServiceSuccess('Confluence에 업로드되었습니다');
      }
      // 비동기 업로드 시작됨 - 2초 후 다시 조회하여 URL 확인
      fetchMeeting(parseInt(id, 10));
      setTimeout(() => {
        fetchMeeting(parseInt(id, 10));
      }, 2000);
    } else {
      setServiceError(response.error?.message || 'Confluence 업로드에 실패했습니다');
    }

    setIsUploadingConfluence(false);
  };

  // Slack 공유
  const handleSlackShare = async () => {
    setIsSharingSlack(true);
    setServiceError(null);
    setServiceSuccess(null);

    const response = await meetingApi.shareToSlack(parseInt(id, 10));

    if (response.success) {
      setServiceSuccess('Slack에 공유되었습니다');
      fetchMeeting(parseInt(id, 10));
    } else {
      setServiceError(response.error?.message || 'Slack 공유에 실패했습니다');
    }

    setIsSharingSlack(false);
  };

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

  // 화자별 색상 배열
  const speakerColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-cyan-500',
  ];

  // 화자별 색상 매핑 생성
  const getSpeakerColor = (speaker: string) => {
    if (!currentMeeting?.chat_transcript) return speakerColors[0];
    const speakers = [...new Set(currentMeeting.chat_transcript.map(item => item.speaker))];
    const index = speakers.indexOf(speaker);
    return speakerColors[index % speakerColors.length];
  };

  // 최초 로딩 시에만 스켈레톤 표시 (이미 데이터가 있으면 스켈레톤 표시 안함)
  const showSkeleton = (authLoading || isLoading) && !currentMeeting;

  if (showSkeleton) {
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
      {(isProcessing || (currentMeeting.status !== 'completed' && currentMeeting.status !== 'failed')) && (
        <ProcessingStatus
          meetingId={currentMeeting.id}
          initialStatus={currentMeeting.status}
          onComplete={handleProcessingComplete}
        />
      )}

      {/* Failed Status (only if not using ProcessingStatus) */}
      {!isProcessing && currentMeeting.status === 'failed' && (
        <section className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-[15px] font-medium text-red-800">처리에 실패했습니다</p>
          <p className="text-[13px] text-red-600 mt-1">다시 시도하거나 관리자에게 문의하세요</p>
        </section>
      )}

      {/* External Services - 완료된 회의록만 표시 */}
      {currentMeeting.status === 'completed' && (
        <section className="space-y-4">
          <h2 className="text-headline-3">외부 서비스 연동</h2>

          {/* Service Messages */}
          {serviceError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[14px] text-red-600">{serviceError}</p>
            </div>
          )}
          {serviceSuccess && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-[14px] text-green-600">
                {serviceSuccess}
                {confluenceUrl && (
                  <>
                    {' - '}
                    <a
                      href={confluenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      페이지 보기
                    </a>
                  </>
                )}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {/* Confluence */}
            <div className="flex-1 p-4 bg-[var(--background-secondary)] rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.23 17.72c-.26.41-.48.77-.48 1.13 0 .72.65 1.15 1.42 1.15h11.66c.77 0 1.42-.43 1.42-1.15 0-.36-.22-.72-.48-1.13L12.55 7.82c-.26-.41-.55-.82-.55-1.23s.29-.82.55-1.23l6.22-9.9c.26-.41.48-.77.48-1.13 0-.72-.65-1.15-1.42-1.15H6.17c-.77 0-1.42.43-1.42 1.15 0 .36.22.72.48 1.13l6.22 9.9c.26.41.55.82.55 1.23s-.29.82-.55 1.23l-6.22 9.9z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Confluence</p>
                  {currentMeeting.confluence_page_url ? (
                    <a
                      href={currentMeeting.confluence_page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[var(--link)] hover:underline"
                    >
                      페이지 보기
                    </a>
                  ) : (
                    <p className="text-[12px] text-[var(--text-tertiary)]">업로드되지 않음</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleConfluenceUpload}
                disabled={isUploadingConfluence}
                className="w-full py-2 text-[14px] font-medium text-[var(--link)] border border-[var(--border-light)] rounded-lg hover:bg-[var(--background)] transition-colors disabled:opacity-50"
              >
                {isUploadingConfluence ? '업로드 중...' : currentMeeting.confluence_page_url ? '다시 업로드' : 'Confluence에 업로드'}
              </button>
            </div>

            {/* Slack */}
            <div className="flex-1 p-4 bg-[var(--background-secondary)] rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">Slack</p>
                  {currentMeeting.slack_channel ? (
                    <p className="text-[12px] text-[var(--text-tertiary)]">{currentMeeting.slack_channel}에 공유됨</p>
                  ) : (
                    <p className="text-[12px] text-[var(--text-tertiary)]">공유되지 않음</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSlackShare}
                disabled={isSharingSlack}
                className="w-full py-2 text-[14px] font-medium text-[var(--link)] border border-[var(--border-light)] rounded-lg hover:bg-[var(--background)] transition-colors disabled:opacity-50"
              >
                {isSharingSlack ? '공유 중...' : currentMeeting.slack_channel ? '다시 공유' : 'Slack에 공유'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Summary */}
      {currentMeeting.summary && (
        <section className="space-y-4">
          <h2 className="text-headline-3">요약</h2>
          <div className="prose prose-gray max-w-none text-[var(--text-secondary)]">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 text-[var(--text-primary)]">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-2 text-[var(--text-primary)]">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2 text-[var(--text-primary)]">{children}</h3>,
                p: ({ children }) => <p className="text-body leading-relaxed mb-3">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3">{children}</ol>,
                li: ({ children }) => <li className="text-body">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-[var(--border)] pl-4 italic text-[var(--text-tertiary)] my-3">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-[var(--background-secondary)] px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                hr: () => <hr className="my-6 border-[var(--border-light)]" />,
              }}
            >
              {currentMeeting.summary}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Chat Transcript - 대화형 전문 */}
      {currentMeeting.chat_transcript && currentMeeting.chat_transcript.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-3">전체 대화</h2>
            {currentMeeting.speaker_mappings && currentMeeting.speaker_mappings.length > 0 && (
              <button
                onClick={() => setIsSpeakerModalOpen(true)}
                className="text-[14px] text-[var(--link)] hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                화자 이름 설정
              </button>
            )}
          </div>
          <div className="bg-[var(--background-secondary)] rounded-xl max-h-[500px] overflow-y-auto">
            <div className="divide-y divide-[var(--border-light)]">
              {currentMeeting.chat_transcript.map((item, index) => (
                <div key={index} className="p-4 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${getSpeakerColor(item.speaker)} text-white rounded-full flex items-center justify-center text-sm font-medium`}>
                      {item.speaker.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] font-medium text-[var(--text-primary)]">
                        {item.speaker}
                      </span>
                      <span className="text-[12px] text-[var(--text-tertiary)]">
                        {Math.floor(item.start / 60)}:{String(Math.floor(item.start % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-body text-[var(--text-secondary)]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Corrected Transcript - 교정된 텍스트 (chat_transcript가 없을 때 fallback) */}
      {!currentMeeting.chat_transcript?.length && currentMeeting.corrected_transcript && (
        <section className="space-y-4">
          <h2 className="text-headline-3">교정된 전문</h2>
          <div className="p-6 bg-[var(--background-secondary)] rounded-xl max-h-96 overflow-y-auto">
            <pre className="text-body text-[var(--text-secondary)] whitespace-pre-wrap font-sans">
              {currentMeeting.corrected_transcript}
            </pre>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6 py-3 text-red-500 text-body font-medium border border-red-200 rounded-full hover:bg-red-50 transition-colors"
        >
          삭제
        </button>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex-1 py-3 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          수정하기
        </button>
      </div>

      {/* Speaker Mapping Modal */}
      {currentMeeting.speaker_mappings && (
        <SpeakerMappingModal
          isOpen={isSpeakerModalOpen}
          onClose={() => setIsSpeakerModalOpen(false)}
          meetingId={currentMeeting.id}
          speakerMappings={currentMeeting.speaker_mappings}
          onSave={() => fetchMeeting(parseInt(id, 10))}
        />
      )}

      {/* Edit Meeting Modal */}
      <EditMeetingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        meeting={currentMeeting}
        onSave={() => fetchMeeting(parseInt(id, 10))}
      />

      {/* Delete Meeting Modal */}
      <DeleteMeetingModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        meetingId={currentMeeting.id}
        meetingTitle={currentMeeting.title}
      />
    </div>
  );
}
