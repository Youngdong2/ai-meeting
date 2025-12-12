# AI Meeting Frontend 개발 계획

## 프로젝트 개요

Django 백엔드 API와 연동하는 Next.js 16 프론트엔드 개발

## 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables (Apple 디자인 시스템)
- **State Management**: React Context
- **API**: REST API (Django 백엔드)

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

### Phase 3: 파일 업로드 + 회의록 생성

- [ ] 음성 파일 업로드 컴포넌트
- [ ] 드래그 앤 드롭 지원
- [ ] 업로드 진행률 표시
- [ ] 회의록 생성 폼
- [ ] 처리 상태 폴링 (SSE 또는 polling)

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
├── (main)/                    # 메인 레이아웃 (사이드바 포함)
│   ├── layout.tsx
│   ├── page.tsx               # 회의록 목록
│   ├── meetings/
│   │   └── [id]/page.tsx      # 회의록 상세
│   └── settings/
│       ├── team/page.tsx
│       └── profile/page.tsx
├── api/
│   └── proxy/[...path]/route.ts
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   ├── team/
│   │   ├── TeamSelector.tsx
│   │   └── CreateTeamModal.tsx
│   ├── meeting/              # (Phase 2에서 구현)
│   └── ui/                   # 공통 UI 컴포넌트
├── contexts/
│   ├── AuthContext.tsx
│   └── TeamContext.tsx
├── lib/
│   └── api.ts
└── types/
    └── api.ts
```

---

## API 엔드포인트 참조

### 인증

- `POST /users/auth/login` - 로그인
- `POST /users/auth/signup` - 회원가입
- `POST /users/auth/logout` - 로그아웃
- `POST /users/auth/token/refresh` - 토큰 갱신

### 팀

- `GET /teams/` - 팀 목록
- `POST /teams/` - 팀 생성
- `GET /teams/{id}/` - 팀 상세
- `GET /teams/{id}/settings` - 팀 설정 (관리자)
- `PATCH /teams/{id}/settings` - 팀 설정 수정 (관리자)

### 회의록

- `GET /meetings/` - 회의록 목록
- `POST /meetings/` - 회의록 생성
- `GET /meetings/{id}/` - 회의록 상세
- `PATCH /meetings/{id}/` - 회의록 수정
- `DELETE /meetings/{id}/` - 회의록 삭제
- `GET /meetings/{id}/status` - 처리 상태
- `POST /meetings/{id}/transcribe` - STT 재실행
- `POST /meetings/{id}/summarize` - 요약 재생성

---

## 알려진 이슈

### Django Trailing Slash

백엔드 API URL 일관성 문제:

- `/users/auth/*` 경로: trailing slash 없음
- `/teams/`, `/meetings/` 경로: trailing slash 필요

**해결**: `buildApiPath()` 함수에서 경로별로 처리

---

## 변경 이력

| 날짜       | 내용                                   |
| ---------- | -------------------------------------- |
| 2025-01-15 | Phase 0 완료 (데스크톱 레이아웃)       |
| 2025-01-15 | Phase 1 완료 (API 기반 + 팀 기능)      |
| 2025-01-15 | Phase 2 완료 (회의록 목록/상세 페이지) |
