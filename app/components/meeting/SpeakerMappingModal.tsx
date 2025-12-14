'use client';

import { useState } from 'react';
import { SpeakerMapping } from '@/app/types/api';
import { meetingApi } from '@/app/lib/api';

interface SpeakerMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
  speakerMappings: SpeakerMapping[];
  onSave: () => void;
}

export default function SpeakerMappingModal({
  isOpen,
  onClose,
  meetingId,
  speakerMappings,
  onSave,
}: SpeakerMappingModalProps) {
  // speakerMappings에서 초기값 생성
  const initialMappings: Record<string, string> = {};
  speakerMappings.forEach((m) => {
    initialMappings[m.speaker_label] = m.speaker_name || '';
  });

  const [mappings, setMappings] = useState<Record<string, string>>(initialMappings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (label: string, name: string) => {
    setMappings((prev) => ({
      ...prev,
      [label]: name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const mappingArray = Object.entries(mappings).map(([speaker_label, speaker_name]) => ({
      speaker_label,
      speaker_name,
    }));

    const response = await meetingApi.updateSpeakers(meetingId, { mappings: mappingArray });

    setIsSubmitting(false);

    if (response.success) {
      onSave();
      onClose();
    } else {
      setError(response.error?.message || '화자 이름 저장에 실패했습니다');
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
      <div className="relative bg-[var(--background)] rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">화자 이름 설정</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[14px] text-[var(--text-secondary)]">
            각 화자에게 실제 이름을 지정하면 대화 내용을 더 쉽게 읽을 수 있습니다.
          </p>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {speakerMappings.map((mapping) => (
              <div key={mapping.speaker_label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-24">
                  <span className="text-[14px] font-medium text-[var(--text-tertiary)]">
                    {mapping.speaker_label}
                  </span>
                </div>
                <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <input
                  type="text"
                  value={mappings[mapping.speaker_label] || ''}
                  onChange={(e) => handleNameChange(mapping.speaker_label, e.target.value)}
                  placeholder="이름 입력"
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--link)] transition-colors disabled:opacity-50"
                />
              </div>
            ))}
          </div>

          {speakerMappings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[14px] text-[var(--text-tertiary)]">화자 정보가 없습니다</p>
            </div>
          )}

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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[var(--link)] text-white rounded-lg text-[15px] font-medium hover:bg-[var(--link-hover)] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
