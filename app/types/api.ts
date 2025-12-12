// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  error: ApiError | null;
  data: T | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  gender: 'M' | 'F';
  birth_date: string;
  phone_number: string;
  team: TeamBasic | null;
  is_team_admin: boolean;
  created_at: string;
}

// Team Types
export interface TeamBasic {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeamSetting {
  id: number;
  openai_api_key_set: boolean;
  confluence_site_url: string | null;
  confluence_space_key: string | null;
  confluence_configured: boolean;
  slack_webhook_configured: boolean;
  slack_bot_configured: boolean;
  slack_default_channel: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamSettingUpdateRequest {
  openai_api_key?: string;
  confluence_site_url?: string;
  confluence_api_token?: string;
  confluence_user_email?: string;
  confluence_space_key?: string;
  confluence_parent_page_id?: string;
  slack_webhook_url?: string;
  slack_bot_token?: string;
  slack_default_channel?: string;
}

export interface TeamMember {
  id: number;
  username: string;
  email: string;
  is_team_admin: boolean;
}

// Meeting Types
export type MeetingStatus =
  | 'pending'
  | 'compressing'
  | 'transcribing'
  | 'correcting'
  | 'summarizing'
  | 'completed'
  | 'failed';

export const MEETING_STATUS_DISPLAY: Record<MeetingStatus, string> = {
  pending: '처리 대기',
  compressing: '압축 중...',
  transcribing: '음성 인식 중...',
  correcting: '텍스트 교정 중...',
  summarizing: '요약 생성 중...',
  completed: '완료',
  failed: '실패',
};

export interface MeetingListItem {
  id: number;
  title: string;
  meeting_date: string;
  status: MeetingStatus;
  status_display: string;
  has_audio: boolean;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface SpeakerData {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface SpeakerMapping {
  id: number | null;
  speaker_label: string;
  speaker_name: string;
  created_at: string | null;
}

export interface Meeting {
  id: number;
  title: string;
  meeting_date: string;
  audio_file_url: string | null;
  audio_file_expires_at: string | null;
  has_audio: boolean;
  transcript: string | null;
  speaker_data: SpeakerData[] | null;
  corrected_transcript: string | null;
  summary: string | null;
  status: MeetingStatus;
  status_display: string;
  error_message: string;
  confluence_page_id: string | null;
  confluence_page_url: string | null;
  slack_message_ts: string | null;
  slack_channel: string | null;
  speaker_mappings: SpeakerMapping[];
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingStatusResponse {
  id: number;
  status: MeetingStatus;
  status_display: string;
  error_message: string;
}

export interface CreateMeetingRequest {
  title: string;
  meeting_date: string;
}

export interface UpdateMeetingRequest {
  title?: string;
  meeting_date?: string;
  summary?: string;
  corrected_transcript?: string;
}

export interface UpdateSpeakersRequest {
  mappings: Array<{
    speaker_label: string;
    speaker_name: string;
  }>;
}

export interface MeetingSearchParams {
  q?: string;
  field?: 'all' | 'title' | 'transcript' | 'summary';
}

export interface MeetingSearchResult {
  id: number;
  title: string;
  meeting_date: string;
  summary_preview: string;
  transcript_preview: string;
  created_by_name: string;
  created_at: string;
}

export interface MeetingSearchResponse {
  results: MeetingSearchResult[];
  count: number;
  query: string;
  field: string;
}

export interface ConfluenceStatusResponse {
  uploaded: boolean;
  page_id: string | null;
  page_url: string | null;
}

export interface SlackStatusResponse {
  shared: boolean;
  message_ts: string | null;
  channel: string | null;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: User;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  gender: 'M' | 'F';
  birth_date: string;
  phone_number: string;
}

export interface SignupResponse {
  message: string;
  user_id: number;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// Profile Types
export interface UpdateProfileRequest {
  phone_number?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Error Codes
export const ERROR_CODES = {
  // 400 Bad Request
  BAD_REQUEST: '40000',
  INVALID_INPUT: '40001',
  PASSWORD_MISMATCH: '40002',

  // 401 Unauthorized
  AUTH_REQUIRED: '40100',
  INVALID_PASSWORD: '40101',
  ACCOUNT_INACTIVE: '40102',
  INVALID_TOKEN: '40103',
  TOKEN_EXPIRED: '40104',
  CURRENT_PASSWORD_MISMATCH: '40105',

  // 403 Forbidden
  FORBIDDEN: '40300',
  ACCESS_DENIED: '40301',

  // 404 Not Found
  NOT_FOUND: '40400',
  USER_NOT_FOUND: '40401',

  // 409 Conflict
  CONFLICT: '40900',
  EMAIL_DUPLICATE: '40901',
  USERNAME_DUPLICATE: '40902',

  // 422 Validation Error
  VALIDATION_ERROR: '42200',

  // 500 Server Error
  SERVER_ERROR: '50000',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.BAD_REQUEST]: '잘못된 요청입니다',
  [ERROR_CODES.INVALID_INPUT]: '입력값이 올바르지 않습니다',
  [ERROR_CODES.PASSWORD_MISMATCH]: '비밀번호가 일치하지 않습니다',
  [ERROR_CODES.AUTH_REQUIRED]: '로그인이 필요합니다',
  [ERROR_CODES.INVALID_PASSWORD]: '비밀번호가 올바르지 않습니다',
  [ERROR_CODES.ACCOUNT_INACTIVE]: '비활성화된 계정입니다',
  [ERROR_CODES.INVALID_TOKEN]: '유효하지 않은 토큰입니다',
  [ERROR_CODES.TOKEN_EXPIRED]: '토큰이 만료되었습니다',
  [ERROR_CODES.CURRENT_PASSWORD_MISMATCH]: '현재 비밀번호가 올바르지 않습니다',
  [ERROR_CODES.FORBIDDEN]: '권한이 없습니다',
  [ERROR_CODES.ACCESS_DENIED]: '접근이 거부되었습니다',
  [ERROR_CODES.NOT_FOUND]: '리소스를 찾을 수 없습니다',
  [ERROR_CODES.USER_NOT_FOUND]: '사용자를 찾을 수 없습니다',
  [ERROR_CODES.CONFLICT]: '리소스 충돌이 발생했습니다',
  [ERROR_CODES.EMAIL_DUPLICATE]: '이미 사용 중인 이메일입니다',
  [ERROR_CODES.USERNAME_DUPLICATE]: '이미 사용 중인 사용자명입니다',
  [ERROR_CODES.VALIDATION_ERROR]: '유효성 검사에 실패했습니다',
  [ERROR_CODES.SERVER_ERROR]: '서버 오류가 발생했습니다',
};
