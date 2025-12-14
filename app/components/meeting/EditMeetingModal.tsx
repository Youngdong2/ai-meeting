'use client';

import { useState } from 'react';
import { Meeting, UpdateMeetingRequest } from '@/app/types/api';
import { meetingApi } from '@/app/lib/api';

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting;
  onSave: () => void;
}

export default function EditMeetingModal({ isOpen, onClose, meeting, onSave }: EditMeetingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때마다 meeting 값을 직접 사용
  const initialDate = new Date(meeting.meeting_date).toISOString().split('T')[0];
  const [title, setTitle] = useState(meeting.title);
  const [meetingDate, setMeetingDate] = useState(initialDate);
  const [summary, setSummary] = useState(meeting.summary || '');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const updateData: UpdateMeetingRequest = {};

    if (title !== meeting.title) {
      updateData.title = title.trim();
    }

    const originalDate = new Date(meeting.meeting_date).toISOString().split('T')[0];
    if (meetingDate !== originalDate) {
      updateData.meeting_date = new Date(meetingDate).toISOString();
    }

    if (summary !== (meeting.summary || '')) {
      updateData.summary = summary;
    }

    // 변경사항이 없으면 그냥 닫기
    if (Object.keys(updateData).length === 0) {
      setIsSubmitting(false);
      onClose();
      return;
    }

    const response = await meetingApi.update(meeting.id, updateData);

    setIsSubmitting(false);

    if (response.success) {
      onSave();
      onClose();
    } else {
      setError(response.error?.message || '회의록 수정에 실패했습니다');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-[var(--background)] rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">회의록 수정</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="meeting-title" className="block text-[14px] font-medium text-[var(--text-primary)]">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="meeting-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="회의 제목"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--link)] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="meeting-date" className="block text-[14px] font-medium text-[var(--text-primary)]">
              회의 날짜
            </label>
            <input
              id="meeting-date"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[15px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--link)] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="meeting-summary" className="block text-[14px] font-medium text-[var(--text-primary)]">
              요약
            </label>
            <textarea
              id="meeting-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="회의 요약을 입력하세요 (마크다운 지원)"
              disabled={isSubmitting}
              rows={10}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--link)] transition-colors resize-none disabled:opacity-50 font-mono text-[13px]"
            />
            <p className="text-[12px] text-[var(--text-tertiary)]">마크다운 문법을 사용할 수 있습니다.</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[var(--background-secondary)] text-[var(--text-primary)] rounded-lg text-[15px] font-medium hover:bg-[var(--border-light)] transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 px-4 py-2.5 bg-[var(--link)] text-white rounded-lg text-[15px] font-medium hover:bg-[var(--link-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
