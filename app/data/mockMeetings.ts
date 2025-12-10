export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  transcript?: string;
  status: 'completed' | 'processing' | 'pending';
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: '2024 Q4 제품 로드맵 회의',
    date: '2024-12-10',
    duration: '1시간 30분',
    participants: ['김영동', '이수진', '박민호', '정다은'],
    summary:
      '2024년 4분기 제품 로드맵에 대해 논의했습니다. 주요 기능 우선순위를 정하고, 출시 일정을 확정했습니다. AI 기반 추천 시스템 개발이 최우선 과제로 선정되었습니다.',
    keyPoints: [
      'AI 추천 시스템 1월 출시 목표',
      '사용자 대시보드 리뉴얼 진행',
      '모바일 앱 성능 최적화 필요',
      'Q1 마케팅 캠페인 준비',
    ],
    actionItems: [
      {
        id: '1-1',
        task: 'AI 추천 시스템 기술 검토 문서 작성',
        assignee: '박민호',
        dueDate: '2024-12-15',
        completed: false,
      },
      {
        id: '1-2',
        task: '대시보드 디자인 시안 준비',
        assignee: '정다은',
        dueDate: '2024-12-20',
        completed: false,
      },
      {
        id: '1-3',
        task: '성능 최적화 이슈 목록 정리',
        assignee: '이수진',
        dueDate: '2024-12-12',
        completed: true,
      },
    ],
    status: 'completed',
  },
  {
    id: '2',
    title: '주간 스프린트 회고',
    date: '2024-12-09',
    duration: '45분',
    participants: ['김영동', '이수진', '최준혁'],
    summary:
      '이번 스프린트에서 완료된 작업과 개선점을 논의했습니다. 코드 리뷰 프로세스 개선이 필요하다는 의견이 있었습니다.',
    keyPoints: [
      '로그인 기능 구현 완료',
      '코드 리뷰 시간 단축 필요',
      '테스트 커버리지 80% 달성',
      '다음 스프린트 목표 설정',
    ],
    actionItems: [
      {
        id: '2-1',
        task: '코드 리뷰 가이드라인 문서화',
        assignee: '김영동',
        dueDate: '2024-12-11',
        completed: false,
      },
    ],
    status: 'completed',
  },
  {
    id: '3',
    title: '신규 파트너십 논의',
    date: '2024-12-08',
    duration: '2시간',
    participants: ['김영동', '한지원', '외부: 삼성전자 김부장'],
    summary:
      '삼성전자와의 전략적 파트너십에 대해 논의했습니다. 기술 협력 및 공동 마케팅 가능성을 탐색했습니다.',
    keyPoints: [
      'API 연동 기술 검토 필요',
      '공동 마케팅 예산 협의',
      'NDA 체결 후 상세 논의 진행',
      '다음 미팅 1월 중 예정',
    ],
    actionItems: [
      {
        id: '3-1',
        task: 'NDA 문서 법무팀 검토 요청',
        assignee: '한지원',
        dueDate: '2024-12-13',
        completed: false,
      },
      {
        id: '3-2',
        task: 'API 기술 문서 준비',
        assignee: '김영동',
        dueDate: '2024-12-18',
        completed: false,
      },
    ],
    status: 'completed',
  },
  {
    id: '4',
    title: '디자인 시스템 리뷰',
    date: '2024-12-07',
    duration: '1시간',
    participants: ['정다은', '이수진', '김하늘'],
    summary:
      '새로운 디자인 시스템 컴포넌트를 리뷰하고 피드백을 공유했습니다. 접근성 개선이 주요 논의 사항이었습니다.',
    keyPoints: [
      '버튼 컴포넌트 접근성 개선',
      '다크모드 색상 팔레트 확정',
      '아이콘 라이브러리 통일',
      'Figma 컴포넌트 업데이트',
    ],
    actionItems: [
      {
        id: '4-1',
        task: 'WCAG 2.1 기준 접근성 검토',
        assignee: '정다은',
        dueDate: '2024-12-14',
        completed: false,
      },
    ],
    status: 'completed',
  },
  {
    id: '5',
    title: '고객 피드백 분석 회의',
    date: '2024-12-06',
    duration: '1시간 15분',
    participants: ['이수진', '박민호', '고객지원팀'],
    summary:
      '최근 수집된 고객 피드백을 분석하고 우선순위를 정했습니다. UX 개선 요청이 가장 많았습니다.',
    keyPoints: [
      '검색 기능 개선 요청 다수',
      '모바일 앱 로딩 속도 불만',
      '알림 설정 기능 요청',
      '고객 만족도 85% 유지',
    ],
    actionItems: [
      {
        id: '5-1',
        task: '검색 기능 개선 요구사항 정리',
        assignee: '박민호',
        dueDate: '2024-12-10',
        completed: true,
      },
      {
        id: '5-2',
        task: '모바일 성능 프로파일링',
        assignee: '이수진',
        dueDate: '2024-12-16',
        completed: false,
      },
    ],
    status: 'completed',
  },
];

export function getMeetingById(id: string): Meeting | undefined {
  return mockMeetings.find((meeting) => meeting.id === id);
}

export function getRecentMeetings(count: number = 5): Meeting[] {
  return mockMeetings.slice(0, count);
}
