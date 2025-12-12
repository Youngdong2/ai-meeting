'use client';

import { useState } from 'react';
import { useTeam } from '@/app/contexts/TeamContext';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const { createTeam } = useTeam();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 메시지를 문자열로 변환
  const formatError = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
      // Django validation error format: {field: [errors...]}
      const errorObj = err as Record<string, unknown>;
      const messages: string[] = [];
      for (const [, value] of Object.entries(errorObj)) {
        if (Array.isArray(value)) {
          messages.push(...value.map(String));
        } else if (typeof value === 'string') {
          messages.push(value);
        }
      }
      if (messages.length > 0) return messages.join(', ');
      return JSON.stringify(err);
    }
    return '팀 생성에 실패했습니다';
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('팀 이름을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createTeam({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setName('');
      setDescription('');
      onClose();
    } else {
      setError(formatError(result.error));
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setDescription('');
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
          <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">새 팀 만들기</h2>
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
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="team-name" className="block text-[14px] font-medium text-[var(--text-primary)]">
              팀 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="team-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: AI개발팀"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--link)] transition-colors disabled:opacity-50"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="team-description" className="block text-[14px] font-medium text-[var(--text-primary)]">
              설명 <span className="text-[var(--text-tertiary)]">(선택)</span>
            </label>
            <textarea
              id="team-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="팀에 대한 간단한 설명을 입력하세요"
              disabled={isSubmitting}
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border-light)] rounded-lg text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--link)] transition-colors resize-none disabled:opacity-50"
            />
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
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-[var(--link)] text-white rounded-lg text-[15px] font-medium hover:bg-[var(--link-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '생성 중...' : '팀 만들기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
