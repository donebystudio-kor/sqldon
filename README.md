# SQL던

SQL 문제풀이 + 실행계획 훈련 + 오라클 구조 학습 서비스

## 실행 방법

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 빌드

```bash
npm run build
npm start
```

## 폴더 구조

```
app/                  # App Router 페이지
  quiz/[category]/    # 카테고리별 문제풀이
  concept/[tag]/      # 개념 설명
  diagram/            # 오라클 아키텍처 다이어그램
  plan/               # 실행계획 학습 허브
  result/             # 복습/오답/북마크
components/
  layout/             # Header, Footer
  home/               # HomeStats, CategoryCard
  quiz/               # QuizShell, WriteCard, FillCard, OxCard, PlanCard, HintSteps
  shared/             # BookmarkButton
constants/            # categories, site
data/
  problems/           # 카테고리별 문제 데이터
  concepts/           # 개념 데이터
lib/                  # localStorage, write-checker, quiz-utils
types/                # TypeScript 타입 정의
```

## 문제 데이터 추가 방법

1. `data/problems/` 아래 해당 카테고리 파일에 문제 추가
2. `data/problems/index.ts`에서 import 확인
3. 문제 ID 규칙: `{카테고리약어}{타입약어}{번호}` (예: sbb01, sjf02)

## 카테고리 (7개)

| ID | 이름 | 설명 |
|----|------|------|
| sql-basic | 기초 SQL | SELECT/WHERE/ORDER BY/DISTINCT |
| sql-join | JOIN | INNER/LEFT/RIGHT/FULL/SELF/CROSS |
| sql-aggregate | 집계 | GROUP BY/HAVING/집계함수 |
| sql-subquery | 서브쿼리 | 단일행/다중행/상관/인라인뷰 |
| sql-window | 윈도우 함수 | ROW_NUMBER/RANK/LAG/LEAD |
| sql-tuning | 튜닝/실행계획 | 인덱스/Full Scan/Join 방식 |
| oracle-arch | 오라클 아키텍처 | SGA/PGA/Buffer Cache |

## 향후 확장 포인트

1. 문제 수 대폭 확대 (카테고리별 50~100개)
2. 실제 SQL 실행 환경 연동 (WebSQL 또는 서버 채점)
3. 사용자 계정 + 서버 기반 진행 저장
4. 다크모드
5. exam 모드 (시간제한 + 채점 결과표)
