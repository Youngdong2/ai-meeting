'use client';

import { MeetingStatus } from '@/app/types/api';

interface MeetingStatusBadgeProps {
  status: MeetingStatus;
}

const statusConfig: Record<MeetingStatus, { label: string; className: string }> = {
  pending: {
    label: '대기중',
    className: 'bg-gray-100 text-gray-600',
  },
  compressing: {
    label: '압축중',
    className: 'bg-blue-100 text-blue-600',
  },
  transcribing: {
    label: '변환중',
    className: 'bg-purple-100 text-purple-600',
  },
  correcting: {
    label: '교정중',
    className: 'bg-orange-100 text-orange-600',
  },
  summarizing: {
    label: '요약중',
    className: 'bg-yellow-100 text-yellow-600',
  },
  completed: {
    label: '완료',
    className: 'bg-green-100 text-green-600',
  },
  failed: {
    label: '실패',
    className: 'bg-red-100 text-red-600',
  },
};

export default function MeetingStatusBadge({ status }: MeetingStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium ${config.className}`}
    >
      {status !== 'completed' && status !== 'failed' && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
