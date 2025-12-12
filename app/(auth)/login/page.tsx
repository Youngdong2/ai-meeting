'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrors((prev) => ({
        ...prev,
        submit: result.error || '로그인에 실패했습니다',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="text-[21px] font-semibold text-[var(--text-primary)]">
          AI Meeting
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="max-w-[400px] w-full mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-headline-2">로그인</h1>
            <p className="text-body text-[var(--text-secondary)]">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-[#ff3b30]/10 border border-[#ff3b30] rounded-xl">
                <p className="text-body text-[#ff3b30]">{errors.submit}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.email ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.email && <p className="text-caption text-[#ff3b30]">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호 입력"
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.password ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.password && <p className="text-caption text-[#ff3b30]">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link href="/forgot-password" className="link-apple text-body">
                비밀번호를 잊으셨나요?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-light)]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[var(--background)] text-caption text-[var(--text-tertiary)]">
                또는
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button className="w-full py-4 flex items-center justify-center gap-3 border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-body font-medium">Google로 계속하기</span>
            </button>

            <button className="w-full py-4 flex items-center justify-center gap-3 border border-[var(--border-light)] rounded-full hover:bg-[var(--background-secondary)] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-body font-medium">Apple로 계속하기</span>
            </button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-body text-[var(--text-secondary)]">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="link-apple">
              회원가입
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
