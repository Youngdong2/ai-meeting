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
  created_at: string;
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
