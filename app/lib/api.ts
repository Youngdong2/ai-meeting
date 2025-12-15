import {
  ApiResponse,
  ApiError,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  CheckEmailRequest,
  CheckEmailResponse,
  RefreshTokenResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  User,
  ERROR_CODES,
  ERROR_MESSAGES,
  // Team types
  Team,
  TeamSetting,
  TeamSettingUpdateRequest,
  TeamMember,
  CreateTeamRequest,
  // Meeting types
  Meeting,
  MeetingListItem,
  MeetingStatusResponse,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  UpdateSpeakersRequest,
  SpeakerMapping,
  MeetingSearchParams,
  MeetingSearchResponse,
  ConfluenceStatusResponse,
  SlackStatusResponse,
} from '@/app/types/api';

// Use Next.js API proxy to avoid CORS issues
const API_BASE_URL = '/api/proxy';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken();
  },
};

// Error handling
const handleApiError = (error: ApiError): string => {
  return ERROR_MESSAGES[error.code] || error.message || '알 수 없는 오류가 발생했습니다';
};

// Base fetch wrapper
// Backend already returns {success, error, data} format, so we just pass it through
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result: ApiResponse<T> = await response.json();

    // Handle token expiration or invalid token (40100, 40103, 40104)
    const tokenErrorCodes: string[] = [ERROR_CODES.AUTH_REQUIRED, ERROR_CODES.INVALID_TOKEN, ERROR_CODES.TOKEN_EXPIRED];
    if (!result.success && result.error?.code && tokenErrorCodes.includes(result.error.code)) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the request with new token
        return fetchApi<T>(endpoint, options, requiresAuth);
      } else {
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return result;
  } catch {
    return {
      success: false,
      error: {
        code: ERROR_CODES.SERVER_ERROR,
        message: '서버에 연결할 수 없습니다',
      },
      data: null,
    };
  }
}

// Refresh access token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/users/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data: RefreshTokenResponse = await response.json();
    tokenManager.setTokens(data.access, data.refresh);
    return true;
  } catch {
    return false;
  }
}

