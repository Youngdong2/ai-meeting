'use client';

import { useEffect, useState, useCallback } from 'react';
import { meetingApi } from '@/app/lib/api';
import { MeetingStatus, MEETING_STATUS_DISPLAY } from '@/app/types/api';

interface ProcessingStatusProps {
  meetingId: number;
  initialStatus: MeetingStatus;
  onComplete?: () => void;
  onFailed?: (errorMessage: string) => void;
}

const POLLING_INTERVAL = 3000; // 3 seconds

const STATUS_ORDER: MeetingStatus[] = [
  'pending',
  'compressing',
  'transcribing',
  'correcting',
  'summarizing',
  'completed',
];

const getStatusProgress = (status: MeetingStatus): number => {
  const index = STATUS_ORDER.indexOf(status);
  if (index === -1) return 0;
  return Math.round((index / (STATUS_ORDER.length - 1)) * 100);
};

export default function ProcessingStatus({
  meetingId,
  initialStatus,
  onComplete,
  onFailed,
}: ProcessingStatusProps) {
  const [status, setStatus] = useState<MeetingStatus>(initialStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  const progress = getStatusProgress(status);

  const pollStatus = useCallback(async () => {
    try {
      const response = await meetingApi.getStatus(meetingId);

      if (response.success && response.data) {
        setStatus(response.data.status);

        if (response.data.status === 'completed') {
          setIsPolling(false);
          onComplete?.();
        } else if (response.data.status === 'failed') {
          setIsPolling(false);
          setErrorMessage(response.data.error_message || '처리에 실패했습니다');
          onFailed?.(response.data.error_message || '처리에 실패했습니다');
        }
      }
    } catch {
      // Silent fail for polling errors
      console.error('[ProcessingStatus] Polling error');
    }
  }, [meetingId, onComplete, onFailed]);

  useEffect(() => {
    if (!isPolling) return;

    // Set up interval (first poll happens after POLLING_INTERVAL)
    const intervalId = setInterval(pollStatus, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isPolling, pollStatus]);

  // Initial poll on mount (separate effect to avoid lint warning)
  useEffect(() => {
    const timeoutId = setTimeout(pollStatus, 100);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't show if already completed
  if (status === 'completed') {
    return null;
  }

  // Failed state
  if (status === 'failed') {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-red-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-medium text-red-800">처리에 실패했습니다</p>
            <p className="text-[13px] text-red-600 mt-1">
              {errorMessage || '다시 시도하거나 관리자에게 문의하세요'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Processing state
  return (
    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="flex-1">
          <p className="text-[15px] font-medium text-blue-800">처리 중입니다</p>
          <p className="text-[13px] text-blue-600">{MEETING_STATUS_DISPLAY[status]}</p>
        </div>
        <div className="text-[15px] font-medium text-blue-800">{progress}%</div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status steps */}
      <div className="flex justify-between text-[11px] text-blue-600">
        {STATUS_ORDER.filter((s) => s !== 'pending').map((s) => (
          <span
            key={s}
            className={`${
              STATUS_ORDER.indexOf(status) >= STATUS_ORDER.indexOf(s)
                ? 'text-blue-800 font-medium'
                : 'text-blue-400'
            }`}
          >
            {MEETING_STATUS_DISPLAY[s]}
          </span>
        ))}
      </div>
    </div>
  );
}
