'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { meetingApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTeam } from '@/app/contexts/TeamContext';
import { useAudioRecorder } from '@/app/hooks/useAudioRecorder';
import { AudioLevelMeter } from '@/app/components/recording';
import Link from 'next/link';

// 시간 포맷팅 (초 -> HH:MM:SS)
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function RecordPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { currentTeam, isLoading: teamLoading } = useTeam();

  const {
    isRecording,
    isPaused,
    recordingTime,
    audioLevel,
    error: recorderError,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecorder();

  const [title, setTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 녹음 시작
  const handleStartRecording = async () => {
    setError(null);
    setRecordedBlob(null);
    await startRecording();
  };

  // 녹음 중지 및 저장
  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) {
      setRecordedBlob(blob);
    }
  };

  // 녹음 취소
  const handleCancelRecording = () => {
    cancelRecording();
    setRecordedBlob(null);
  };

  // 녹음 다시하기 (저장된 blob 삭제)
  const handleRetry = () => {
    setRecordedBlob(null);
    setError(null);
  };

  // 업로드 및 회의록 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('회의 제목을 입력해주세요');
      return;
    }

    if (!meetingDate) {
      setError('회의 날짜를 선택해주세요');
      return;
    }

    if (!recordedBlob) {
      setError('녹음을 먼저 진행해주세요');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Blob -> File 변환
      const file = new File([recordedBlob], `recording_${Date.now()}.webm`, {
        type: 'audio/webm',
      });

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const response = await meetingApi.createWithFile(title, meetingDate, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data) {
        router.push(`/meetings/${response.data.id}?processing=true`);
      } else {
        setError(response.error?.message || '회의록 생성에 실패했습니다');
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch {
      setError('서버에 연결할 수 없습니다');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 녹음 상태 텍스트
  const getStatusText = () => {
    if (isRecording && !isPaused) return '녹음 중...';
    if (isRecording && isPaused) return '일시정지';
    if (recordedBlob) return '녹음 완료';
    return '대기 중';
  };

  // Loading state
  if (authLoading || teamLoading) {
    return (
      <div className="py-8 space-y-10">
        <div className="space-y-4">
          <div className="h-10 w-32 bg-[var(--border-light)] rounded-lg animate-pulse" />
          <div className="h-6 w-64 bg-[var(--border-light)] rounded animate-pulse" />
        </div>
        <div className="h-48 w-full bg-[var(--border-light)] rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="py-8 space-y-10">
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">로그인이 필요합니다</p>
          <Link href="/login" className="link-apple mt-4 inline-block">
            로그인하기 &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // No team selected
  if (!currentTeam) {
    return (
      <div className="py-8 space-y-10">
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">팀을 먼저 선택해주세요</p>
          <p className="text-caption text-[var(--text-tertiary)] mt-2">
            사이드바에서 팀을 선택하거나 새 팀을 만들 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-headline">새 회의록</h1>
        <p className="text-intro text-[var(--text-secondary)]">
          회의를 녹음하면
          <br />
          AI가 자동으로 요약해드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Recording Area */}
        <div className="border-2 border-[var(--border)] rounded-2xl p-8 space-y-8">
          {/* Status */}
          <div className="text-center space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-body ${
                isRecording && !isPaused
                  ? 'bg-red-100 text-red-700'
                  : recordedBlob
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[var(--border-light)] text-[var(--text-secondary)]'
              }`}
            >
              {isRecording && !isPaused && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
              {getStatusText()}
            </div>

            {/* Timer */}
            <div className="text-[48px] font-light tracking-tight text-[var(--text-primary)] tabular-nums">
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Audio Level Meter */}
          <AudioLevelMeter level={audioLevel} isActive={isRecording && !isPaused} />

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording && !recordedBlob && (
              // 녹음 시작 버튼
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
              </button>
            )}

            {isRecording && (
              <>
                {/* 일시정지/재개 버튼 */}
                <button
                  type="button"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="w-16 h-16 rounded-full bg-[var(--border-light)] hover:bg-[var(--border)] transition-colors flex items-center justify-center"
                >
                  {isPaused ? (
                    // 재개 아이콘
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-8 h-8 text-[var(--text-primary)]"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    // 일시정지 아이콘
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-8 h-8 text-[var(--text-primary)]"
                    >
                      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                    </svg>
                  )}
                </button>

                {/* 녹음 중지 버튼 */}
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                >
                  {/* 정지 아이콘 (네모) */}
                  <div className="w-8 h-8 rounded-sm bg-white" />
                </button>

                {/* 취소 버튼 */}
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="w-16 h-16 rounded-full bg-[var(--border-light)] hover:bg-[var(--border)] transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-[var(--text-secondary)]"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            )}

            {recordedBlob && !isRecording && (
              <>
                {/* 다시 녹음 버튼 */}
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-6 py-3 rounded-full border border-[var(--border)] text-body text-[var(--text-secondary)] hover:bg-[var(--border-light)] transition-colors"
                >
                  다시 녹음
                </button>
              </>
            )}
          </div>

          {/* Recorded file info */}
          {recordedBlob && (
            <div className="text-center text-body text-[var(--text-tertiary)]">
              녹음 완료: {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>

        {/* Recorder Error */}
        {recorderError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-[15px] text-red-800">{recorderError}</p>
          </div>
        )}

        {/* Meeting Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
            >
              회의 제목 *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2024 Q4 제품 로드맵 회의"
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
              disabled={isUploading}
              required
            />
          </div>
          <div className="space-y-3">
            <label
              htmlFor="meeting-date"
              className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
            >
              회의 날짜 *
            </label>
            <input
              id="meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-light)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
              disabled={isUploading}
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-[15px] text-red-800">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body text-[var(--text-secondary)]">업로드 중...</span>
              <span className="text-body text-[var(--text-secondary)]">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-[var(--border-light)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--link)] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !recordedBlob || !title.trim() || !meetingDate || isRecording}
          className="w-full py-4 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? '업로드 중...' : 'AI 요약 시작하기'}
        </button>

        <p className="text-center text-caption text-[var(--text-tertiary)]">
          녹음된 파일은 요약 후 안전하게 삭제됩니다
        </p>
      </form>
    </div>
  );
}
