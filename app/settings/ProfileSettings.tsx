'use client';

import { useState } from 'react';
import { User, ChangePasswordRequest } from '@/app/types/api';
import { profileApi } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTeam } from '@/app/contexts/TeamContext';
import { useRouter } from 'next/navigation';

interface ProfileSettingsProps {
  user: User;
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { currentTeam } = useTeam();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdatePhone = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const response = await profileApi.updateProfile({ phone_number: phoneNumber });

    if (response.success) {
      setSuccess('전화번호가 수정되었습니다.');
      setIsEditingPhone(false);
    } else {
      setError(response.error?.message || '전화번호 수정에 실패했습니다.');
    }

    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.new_password_confirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const response = await profileApi.changePassword(passwordForm);

    if (response.success) {
      setSuccess('비밀번호가 변경되었습니다.');
      setIsChangingPassword(false);
      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } else {
      setError(response.error?.message || '비밀번호 변경에 실패했습니다.');
    }

    setIsSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-body">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-body">
          {success}
        </div>
      )}

      {/* Profile Info */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
          계정 정보
        </h2>
        <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)] rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">이름</span>
            <span className="text-body">{user.username}</span>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">이메일</span>
            <span className="text-body">{user.email}</span>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">성별</span>
            <span className="text-body">{user.gender === 'M' ? '남성' : '여성'}</span>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">생년월일</span>
            <span className="text-body">{user.birth_date}</span>
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">전화번호</span>
            {isEditingPhone ? (
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                  placeholder="010-0000-0000"
                />
                <button
                  onClick={handleUpdatePhone}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-[var(--link)] text-white rounded-lg text-caption hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={() => {
                    setIsEditingPhone(false);
                    setPhoneNumber(user.phone_number);
                  }}
                  className="px-3 py-1.5 text-[var(--text-secondary)] text-caption hover:text-[var(--text-primary)]"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-body">{user.phone_number}</span>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-[var(--link)] text-caption hover:underline"
                >
                  수정
                </button>
              </div>
            )}
          </div>
          <div className="p-5 flex items-center justify-between">
            <span className="text-body text-[var(--text-secondary)]">팀</span>
            <span className="text-body">
              {currentTeam?.name || '소속 팀 없음'}
              {user.is_team_admin && (
                <span className="ml-2 px-2 py-0.5 bg-[var(--link)] text-white text-caption rounded">
                  관리자
                </span>
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Password Change */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
          비밀번호
        </h2>
        {isChangingPassword ? (
          <div className="space-y-4 p-5 border border-[var(--border-light)] rounded-2xl">
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current_password: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                새 비밀번호
              </label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new_password: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
                placeholder="8자 이상"
              />
            </div>
            <div>
              <label className="block text-caption text-[var(--text-secondary)] mb-2">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordForm.new_password_confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, new_password_confirm: e.target.value })
                }
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-body focus:outline-none focus:ring-2 focus:ring-[var(--link)]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="px-6 py-3 bg-[var(--link)] text-white rounded-full text-body font-medium hover:opacity-90 disabled:opacity-50"
              >
                {isSaving ? '변경 중...' : '비밀번호 변경'}
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirm: '',
                  });
                }}
                className="px-6 py-3 text-[var(--text-secondary)] text-body hover:text-[var(--text-primary)]"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="w-full p-5 flex items-center justify-between border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-colors"
          >
            <span className="text-body">비밀번호 변경</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-[var(--text-tertiary)]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </section>

      {/* App Info */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">정보</h2>
        <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)] rounded-2xl overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <span className="text-body">버전</span>
            <span className="text-body text-[var(--text-tertiary)]">1.0.0</span>
          </div>
        </div>
      </section>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-4 text-[#ff3b30] text-body font-medium border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
}
