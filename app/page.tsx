import Link from 'next/link';
import { getRecentMeetings } from './data/mockMeetings';

export default function Home() {
  const recentMeetings = getRecentMeetings(3);

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">AI 회의록 요약</h1>
        <p className="text-gray-500 dark:text-gray-400">
          회의 내용을 AI가 자동으로 분석하고
          <br />
          핵심 내용을 요약해드립니다
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/upload"
          className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="font-medium">새 회의록</span>
        </Link>
        <Link
          href="/meetings"
          className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 mb-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <span className="font-medium">전체 회의록</span>
        </Link>
      </section>

      {/* Recent Meetings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">최근 회의록</h2>
          <Link
            href="/meetings"
            className="text-blue-500 text-sm font-medium hover:text-blue-600"
          >
            전체 보기
          </Link>
        </div>
        <div className="space-y-3">
          {recentMeetings.map((meeting) => (
            <Link
              key={meeting.id}
              href={`/meetings/${meeting.id}`}
              className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium line-clamp-1">{meeting.title}</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {meeting.date}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {meeting.summary}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-400">{meeting.duration}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400">
                  {meeting.participants.length}명 참석
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-500">5</p>
          <p className="text-xs text-gray-500 mt-1">총 회의록</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-500">3</p>
          <p className="text-xs text-gray-500 mt-1">완료된 할일</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
          <p className="text-2xl font-bold text-orange-500">7</p>
          <p className="text-xs text-gray-500 mt-1">진행중 할일</p>
        </div>
      </section>
    </div>
  );
}
