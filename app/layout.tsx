import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header, Sidebar } from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import { TeamProvider } from './contexts/TeamContext';
import { MeetingProvider } from './contexts/MeetingContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Meeting - 회의록 요약 서비스',
  description: 'AI가 자동으로 회의 내용을 요약해드립니다',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <TeamProvider>
            <MeetingProvider>
              <Header />
              <Sidebar />
              <main className="ml-60 pt-14 min-h-screen bg-[var(--background)]">
                <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
              </main>
            </MeetingProvider>
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
