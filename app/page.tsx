import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { ALL_PROBLEMS } from '@/data/problems';
import { getStats } from '@/lib/quiz-utils';
import HomeStats from '@/components/home/HomeStats';
import CategoryCard from '@/components/home/CategoryCard';

export default function HomePage() {
  const totalStats = getStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">SQL</span>던
        </h1>
        <p className="text-lg text-text-sub mb-8 max-w-2xl mx-auto">
          SQL 문제풀이 + 실행계획 훈련 + 오라클 구조 학습
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/quiz/sql-basic"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            바로 학습 시작
          </Link>
          <Link
            href="/diagram"
            className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary-light transition-colors font-medium"
          >
            오라클 구조 보기
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <HomeStats />
      </section>

      {/* Category Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">카테고리별 문제풀이</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              problemCount={ALL_PROBLEMS.filter(p => p.category === cat.id).length}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">추천 학습</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/quiz/sql-basic"
            className="bg-surface border border-border rounded-lg p-5 hover:border-primary transition-all"
          >
            <p className="font-medium mb-1">처음부터 시작하기</p>
            <p className="text-sm text-text-sub">기초 SQL부터 차근차근</p>
          </Link>
          <Link
            href="/result"
            className="bg-surface border border-border rounded-lg p-5 hover:border-primary transition-all"
          >
            <p className="font-medium mb-1">북마크 보러가기</p>
            <p className="text-sm text-text-sub">저장한 문제 복습</p>
          </Link>
          <Link
            href="/result"
            className="bg-surface border border-border rounded-lg p-5 hover:border-primary transition-all"
          >
            <p className="font-medium mb-1">틀린 문제 다시풀기</p>
            <p className="text-sm text-text-sub">오답 노트 확인</p>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">SQL던의 특징</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '✍️', title: '직접 작성형', desc: 'SQL을 직접 작성하고 채점받는 실전 훈련' },
            { icon: '🧩', title: '빈칸 채우기', desc: '핵심 키워드를 골라 넣는 퍼즐형 문제' },
            { icon: '⚡', title: '실행계획 훈련', desc: '실행계획을 읽고 병목을 찾는 분석 훈련' },
            { icon: '🏛️', title: '오라클 아키텍처', desc: 'SGA/PGA 구조를 인터랙티브하게 학습' },
          ].map(f => (
            <div key={f.title} className="bg-surface border border-border rounded-lg p-5">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold mt-2 mb-1">{f.title}</h3>
              <p className="text-sm text-text-sub">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
