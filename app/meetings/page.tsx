import Link from 'next/link';
import { mockMeetings } from '../data/mockMeetings';

export default function MeetingsPage() {
  return (
    <div className="py-8 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-headline">회의록</h1>
        <p className="text-intro text-[var(--text-secondary)]">
          모든 회의록을 한눈에 확인하세요
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="회의록 검색..."
          className="w-full pl-12 pr-4 py-3 bg-[var(--background-secondary)] rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] border border-[var(--border-light)]"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
        <button className="px-4 py-2 bg-[var(--text-primary)] text-[var(--background)] text-body-tight font-medium rounded-full whitespace-nowrap">
          전체
        </button>
        <button className="px-4 py-2 text-[var(--text-secondary)] text-body-tight font-medium rounded-full whitespace-nowrap hover:text-[var(--text-primary)] border border-[var(--border-light)]">
          이번 주
        </button>
        <button className="px-4 py-2 text-[var(--text-secondary)] text-body-tight font-medium rounded-full whitespace-nowrap hover:text-[var(--text-primary)] border border-[var(--border-light)]">
          이번 달
        </button>
        <button className="px-4 py-2 text-[var(--text-secondary)] text-body-tight font-medium rounded-full whitespace-nowrap hover:text-[var(--text-primary)] border border-[var(--border-light)]">
          할일 있음
        </button>
      </div>

      {/* Meeting list */}
      <div className="divide-y divide-[var(--border-light)]">
        {mockMeetings.map((meeting) => {
          const pendingActions = meeting.actionItems.filter((item) => !item.completed).length;
          return (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="block py-6 hover:bg-[var(--background-secondary)] -mx-6 px-6 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-eyebrow text-[var(--text-primary)] line-clamp-1">
                  {meeting.title}
                </h3>
                {pendingActions > 0 && (
                  <span className="ml-3 px-2 py-0.5 bg-[#ff9500] text-white text-caption font-medium rounded-full whitespace-nowrap">
                    할일 {pendingActions}
                  </span>
                )}
              </div>
              <p className="text-body text-[var(--text-secondary)] line-clamp-2 mb-4">
                {meeting.summary}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-[var(--text-tertiary)]">{meeting.date}</span>
                  <span className="text-caption text-[var(--text-tertiary)]">·</span>
                  <span className="text-caption text-[var(--text-tertiary)]">{meeting.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  {meeting.participants.slice(0, 3).map((participant, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-[var(--border)] rounded-full flex items-center justify-center -ml-1 first:ml-0"
                    >
                      <span className="text-[10px] font-medium text-[var(--text-primary)]">
                        {participant.charAt(0)}
                      </span>
                    </div>
                  ))}
                  {meeting.participants.length > 3 && (
                    <span className="text-caption text-[var(--text-tertiary)] ml-1">
                      +{meeting.participants.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
