import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import CategoryCard from '@/components/home/CategoryCard';

const PRIMARY_CATEGORIES = ['sql-basic', 'sql-join', 'sql-aggregate'];

export default function HomePage() {
  const primaryCats = CATEGORIES.filter(c => PRIMARY_CATEGORIES.includes(c.id));
  const secondaryCats = CATEGORIES.filter(c => !PRIMARY_CATEGORIES.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">SQL</span>던
        </h1>
        <p className="text-lg text-text-sub mb-8 max-w-xl mx-auto">
          빈칸 채우기로 SQL을 익히고, 실행계획을 분석하고, 오라클 구조를 탐험하세요.
        </p>

        {/* Primary CTA */}
        <div className="flex justify-center gap-3 mb-4">
          <Link
            href="/quiz/sql-basic"
            className="bg-primary text-white px-7 py-3.5 rounded-xl hover:bg-primary-hover active:scale-95 transition-all font-semibold text-base shadow-sm"
          >
            기초부터 시작
          </Link>
          <Link
            href="/quiz/sql-basic"
            className="border-2 border-primary text-primary px-7 py-3.5 rounded-xl hover:bg-primary-light active:scale-95 transition-all font-semibold text-base"
          >
            문제 풀기
          </Link>
        </div>

        {/* Secondary CTA */}
        <div className="flex justify-center gap-3">
          <Link
            href="/plan"
            className="border border-border text-text-sub px-5 py-2.5 rounded-lg hover:border-primary hover:text-primary active:scale-95 transition-all text-sm font-medium"
          >
            실행계획 연습
          </Link>
          <Link
            href="/diagram"
            className="border border-border text-text-sub px-5 py-2.5 rounded-lg hover:border-primary hover:text-primary active:scale-95 transition-all text-sm font-medium"
          >
            오라클 구조 보기
          </Link>
        </div>
      </section>

      {/* Primary Categories (강조) */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">핵심 카테고리</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {primaryCats.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              problemCount={ALL_PROBLEMS.filter(p => p.category === cat.id && p.type !== 'write').length}
              highlight
            />
          ))}
        </div>
      </section>

      {/* Secondary Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">심화 카테고리</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryCats.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              problemCount={ALL_PROBLEMS.filter(p => p.category === cat.id && p.type !== 'write').length}
            />
          ))}
        </div>
      </section>

      {/* Recommended Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">추천 학습</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/result#wrong"
            className="group bg-white border-2 border-border rounded-xl p-6 hover:border-error hover:shadow-md active:scale-[0.98] transition-all"
          >
            <span className="text-2xl block mb-3">📝</span>
            <p className="font-semibold mb-1 group-hover:text-error transition-colors">틀린 문제 다시 풀기</p>
            <p className="text-sm text-text-sub">오답 노트에서 복습하세요</p>
          </Link>
          <Link
            href="/result#bookmarks"
            className="group bg-white border-2 border-border rounded-xl p-6 hover:border-warning hover:shadow-md active:scale-[0.98] transition-all"
          >
            <span className="text-2xl block mb-3">⭐</span>
            <p className="font-semibold mb-1 group-hover:text-warning transition-colors">북마크 문제 보기</p>
            <p className="text-sm text-text-sub">저장한 문제를 복습하세요</p>
          </Link>
          <Link
            href="/quiz/sql-basic"
            className="group bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-md active:scale-[0.98] transition-all"
          >
            <span className="text-2xl block mb-3">🚀</span>
            <p className="font-semibold mb-1 group-hover:text-primary transition-colors">이어서 학습하기</p>
            <p className="text-sm text-text-sub">최근 카테고리로 바로 이동</p>
          </Link>
        </div>
      </section>

    </div>
  );
}
