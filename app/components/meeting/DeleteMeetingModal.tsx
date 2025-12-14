'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { meetingApi } from '@/app/lib/api';

interface DeleteMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
  meetingTitle: string;
}

export default function DeleteMeetingModal({
  isOpen,
  onClose,
  meetingId,
  meetingTitle,
}: DeleteMeetingModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const response = await meetingApi.delete(meetingId);

    setIsDeleting(false);

    if (response.success) {
      onClose();
      router.push('/meetings');
    } else {
      setError(response.error?.message || '회의록 삭제에 실패했습니다');
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Body */}
        <div className="p-6 text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-[17px] font-semibold text-[var(--text-primary)] mb-2">회의록 삭제</h2>
          <p className="text-[14px] text-[var(--text-secondary)] mb-1">
            &quot;{meetingTitle}&quot; 회의록을 삭제하시겠습니까?
          </p>
          <p className="text-[13px] text-[var(--text-tertiary)]">이 작업은 되돌릴 수 없습니다.</p>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex border-t border-[var(--border-light)]">
          <button
            type="button"
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 text-[var(--text-primary)] text-[15px] font-medium hover:bg-[var(--background-secondary)] transition-colors disabled:opacity-50 border-r border-[var(--border-light)]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 text-red-600 text-[15px] font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
}
