'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/app/types/api';
import { teamApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface TeamMembersProps {
  teamId: number;
}

export default function TeamMembers({ teamId }: TeamMembersProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      const response = await teamApi.getMembers(teamId);

      if (response.success && response.data) {
        setMembers(response.data);
      } else {
        setError(response.error?.message || '멤버 목록을 불러오는데 실패했습니다.');
      }

      setIsLoading(false);
    };

    fetchMembers();
  }, [teamId]);

  const handleToggleAdmin = async (member: TeamMember) => {
    if (member.id === user?.id) {
      setError('자신의 권한은 변경할 수 없습니다.');
      return;
    }

    setActionLoading(member.id);
    setError(null);

    const response = member.is_team_admin
      ? await teamApi.revokeAdmin(teamId, member.id)
      : await teamApi.grantAdmin(teamId, member.id);

    if (response.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_team_admin: !m.is_team_admin } : m))
      );
    } else {
      setError(response.error?.message || '권한 변경에 실패했습니다.');
    }

    setActionLoading(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-secondary)]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-body">
          {error}
        </div>
      )}

      {/* Member Count */}
      <div className="flex items-center justify-between">
        <p className="text-body text-[var(--text-secondary)]">총 {members.length}명의 멤버</p>
      </div>

      {/* Members List */}
      <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)] rounded-2xl overflow-hidden">
        {members.map((member) => (
          <div key={member.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[var(--link)] rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {member.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-body font-medium">{member.username}</p>
                  {member.is_team_admin && (
                    <span className="px-2 py-0.5 bg-[var(--link)] text-white text-caption rounded">
                      관리자
                    </span>
                  )}
                  {member.id === user?.id && (
                    <span className="px-2 py-0.5 bg-[var(--background-secondary)] text-[var(--text-secondary)] text-caption rounded">
                      나
                    </span>
                  )}
                </div>
                <p className="text-caption text-[var(--text-secondary)]">{member.email}</p>
              </div>
            </div>

            {/* Admin Toggle Button */}
            {member.id !== user?.id && (
              <button
                onClick={() => handleToggleAdmin(member)}
                disabled={actionLoading === member.id}
                className={`px-4 py-2 rounded-full text-caption font-medium transition-colors ${
                  member.is_team_admin
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-[var(--background-secondary)] text-[var(--text-primary)] hover:bg-[var(--border-light)]'
                } disabled:opacity-50`}
              >
                {actionLoading === member.id
                  ? '처리 중...'
                  : member.is_team_admin
                    ? '관리자 해제'
                    : '관리자 지정'}
              </button>
            )}
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12 text-[var(--text-secondary)]">
          팀 멤버가 없습니다.
        </div>
      )}
    </div>
  );
}
