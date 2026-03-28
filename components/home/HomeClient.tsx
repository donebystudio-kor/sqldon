'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProblemSummary {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  tags: string[];
}

interface CategoryWithData {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  order: number;
  color: string;
  problemCount: number;
  problems: ProblemSummary[];
}

interface Props {
  categories: CategoryWithData[];
}

const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  basic: { label: '기초', color: 'bg-emerald-50 text-emerald-700' },
  intermediate: { label: '중급', color: 'bg-amber-50 text-amber-700' },
  advanced: { label: '고급', color: 'bg-rose-50 text-rose-700' },
};

const TYPE_LABEL: Record<string, string> = {
  fill: '빈칸 채우기',
  ox: 'O/X',
  plan: '실행계획',
};

export default function HomeClient({ categories }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          SQL 실력을 키우는 가장 빠른 방법
        </h1>
        <p className="text-lg text-text-sub mb-10 max-w-2xl mx-auto leading-relaxed">
          빈칸 채우기로 SQL 문법을 익히고, 실행계획을 분석하고, 오라클 아키텍처를 탐험하세요.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/quiz/sql-basic"
            className="bg-primary text-white px-8 py-3.5 rounded-xl hover:bg-primary-hover active:scale-[0.97] transition-all font-semibold text-base shadow-sm shadow-primary/20"
          >
            기초부터 시작하기
          </Link>
          <Link
            href="/plan"
            className="bg-white text-text border border-border px-8 py-3.5 rounded-xl hover:border-primary hover:text-primary active:scale-[0.97] transition-all font-semibold text-base shadow-sm"
          >
            실행계획 학습
          </Link>
          <Link
            href="/diagram"
            className="bg-white text-text border border-border px-8 py-3.5 rounded-xl hover:border-primary hover:text-primary active:scale-[0.97] transition-all font-semibold text-base shadow-sm"
          >
            오라클 구조 보기
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">카테고리별 학습</h2>
            <p className="text-sm text-text-sub mt-1">카드를 클릭하면 문제 목록을 바로 확인할 수 있습니다</p>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map(cat => {
            const isOpen = openId === cat.id;
            return (
              <div key={cat.id}>
                {/* Card */}
                <button
                  onClick={() => toggle(cat.id)}
                  className={`w-full text-left bg-white border-2 rounded-2xl p-6 sm:p-8 transition-all hover:shadow-lg group ${
                    isOpen
                      ? 'border-primary shadow-lg shadow-primary/5'
                      : 'border-border hover:border-border-hover'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: cat.color + '15' }}
                    >
                      {cat.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: cat.color }}
                        >
                          {cat.problemCount}문제
                        </span>
                      </div>
                      <p className="text-text-sub text-sm leading-relaxed">{cat.shortDescription}</p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {cat.shortDescription.split(' / ').map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs bg-bg text-text-sub font-mono"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 pt-1">
                      <svg
                        className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Accordion Detail Panel */}
                <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                  <div className="accordion-inner">
                    <div className="bg-white border-2 border-t-0 border-primary rounded-b-2xl -mt-2 pt-6 pb-6 px-6 sm:px-8">
                      {/* Category description */}
                      <p className="text-sm text-text-sub mb-5 leading-relaxed">{cat.longDescription}</p>

                      {/* Problem list */}
                      <div className="space-y-2 mb-6">
                        {cat.problems.map((p, i) => {
                          const diff = DIFFICULTY_LABEL[p.difficulty] || { label: p.difficulty, color: '' };
                          return (
                            <Link
                              key={p.id}
                              href={`/quiz/${cat.id}/${p.id}`}
                              className="flex items-center justify-between bg-bg hover:bg-primary-light border border-border hover:border-primary/30 rounded-xl px-4 py-3.5 transition-all group/item"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs text-text-muted font-mono w-5 shrink-0">
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-sm font-medium truncate group-hover/item:text-primary transition-colors">
                                  {p.title}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${diff.color} shrink-0`}>
                                  {diff.label}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary-light text-primary shrink-0 hidden sm:inline">
                                  {TYPE_LABEL[p.type] || p.type}
                                </span>
                              </div>
                              <svg className="w-4 h-4 text-text-muted group-hover/item:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          );
                        })}
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/quiz/${cat.id}`}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover active:scale-[0.97] transition-all shadow-sm shadow-primary/20"
                      >
                        문제 시작하기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-16">
        <h2 className="text-2xl font-bold mb-6">빠른 학습</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/result#wrong"
            className="group bg-white border border-border rounded-2xl p-6 hover:border-rose-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="font-semibold mb-1 group-hover:text-rose-600 transition-colors">틀린 문제 다시 풀기</p>
            <p className="text-sm text-text-sub">오답 노트에서 복습하세요</p>
          </Link>
          <Link
            href="/result#bookmarks"
            className="group bg-white border border-border rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="font-semibold mb-1 group-hover:text-amber-600 transition-colors">북마크 문제</p>
            <p className="text-sm text-text-sub">저장한 문제를 복습하세요</p>
          </Link>
          <Link
            href="/quiz/sql-basic"
            className="group bg-white border border-border rounded-2xl p-6 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="font-semibold mb-1 group-hover:text-primary transition-colors">이어서 학습하기</p>
            <p className="text-sm text-text-sub">최근 카테고리로 바로 이동</p>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20">
        <div className="bg-white border border-border rounded-2xl p-8 sm:p-10">
          <h2 className="text-xl font-bold mb-6">SQL던의 학습 방식</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: '빈칸 채우기',
                desc: 'SQL 키워드를 직접 선택해서 채우는 퍼즐형 문제. 빈칸별로 맞은 부분은 유지하고 틀린 부분만 재시도할 수 있습니다.',
                icon: (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                ),
              },
              {
                title: '실행계획 분석',
                desc: 'Full Table Scan, Hash Join 등 실행계획의 핵심 개념을 예시와 함께 학습하고, 병목 지점을 찾는 훈련을 합니다.',
                icon: (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: '오라클 아키텍처',
                desc: 'SGA, PGA, 백그라운드 프로세스를 인터랙티브 다이어그램으로 탐험하며, SQL 실행 흐름과 연결해서 이해합니다.',
                icon: (
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
              },
            ].map(f => (
              <div key={f.title}>
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-text-sub leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
