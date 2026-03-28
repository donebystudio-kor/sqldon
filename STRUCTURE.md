# SQL던 프로젝트 구조 정의

## 기술 스택
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (@theme inline)

## 폴더 구조

### app/ - 페이지
- `layout.tsx` - 공통 레이아웃 (Header/Footer, GA, 메타)
- `page.tsx` - 홈 (Hero, 통계, 카테고리, 추천학습)
- `quiz/[category]/page.tsx` - 문제풀이 (7개 카테고리)
- `concept/[tag]/page.tsx` - 개념 설명 (6개 태그)
- `diagram/page.tsx` - 오라클 아키텍처 다이어그램
- `plan/page.tsx` - 실행계획 학습 허브
- `result/page.tsx` - 복습/오답/북마크
- `privacy/page.tsx` - 개인정보처리방침
- `sitemap.ts` / `robots.ts` - SEO

### components/ - UI 컴포넌트
- `layout/` - Header, Footer
- `home/` - HomeStats (클라이언트), CategoryCard
- `quiz/` - QuizShell, WriteCard, FillCard, OxCard, PlanCard, HintSteps
- `shared/` - BookmarkButton

### data/ - 콘텐츠 데이터
- `problems/` - 카테고리별 문제 파일 (7개 + index)
- `concepts/` - 개념 데이터

### types/ - 타입 정의
- `problem.ts` - Problem, WriteProblem, FillProblem, OxProblem, PlanProblem
- `concept.ts` - Concept

### constants/ - 상수
- `categories.ts` - 7개 카테고리 정의
- `site.ts` - 사이트 메타 정보

### lib/ - 유틸리티
- `local-storage.ts` - localStorage 래퍼
- `write-checker.ts` - SQL 작성 채점 (MVP)
- `quiz-utils.ts` - 문제 필터링/통계

## 문제 데이터 구조

### 문제 타입 4가지
| 타입 | 설명 | 주요 필드 |
|------|------|----------|
| write | SQL 직접 작성 | schema, acceptableAnswers, hints |
| fill | 빈칸 채우기 | sqlTemplate, blanks, options, correctAnswers |
| ox | O/X 판별 | statement, answer |
| plan | 실행계획 분석 | planText, choices, correctAnswer |

### 문제 ID 규칙
- `{카테고리}{타입}{난이도}{번호}`
- 카테고리: sb(basic), sj(join), sa(aggregate), ss(subquery), sw(window), st(tuning), oa(oracle-arch)
- 타입: b(write), f(fill), o(ox), p(plan)
- 예: sbb01 = sql-basic write 01

### 난이도
- basic / intermediate / advanced

## localStorage 키
| 키 | 타입 | 설명 |
|----|------|------|
| sqldon.progress | Record<string, boolean> | 문제별 정답 여부 |
| sqldon.wrongAnswers | string[] | 오답 문제 ID 목록 |
| sqldon.bookmarks | string[] | 북마크 문제 ID 목록 |
| sqldon.recentCategory | string | 마지막 학습 카테고리 |

## 확장 포인트
1. 문제 데이터: 카테고리별 파일에 추가만 하면 자동 반영
2. 채점 로직: lib/write-checker.ts 교체 가능
3. 풀이 모드: practice/exam/review 구조 확장 가능
4. 개념 태그: data/concepts/에 추가
5. 서버 연동: localStorage → API 교체 시 lib/local-storage.ts만 수정
