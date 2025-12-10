import Link from 'next/link';
import { getRecentMeetings } from './data/mockMeetings';

export default function Home() {
  const recentMeetings = getRecentMeetings(3);

  return (
    <div className="py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-8">
        <h1 className="text-headline">
          회의록을
          <br />
          더 스마트하게.
        </h1>
        <p className="text-intro text-[var(--text-secondary)] max-w-md mx-auto">
          AI가 자동으로 회의 내용을 분석하고
          <br />
          핵심만 요약해드립니다.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/upload" className="link-apple text-[17px]">
            새 회의록 만들기 →
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/upload"
            className="group flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-all"
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10 text-[var(--link)]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="text-eyebrow text-[var(--text-primary)]">새 회의록</span>
            <span className="text-body text-[var(--text-secondary)] mt-1">업로드하기</span>
          </Link>
          <Link
            href="/meetings"
            className="group flex flex-col items-center justify-center p-8 bg-[var(--background)] border border-[var(--border-light)] rounded-2xl hover:bg-[var(--background-secondary)] transition-all"
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10 text-[var(--text-primary)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <span className="text-eyebrow text-[var(--text-primary)]">전체 회의록</span>
            <span className="text-body text-[var(--text-secondary)] mt-1">모두 보기</span>
          </Link>
        </div>
      </section>

      {/* Recent Meetings */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-headline-3">최근 회의록</h2>
            <p className="text-body text-[var(--text-secondary)] mt-1">
              최근에 요약된 회의록입니다
            </p>
          </div>
          <Link href="/meetings" className="link-apple text-[17px]">
            전체 보기
          </Link>
        </div>

        <div className="space-y-0 divide-y divide-[var(--border-light)]">
          {recentMeetings.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="block py-6 hover:bg-[var(--background-secondary)] -mx-6 px-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-eyebrow text-[var(--text-primary)]">{meeting.title}</h3>
              </div>
              <p className="text-body text-[var(--text-secondary)] line-clamp-2 mb-3">
                {meeting.summary}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-caption text-[var(--text-tertiary)]">{meeting.date}</span>
                <span className="text-caption text-[var(--text-tertiary)]">·</span>
                <span className="text-caption text-[var(--text-tertiary)]">{meeting.duration}</span>
                <span className="text-caption text-[var(--text-tertiary)]">·</span>
                <span className="text-caption text-[var(--text-tertiary)]">
                  {meeting.participants.length}명 참석
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-8">
        <h2 className="text-headline-3">한눈에 보기</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center py-6">
            <p className="text-headline-2 text-[var(--link)]">5</p>
            <p className="text-caption text-[var(--text-secondary)] mt-2">총 회의록</p>
          </div>
          <div className="text-center py-6 border-x border-[var(--border-light)]">
            <p className="text-headline-2 text-[#34c759]">3</p>
            <p className="text-caption text-[var(--text-secondary)] mt-2">완료된 할일</p>
          </div>
          <div className="text-center py-6">
            <p className="text-headline-2 text-[#ff9500]">7</p>
            <p className="text-caption text-[var(--text-secondary)] mt-2">진행중 할일</p>
          </div>
        </div>
      </section>
    </div>
  );
}
