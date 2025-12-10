'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSummary, setAutoSummary] = useState(true);

  return (
    <div className="py-8 space-y-10">
      <h1 className="text-headline">설정</h1>

      {/* Account Section */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">계정</h2>
        <button className="w-full p-5 flex items-center gap-4 border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-colors">
          <div className="w-14 h-14 bg-[var(--link)] rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">김</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-body font-medium">김영동</p>
            <p className="text-caption text-[var(--text-secondary)]">youngdong@email.com</p>
          </div>
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
      </section>

      {/* Preferences Section */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
          환경설정
        </h2>
        <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)] rounded-2xl overflow-hidden">
          {/* Dark Mode */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#5e5ce6] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                  />
                </svg>
              </div>
              <span className="text-body">다크 모드</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                darkMode ? 'bg-[#34c759]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform ${
                  darkMode ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#ff3b30] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>
              <span className="text-body">알림</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                notifications ? 'bg-[#34c759]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform ${
                  notifications ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* Auto Summary */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#34c759] rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-body">자동 요약</span>
                <p className="text-caption text-[var(--text-tertiary)]">
                  업로드 시 자동으로 AI 요약 실행
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoSummary(!autoSummary)}
              className={`relative w-[51px] h-[31px] rounded-full transition-colors ${
                autoSummary ? 'bg-[#34c759]' : 'bg-[var(--border)]'
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-sm transition-transform ${
                  autoSummary ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">정보</h2>
        <div className="divide-y divide-[var(--border-light)] border border-[var(--border-light)] rounded-2xl overflow-hidden">
          <button className="w-full p-5 flex items-center justify-between hover:bg-[var(--background-secondary)] transition-colors">
            <span className="text-body">이용약관</span>
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
          <button className="w-full p-5 flex items-center justify-between hover:bg-[var(--background-secondary)] transition-colors">
            <span className="text-body">개인정보처리방침</span>
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
          <div className="p-5 flex items-center justify-between">
            <span className="text-body">버전</span>
            <span className="text-body text-[var(--text-tertiary)]">1.0.0</span>
          </div>
        </div>
      </section>

      {/* Logout Button */}
      <button className="w-full py-4 text-[#ff3b30] text-body font-medium border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors">
        로그아웃
      </button>
    </div>
  );
}
