import Link from 'next/link';
import { mockMeetings } from '../data/mockMeetings';

export default function MeetingsPage() {
  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">회의록</h1>
        <Link
          href="/upload"
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          새 회의록
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full whitespace-nowrap">
          전체
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          이번 주
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          이번 달
        </button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700">
          할일 있음
        </button>
      </div>

      {/* Meeting list */}
      <div className="space-y-3">
        {mockMeetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/meetings/${meeting.id}`}
            className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium line-clamp-1">{meeting.title}</h3>
              <div className="flex items-center gap-2 ml-2">
                {meeting.actionItems.some((item) => !item.completed) && (
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                    할일 {meeting.actionItems.filter((item) => !item.completed).length}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {meeting.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{meeting.date}</span>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-400">{meeting.duration}</span>
              </div>
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {participant.charAt(0)}
                    </span>
                  </div>
                ))}
                {meeting.participants.length > 3 && (
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span className="text-xs text-gray-500">+{meeting.participants.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
