# AI Meeting Frontend 개발 계획

## 프로젝트 개요

Django 백엔드 API와 연동하는 Next.js 16 프론트엔드 개발

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables (Apple 디자인 시스템)
- **State Management**: React Context
- **API**: REST API (Django 백엔드)
- **Backend API Docs**: `ai-meeting-api/docs/API_REFERENCE.md`

---

## 개발 단계

### Phase 0: 데스크톱 전용 레이아웃 ✅ 완료

- [x] 모바일 접근 차단 (768px 미만)
- [x] 최소 너비 제한 (1024px)
- [x] 사이드바 레이아웃 구성

### Phase 1: API 기반 구축 + 팀 기능 ✅ 완료

- [x] API 타입 정의 (`app/types/api.ts`)
- [x] API 클라이언트 구현 (`app/lib/api.ts`)
  - [x] Token 관리 (access/refresh)
  - [x] 자동 토큰 갱신
  - [x] 에러 핸들링
- [x] API 프록시 라우트 (`app/api/proxy/[...path]/route.ts`)
  - [x] Django trailing slash 호환성 처리
- [x] 인증 Context (`app/contexts/AuthContext.tsx`)
- [x] 팀 Context (`app/contexts/TeamContext.tsx`)
- [x] 팀 선택 UI (`app/components/team/TeamSelector.tsx`)
- [x] 팀 생성 모달 (`app/components/team/CreateTeamModal.tsx`)

### Phase 2: 회의록 목록/상세 페이지 ✅ 완료

- [x] Meeting Context 구현 (`app/contexts/MeetingContext.tsx`)
- [x] 회의록 목록 페이지 (`app/meetings/page.tsx`)
  - [x] 팀별 회의록 필터링
  - [x] 상태별 뱃지 표시 (pending, transcribing, completed 등)
  - [x] 검색 기능
- [x] 회의록 상세 페이지 (`app/meetings/[id]/page.tsx`)
  - [x] 요약 내용 표시
  - [x] 전체 스크립트 표시
  - [x] 처리 상태 표시
- [x] 홈페이지 API 연동 (`app/page.tsx`)
- [x] MeetingStatusBadge 컴포넌트 (`app/components/meeting/MeetingStatusBadge.tsx`)

### Phase 3: 브라우저 녹음 + 회의록 생성 ✅ 완료

- [x] 브라우저 실시간 녹음 페이지 (`app/record/page.tsx`)
  - MediaRecorder API + Web Audio API 사용
  - 녹음 포맷: WebM (Opus 코덱)
- [x] 녹음 훅 (`app/hooks/useAudioRecorder.ts`)
  - 녹음 시작/일시정지/재개/중지/취소
  - 실시간 오디오 레벨 분석
  - 녹음 시간 타이머
- [x] 오디오 레벨 시각화 (`app/components/recording/AudioLevelMeter.tsx`)
- [x] 녹음 UI 구성
  - 상태 표시 (대기/녹음중/일시정지/완료)
  - 타이머 (HH:MM:SS 형식)
  - 컨트롤 버튼 (시작/일시정지/재개/중지/취소)
  - 회의 정보 폼 (제목, 날짜)
- [x] 녹음 완료 → 파일 업로드 플로우
  - Blob → File 변환 후 `meetingApi.createWithFile()` 호출
- [x] API 클라이언트 파일 업로드 메서드 (`meetingApi.createWithFile()`)
- [x] 프록시 라우트 multipart/form-data 지원
- [x] 처리 상태 폴링 컴포넌트 (`app/components/meeting/ProcessingStatus.tsx`)
  - 3초 간격 폴링
  - 상태별 프로그레스 바 표시 (pending → compressing → transcribing → correcting → summarizing → completed)

### Phase 4: 설정 페이지

- [ ] 팀 설정 페이지 (`app/(main)/settings/team/page.tsx`)
  - [ ] OpenAI API Key 설정
  - [ ] Confluence 연동 설정
  - [ ] Slack 연동 설정
- [ ] 프로필 설정 페이지 (`app/(main)/settings/profile/page.tsx`)
  - [ ] 프로필 수정
  - [ ] 비밀번호 변경
- [ ] 팀 멤버 관리 (관리자 전용)

### Phase 5: 다크 모드

- [ ] 시스템 설정 감지
- [ ] 수동 토글
- [ ] CSS 변수 기반 테마 전환

### Phase 6: 외부 연동

- [ ] Confluence 업로드 기능
- [ ] Slack 공유 기능
- [ ] 연동 상태 표시

---

## 파일 구조

