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
    <div className="py-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/meetings" className="link-apple inline-flex items-center gap-1 text-body">
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
        <h1 className="text-headline-2">{meeting.title}</h1>
        <div className="flex items-center gap-2 text-body text-[var(--text-secondary)]">
          <span>{meeting.date}</span>
          <span>·</span>
          <span>{meeting.duration}</span>
          <span>·</span>
          <span>{meeting.participants.length}명 참석</span>
        </div>
      </div>

      {/* Participants */}
      <section className="space-y-4">
        <h2 className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">참석자</h2>
        <div className="flex flex-wrap gap-2">
          {meeting.participants.map((participant, index) => (
            <span
              key={index}
              className="px-3 py-1.5 border border-[var(--border-light)] rounded-full text-body-tight"
            >
              {participant}
            </span>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-headline-3">요약</h2>
        <p className="text-intro text-[var(--text-secondary)] leading-relaxed">{meeting.summary}</p>
      </section>

      {/* Key Points */}
      <section className="space-y-6">
        <h2 className="text-headline-3">핵심 포인트</h2>
        <ul className="space-y-4">
          {meeting.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-[var(--link)] text-white rounded-full flex items-center justify-center text-caption font-semibold">
                {index + 1}
              </span>
              <span className="text-body text-[var(--text-primary)] pt-0.5">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Action Items */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-3">할일 목록</h2>
          <span className="text-body text-[var(--text-secondary)]">
            {completedActions}/{totalActions} 완료
          </span>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          {meeting.actionItems.map((item) => (
            <div key={item.id} className="py-4 flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  item.completed
                    ? 'bg-[#34c759] border-[#34c759]'
                    : 'border-[var(--border)] bg-transparent'
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
                  className={`text-body ${
                    item.completed
                      ? 'text-[var(--text-tertiary)] line-through'
                      : 'text-[var(--text-primary)]'
                  }`}
                >
                  {item.task}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-caption text-[var(--text-tertiary)]">{item.assignee}</span>
                  <span className="text-caption text-[var(--text-tertiary)]">·</span>
                  <span className="text-caption text-[var(--text-tertiary)]">
                    마감: {item.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button className="flex-1 py-3 text-[var(--link)] text-body font-medium border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors">
          공유하기
        </button>
        <button className="flex-1 py-3 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity">
          수정하기
        </button>
      </div>
    </div>
  );
}