// Auth API
export const authApi = {
  login: async (request: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await fetchApi<LoginResponse>('/users/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    if (response.success && response.data) {
      tokenManager.setTokens(response.data.tokens.access, response.data.tokens.refresh);
    }

    return response;
  },

  signup: async (request: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    return fetchApi<SignupResponse>('/users/auth/signup', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  checkEmail: async (request: CheckEmailRequest): Promise<ApiResponse<CheckEmailResponse>> => {
    return fetchApi<CheckEmailResponse>('/users/auth/check-email', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const refreshToken = tokenManager.getRefreshToken();
    const response = await fetchApi<{ message: string }>(
      '/users/auth/logout',
      {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      },
      true
    );

    tokenManager.clearTokens();
    return response;
  },

  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      return {
        success: false,
        error: { code: ERROR_CODES.INVALID_TOKEN, message: '리프레시 토큰이 없습니다' },
        data: null,
      };
    }

    const response = await fetchApi<RefreshTokenResponse>('/users/token/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.success && response.data) {
      tokenManager.setTokens(response.data.access, response.data.refresh);
    }

    return response;
  },
};

// Profile API
export const profileApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return fetchApi<User>('/users/profile/me', { method: 'GET' }, true);
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> => {
    return fetchApi<UpdateProfileResponse>(
      '/users/profile/update',
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
      true
    );
  },

  changePassword: async (request: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> => {
    return fetchApi<ChangePasswordResponse>(
      '/users/profile/change-password',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      true
    );
  },

  deleteAccount: async (): Promise<ApiResponse<{ message: string }>> => {
    return fetchApi<{ message: string }>('/users/profile/me', { method: 'DELETE' }, true);
  },
};

// Team API
export const teamApi = {
  // 팀 목록 조회
  list: async (): Promise<ApiResponse<Team[]>> => {
    return fetchApi<Team[]>('/teams/', { method: 'GET' }, true);
  },

  // 팀 생성
  create: async (request: CreateTeamRequest): Promise<ApiResponse<Team>> => {
    return fetchApi<Team>(
      '/teams/',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      true
    );
  },

  // 팀 상세 조회
  get: async (teamId: number): Promise<ApiResponse<Team>> => {
    return fetchApi<Team>(`/teams/${teamId}/`, { method: 'GET' }, true);
  },

  // 팀 설정 조회 (팀 관리자만)
  getSettings: async (teamId: number): Promise<ApiResponse<TeamSetting>> => {
    return fetchApi<TeamSetting>(`/teams/${teamId}/settings`, { method: 'GET' }, true);
  },

  // 팀 설정 수정 (팀 관리자만)
  updateSettings: async (
    teamId: number,
    request: TeamSettingUpdateRequest
  ): Promise<ApiResponse<TeamSetting>> => {
    return fetchApi<TeamSetting>(
      `/teams/${teamId}/settings/update`,
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
      true
    );
  },

  // 팀 멤버 목록 조회
  getMembers: async (teamId: number): Promise<ApiResponse<TeamMember[]>> => {
    return fetchApi<TeamMember[]>(`/teams/${teamId}/members`, { method: 'GET' }, true);
  },

  // 팀 관리자 권한 부여 (팀 관리자만)
  grantAdmin: async (teamId: number, userId: number): Promise<ApiResponse<{ message: string }>> => {
    return fetchApi<{ message: string }>(
      `/teams/${teamId}/members/${userId}/admin`,
      { method: 'POST' },
      true
    );
  },

  // 팀 관리자 권한 해제 (팀 관리자만)
  revokeAdmin: async (teamId: number, userId: number): Promise<ApiResponse<{ message: string }>> => {
    return fetchApi<{ message: string }>(
      `/teams/${teamId}/members/${userId}/admin`,
      { method: 'DELETE' },
      true
    );
  },
};

// Meeting API
export const meetingApi = {
  // 회의록 목록 조회
  list: async (): Promise<ApiResponse<MeetingListItem[]>> => {
    return fetchApi<MeetingListItem[]>('/meetings/', { method: 'GET' }, true);
  },

  // 회의록 상세 조회
  get: async (meetingId: number): Promise<ApiResponse<Meeting>> => {
    return fetchApi<Meeting>(`/meetings/${meetingId}/`, { method: 'GET' }, true);
  },

  // 회의록 생성 (JSON only)
  create: async (request: CreateMeetingRequest): Promise<ApiResponse<Meeting>> => {
    return fetchApi<Meeting>(
      '/meetings/',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      true
    );
  },

  // 회의록 생성 (파일 업로드 포함)
  createWithFile: async (
    title: string,
    meetingDate: string,
    audioFile?: File
  ): Promise<ApiResponse<Meeting>> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('meeting_date', meetingDate);
    if (audioFile) {
      formData.append('audio_file', audioFile);
    }

    const accessToken = tokenManager.getAccessToken();
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Content-Type은 설정하지 않음 - fetch가 자동으로 boundary 포함하여 설정

    try {
      const response = await fetch(`${API_BASE_URL}/meetings/`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result: ApiResponse<Meeting> = await response.json();

      // Handle token expiration
      if (!result.success && result.error?.code === ERROR_CODES.TOKEN_EXPIRED) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          return meetingApi.createWithFile(title, meetingDate, audioFile);
        } else {
          tokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }

      return result;
    } catch {
      return {
        success: false,
        error: {
          code: ERROR_CODES.SERVER_ERROR,
          message: '서버에 연결할 수 없습니다',
        },
        data: null,
      };
    }
  },

  // 회의록 수정
  update: async (meetingId: number, request: UpdateMeetingRequest): Promise<ApiResponse<Meeting>> => {
    return fetchApi<Meeting>(
      `/meetings/${meetingId}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
      true
    );
  },

  // 회의록 삭제
  delete: async (meetingId: number): Promise<ApiResponse<void>> => {
    return fetchApi<void>(`/meetings/${meetingId}/`, { method: 'DELETE' }, true);
  },

  // 처리 상태 조회 (폴링용)
  getStatus: async (meetingId: number): Promise<ApiResponse<MeetingStatusResponse>> => {
    return fetchApi<MeetingStatusResponse>(`/meetings/${meetingId}/status`, { method: 'GET' }, true);
  },

  // 화자 목록 조회
  getSpeakers: async (meetingId: number): Promise<ApiResponse<SpeakerMapping[]>> => {
    return fetchApi<SpeakerMapping[]>(`/meetings/${meetingId}/speakers`, { method: 'GET' }, true);
  },

  // 화자 이름 일괄 매핑
  updateSpeakers: async (
    meetingId: number,
    request: UpdateSpeakersRequest
  ): Promise<ApiResponse<SpeakerMapping[]>> => {
    return fetchApi<SpeakerMapping[]>(
      `/meetings/${meetingId}/speakers`,
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
      true
    );
  },

  // STT 수동 재실행
  transcribe: async (meetingId: number): Promise<ApiResponse<{ message: string; status: string }>> => {
    return fetchApi<{ message: string; status: string }>(
      `/meetings/${meetingId}/transcribe`,
      { method: 'POST' },
      true
    );
  },

  // 요약 수동 재생성
  summarize: async (meetingId: number): Promise<ApiResponse<{ message: string; status: string }>> => {
    return fetchApi<{ message: string; status: string }>(
      `/meetings/${meetingId}/summarize`,
      { method: 'POST' },
      true
    );
  },

  // 회의록 검색
  search: async (params: MeetingSearchParams): Promise<ApiResponse<MeetingSearchResponse>> => {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.append('q', params.q);
    if (params.field) queryParams.append('field', params.field);

    return fetchApi<MeetingSearchResponse>(
      `/meetings/search?${queryParams.toString()}`,
      { method: 'GET' },
      true
    );
  },

  // Confluence 업로드
  uploadToConfluence: async (meetingId: number): Promise<ApiResponse<{ message: string; confluence_page_url?: string }>> => {
    return fetchApi<{ message: string; confluence_page_url?: string }>(
      `/meetings/${meetingId}/confluence/upload`,
      { method: 'POST' },
      true
    );
  },

  // Confluence 상태 확인
  getConfluenceStatus: async (meetingId: number): Promise<ApiResponse<ConfluenceStatusResponse>> => {
    return fetchApi<ConfluenceStatusResponse>(
      `/meetings/${meetingId}/confluence/status`,
      { method: 'GET' },
      true
    );
  },

  // Slack 공유
  shareToSlack: async (
    meetingId: number,
    channel?: string
  ): Promise<ApiResponse<{ message: string }>> => {
    return fetchApi<{ message: string }>(
      `/meetings/${meetingId}/slack/share`,
      {
        method: 'POST',
        body: channel ? JSON.stringify({ channel }) : undefined,
      },
      true
    );
  },

  // Slack 상태 확인
  getSlackStatus: async (meetingId: number): Promise<ApiResponse<SlackStatusResponse>> => {
    return fetchApi<SlackStatusResponse>(
      `/meetings/${meetingId}/slack/status`,
      { method: 'GET' },
      true
    );
  },
};

// Export error handler for components
export { handleApiError };
