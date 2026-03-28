import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">S</span>
              <span className="font-bold text-text">SQL던</span>
            </div>
            <p className="text-sm text-text-sub leading-relaxed">
              SQL 문제풀이와 실행계획 분석으로<br />데이터베이스 실력을 키우세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold text-text-sub uppercase tracking-wider mb-3">학습</p>
            <div className="space-y-2">
              <Link href="/quiz/sql-basic" className="block text-sm text-text-sub hover:text-primary transition-colors">문제풀이</Link>
              <Link href="/concept/select" className="block text-sm text-text-sub hover:text-primary transition-colors">개념 학습</Link>
              <Link href="/plan" className="block text-sm text-text-sub hover:text-primary transition-colors">실행계획</Link>
              <Link href="/diagram" className="block text-sm text-text-sub hover:text-primary transition-colors">오라클 아키텍처</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-text-sub uppercase tracking-wider mb-3">정보</p>
            <div className="space-y-2">
              <Link href="/result" className="block text-sm text-text-sub hover:text-primary transition-colors">학습 현황</Link>
              <Link href="/privacy" className="block text-sm text-text-sub hover:text-primary transition-colors">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">&copy; {new Date().getFullYear()} SQL던. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