```
app/
├── (auth)/                    # 인증 관련 페이지
│   ├── login/page.tsx
│   └── signup/page.tsx
├── layout.tsx                 # 루트 레이아웃 (사이드바 포함)
├── page.tsx                   # 홈 (최근 회의록)
├── meetings/
│   ├── page.tsx               # 회의록 목록
│   └── [id]/page.tsx          # 회의록 상세 + 처리 상태
├── record/
│   └── page.tsx               # 브라우저 녹음 페이지
├── hooks/
│   └── useAudioRecorder.ts    # 녹음 훅 (MediaRecorder + Web Audio)
├── settings/                  # (Phase 4에서 구현)
│   ├── team/page.tsx
│   └── profile/page.tsx
├── api/
│   └── proxy/[...path]/route.ts  # API 프록시 (JSON + FormData)
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── team/
│   │   ├── TeamSelector.tsx
│   │   └── CreateTeamModal.tsx
│   ├── meeting/
│   │   ├── MeetingStatusBadge.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── index.ts
│   ├── recording/
│   │   ├── AudioLevelMeter.tsx  # 오디오 레벨 시각화
│   │   └── index.ts
│   └── ui/                   # 공통 UI 컴포넌트
├── contexts/
│   ├── AuthContext.tsx
│   ├── TeamContext.tsx
│   └── MeetingContext.tsx
├── lib/
│   └── api.ts                # API 클라이언트 (토큰 관리, 파일 업로드)
└── types/
    └── api.ts                # API 타입 정의
```

---

## API 엔드포인트 참조

> 상세 API 명세는 `ai-meeting-api/docs/API_REFERENCE.md` 참조

### 인증

- `POST /users/auth/login` - 로그인
- `POST /users/auth/signup` - 회원가입
- `POST /users/auth/check-email` - 이메일 중복 확인
- `POST /users/auth/logout` - 로그아웃
- `POST /users/token/refresh` - 토큰 갱신

### 프로필

- `GET /users/profile/me` - 내 프로필 조회
- `PATCH /users/profile/update` - 프로필 수정
- `POST /users/profile/change-password` - 비밀번호 변경
- `DELETE /users/profile/me` - 계정 삭제

### 팀

- `GET /teams/` - 팀 목록
- `POST /teams/` - 팀 생성
- `GET /teams/{id}/` - 팀 상세
- `GET /teams/{id}/settings` - 팀 설정 (관리자)
- `PATCH /teams/{id}/settings` - 팀 설정 수정 (관리자)
- `GET /teams/{id}/members` - 팀 멤버 목록
- `POST /teams/{id}/members/{user_id}/admin` - 관리자 권한 부여
- `DELETE /teams/{id}/members/{user_id}/admin` - 관리자 권한 해제

### 회의록

- `GET /meetings/` - 회의록 목록
- `POST /meetings/` - 회의록 생성 (multipart/form-data, 최대 500MB)
- `GET /meetings/{id}/` - 회의록 상세
- `PATCH /meetings/{id}/` - 회의록 수정
- `DELETE /meetings/{id}/` - 회의록 삭제
- `GET /meetings/{id}/status` - 처리 상태
- `GET /meetings/{id}/speakers` - 화자 목록
- `PATCH /meetings/{id}/speakers` - 화자 이름 매핑
- `POST /meetings/{id}/transcribe` - STT 재실행
- `POST /meetings/{id}/summarize` - 요약 재생성
- `GET /meetings/search` - 회의록 검색

### 외부 연동

- `POST /meetings/{id}/confluence/upload` - Confluence 업로드
- `GET /meetings/{id}/confluence/status` - Confluence 상태
- `POST /meetings/{id}/slack/share` - Slack 공유
- `GET /meetings/{id}/slack/status` - Slack 상태

---

## 알려진 이슈

### Django Trailing Slash

백엔드 API URL 일관성 문제:

- trailing slash 없음:
  - `/users/auth/*` 경로
  - `/users/token/refresh`
  - `/users/profile/*` 경로
- trailing slash 필요:
  - `/teams/`, `/meetings/` 경로

**해결**: `buildApiPath()` 함수의 `NO_TRAILING_SLASH_PATHS` 배열에서 경로별로 처리

---

## 변경 이력

| 날짜       | 내용                                                               |
| ---------- | ------------------------------------------------------------------ |
| 2025-01-15 | Phase 0 완료 (데스크톱 레이아웃)                                   |
| 2025-01-15 | Phase 1 완료 (API 기반 + 팀 기능)                                  |
| 2025-01-15 | Phase 2 완료 (회의록 목록/상세 페이지)                             |
| 2025-12-12 | Phase 3 완료 (파일 업로드 + 회의록 생성)                           |
| 2025-12-12 | API 명세 동기화 (프로필 경로 변경, 토큰 경로 변경, 파일 제한 수정) |
