import type { Metadata } from 'next';
import Script from 'next/script';
import { SITE } from '@/constants/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | SQL 문제풀이 + 실행계획 훈련 + 오라클 구조 학습`,
    template: `%s | ${SITE.name}`,
  },
  description: 'SQL 문제풀이, 실행계획 분석, 오라클 아키텍처 학습. SELECT, JOIN, GROUP BY, 서브쿼리, 윈도우 함수까지 단계별 SQL 연습 사이트.',
  keywords: ['SQL 문제', 'SQL 연습', 'SQL 공부', 'SQL JOIN 문제', 'GROUP BY 문제', '실행계획 읽는법', '오라클 SGA 구조', 'SQL 튜닝', 'SQL 학습'],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} | SQL 문제풀이 + 실행계획 훈련`,
    description: 'SQL 문제를 직접 풀어보며 학습하는 무료 사이트. 기초 SQL부터 실행계획 분석까지.',
    url: SITE.url,
    siteName: SITE.name,
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {SITE.gaId && SITE.gaId !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
