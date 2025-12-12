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

    // Handle token expiration
    if (!result.success && result.error?.code === ERROR_CODES.TOKEN_EXPIRED) {
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
    const response = await fetch(`${API_BASE_URL}/users/auth/token/refresh`, {
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

    const response = await fetchApi<RefreshTokenResponse>('/users/auth/token/refresh', {
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
    return fetchApi<User>('/users/profile', { method: 'GET' }, true);
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> => {
    return fetchApi<UpdateProfileResponse>(
      '/users/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(request),
      },
      true
    );
  },

  changePassword: async (request: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse>> => {
    return fetchApi<ChangePasswordResponse>(
      '/users/profile/password',
      {
        method: 'PUT',
        body: JSON.stringify(request),
      },
      true
    );
  },

  deleteAccount: async (): Promise<ApiResponse<{ message: string }>> => {
    return fetchApi<{ message: string }>('/users/profile', { method: 'DELETE' }, true);
  },
};

// Export error handler for components
export { handleApiError };
