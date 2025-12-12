import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://192.168.230.104:8022/v1';

// Paths that should NOT have trailing slash
const NO_TRAILING_SLASH_PATHS = [
  'users/auth/login',
  'users/auth/signup',
  'users/auth/check-email',
  'users/auth/logout',
  'users/token/refresh',
  'users/profile/me',
  'users/profile/update',
  'users/profile/change-password',
];

// Path patterns that should NOT have trailing slash (regex)
const NO_TRAILING_SLASH_PATTERNS = [
  /^teams\/\d+\/settings$/,      // teams/{id}/settings
  /^teams\/\d+\/members$/,       // teams/{id}/members
  /^teams\/\d+\/members\/\d+\/admin$/, // teams/{id}/members/{user_id}/admin
];

function buildApiPath(path: string[]): string {
  const joinedPath = path.join('/');
  // Check if path matches any no-trailing-slash exact path
  if (NO_TRAILING_SLASH_PATHS.some((p) => joinedPath === p || joinedPath.startsWith(p + '/'))) {
    return joinedPath;
  }
  // Check if path matches any no-trailing-slash pattern (regex)
  if (NO_TRAILING_SLASH_PATTERNS.some((pattern) => pattern.test(joinedPath))) {
    return joinedPath;
  }
  // Add trailing slash for Django backend compatibility
  return joinedPath + '/';
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = buildApiPath(path);
  const fullUrl = `${API_BASE_URL}/${apiPath}`;
  const contentType = request.headers.get('content-type') || '';
  const authHeader = request.headers.get('Authorization');

  try {
    // multipart/form-data 처리 (파일 업로드)
    if (contentType.includes('multipart/form-data')) {
      console.log('[PROXY POST FormData]', fullUrl);

      const formData = await request.formData();
      const headers: Record<string, string> = {};

      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
      // Content-Type은 설정하지 않음 - fetch가 자동으로 boundary 포함하여 설정

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      console.log('[PROXY POST FormData Response]', response.status);
      return NextResponse.json(data, { status: response.status });
    }

    // JSON 처리 (기존 로직)
    const body = await request.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[PROXY POST Error]', error);
    return NextResponse.json(
      { success: false, error: { code: '50000', message: '서버에 연결할 수 없습니다' }, data: null },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = buildApiPath(path);
  const fullUrl = `${API_BASE_URL}/${apiPath}`;

  const authHeader = request.headers.get('Authorization');
  console.log('[PROXY GET]', fullUrl, 'Auth:', authHeader ? 'Bearer ***' : 'NONE');

  try {

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('[PROXY GET Response]', response.status, JSON.stringify(data).slice(0, 200));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: '50000', message: '서버에 연결할 수 없습니다' }, data: null },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = buildApiPath(path);

  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_BASE_URL}/${apiPath}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: '50000', message: '서버에 연결할 수 없습니다' }, data: null },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = buildApiPath(path);

  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_BASE_URL}/${apiPath}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: '50000', message: '서버에 연결할 수 없습니다' }, data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = buildApiPath(path);

  try {
    const authHeader = request.headers.get('Authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_BASE_URL}/${apiPath}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: '50000', message: '서버에 연결할 수 없습니다' }, data: null },
      { status: 500 }
    );
  }
}
