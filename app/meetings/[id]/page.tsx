import Link from 'next/link';
import { getMeetingById, mockMeetings } from '../../data/mockMeetings';
import { notFound } from 'next/navigation';

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockMeetings.map((meeting) => ({
    id: meeting.id,
  }));
}

export default async function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const { id } = await params;
  const meeting = getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  const completedActions = meeting.actionItems.filter((item) => item.completed).length;
  const totalActions = meeting.actionItems.length;

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1 text-blue-500 text-sm font-medium hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          회의록 목록
        </Link>
        <h1 className="text-2xl font-bold">{meeting.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{meeting.date}</span>
          <span>•</span>
          <span>{meeting.duration}</span>
          <span>•</span>
          <span>{meeting.participants.length}명 참석</span>
        </div>
      </div>

      {/* Participants */}
      <section className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <h2 className="text-sm font-medium text-gray-500 mb-3">참석자</h2>
        <div className="flex flex-wrap gap-2">
          {meeting.participants.map((participant, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm"
            >
              {participant}
            </span>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">요약</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{meeting.summary}</p>
      </section>

      {/* Key Points */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">핵심 포인트</h2>
        <ul className="space-y-2">
          {meeting.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action Items */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">할일 목록</h2>
          <span className="text-sm text-gray-500">
            {completedActions}/{totalActions} 완료
          </span>
        </div>
        <div className="space-y-2">
          {meeting.actionItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border ${
                item.completed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.completed && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="white"
                      className="w-3 h-3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium ${
                      item.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {item.task}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span>{item.assignee}</span>
                    <span>•</span>
                    <span>마감: {item.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          공유하기
        </button>
        <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors">
          수정하기
        </button>
      </div>
    </div>
  );
}
