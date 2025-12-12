'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/app/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '' as 'M' | 'F' | '',
    birthDate: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 이메일 변경시 중복체크 초기화
    if (name === 'email') {
      setEmailChecked(false);
      setEmailAvailable(false);
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const checkEmailDuplicate = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요' }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: '올바른 이메일 형식이 아닙니다' }));
      return;
    }

    setIsCheckingEmail(true);
    const response = await authApi.checkEmail({ email: formData.email });
    setIsCheckingEmail(false);

    if (response.success) {
      setEmailChecked(true);
      setEmailAvailable(true);
      setErrors((prev) => ({ ...prev, email: '' }));
    } else {
      setEmailChecked(true);
      setEmailAvailable(false);
      setErrors((prev) => ({ ...prev, email: response.error?.message || '이미 사용 중인 이메일입니다' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    } else if (!emailChecked || !emailAvailable) {
      newErrors.email = '이메일 중복 확인을 해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '휴대폰 번호를 입력해주세요';
    } else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const response = await authApi.signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      gender: formData.gender as 'M' | 'F',
      birth_date: formData.birthDate,
      phone_number: formData.phone.replace(/-/g, ''),
    });

    setIsLoading(false);

    if (response.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    } else {
      setErrors((prev) => ({
        ...prev,
        submit: response.error?.message || '회원가입에 실패했습니다',
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
            <h1 className="text-headline-2">회원가입</h1>
            <p className="text-body text-[var(--text-secondary)]">AI Meeting을 시작하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-[#ff3b30]/10 border border-[#ff3b30] rounded-xl">
                <p className="text-body text-[#ff3b30]">{errors.submit}</p>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                이름
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="홍길동"
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.username ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.username && <p className="text-caption text-[#ff3b30]">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                이메일 (아이디)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`flex-1 px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                    errors.email
                      ? 'border-[#ff3b30]'
                      : emailChecked && emailAvailable
                        ? 'border-[#34c759]'
                        : 'border-[var(--border-light)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={checkEmailDuplicate}
                  disabled={isCheckingEmail}
                  className="px-4 py-3 text-[var(--link)] text-body font-medium border border-[var(--border-light)] rounded-xl hover:bg-[var(--background-secondary)] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingEmail ? '확인 중...' : '중복확인'}
                </button>
              </div>
              {errors.email && <p className="text-caption text-[#ff3b30]">{errors.email}</p>}
              {emailChecked && emailAvailable && (
                <p className="text-caption text-[#34c759]">사용 가능한 이메일입니다</p>
              )}
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
                placeholder="8자 이상 입력"
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.password ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.password && <p className="text-caption text-[#ff3b30]">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.confirmPassword ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-caption text-[#ff3b30]">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide">
                성별
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'M' }))}
                  className={`flex-1 py-3 text-body font-medium rounded-xl border transition-colors ${
                    formData.gender === 'M'
                      ? 'bg-[var(--link)] text-white border-[var(--link)]'
                      : 'border-[var(--border-light)] hover:bg-[var(--background-secondary)]'
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'F' }))}
                  className={`flex-1 py-3 text-body font-medium rounded-xl border transition-colors ${
                    formData.gender === 'F'
                      ? 'bg-[var(--link)] text-white border-[var(--link)]'
                      : 'border-[var(--border-light)] hover:bg-[var(--background-secondary)]'
                  }`}
                >
                  여성
                </button>
              </div>
              {errors.gender && <p className="text-caption text-[#ff3b30]">{errors.gender}</p>}
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label
                htmlFor="birthDate"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                생년월일
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.birthDate ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.birthDate && (
                <p className="text-caption text-[#ff3b30]">{errors.birthDate}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-caption text-[var(--text-tertiary)] uppercase tracking-wide"
              >
                휴대폰 번호
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                maxLength={13}
                className={`w-full px-4 py-3 bg-[var(--background)] border rounded-xl text-body placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link)] ${
                  errors.phone ? 'border-[#ff3b30]' : 'border-[var(--border-light)]'
                }`}
              />
              {errors.phone && <p className="text-caption text-[#ff3b30]">{errors.phone}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[var(--link)] text-white text-body font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '가입 중...' : '가입하기'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-body text-[var(--text-secondary)]">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="link-apple">
              로그인
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
