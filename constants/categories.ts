import type { CategoryId } from '@/types/problem';

export interface Category {
  id: CategoryId;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  order: number;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'sql-basic',
    name: '기초 SQL',
    shortDescription: 'SELECT / WHERE / ORDER BY / DISTINCT',
    longDescription: 'SQL의 기본 문법을 학습합니다. SELECT, WHERE, ORDER BY, DISTINCT 등 데이터 조회의 핵심을 다룹니다.',
    icon: '\uD83D\uDCDD',
    order: 1,
    color: '#3B82F6',
  },
  {
    id: 'sql-join',
    name: 'JOIN',
    shortDescription: 'INNER / LEFT / RIGHT / FULL / SELF / CROSS',
    longDescription: '테이블 간 결합의 모든 것. INNER JOIN부터 SELF JOIN까지 실무에서 자주 쓰는 패턴을 학습합니다.',
    icon: '\uD83D\uDD17',
    order: 2,
    color: '#8B5CF6',
  },
  {
    id: 'sql-aggregate',
    name: '집계',
    shortDescription: 'GROUP BY / HAVING / COUNT / SUM / AVG',
    longDescription: '데이터를 그룹화하고 집계하는 방법을 학습합니다. GROUP BY, HAVING, 집계 함수의 올바른 사용법을 다룹니다.',
    icon: '\uD83D\uDCCA',
    order: 3,
    color: '#10B981',
  },
  {
    id: 'sql-subquery',
    name: '서브쿼리',
    shortDescription: '단일행 / 다중행 / 상관 / 인라인뷰',
    longDescription: '쿼리 안의 쿼리. 서브쿼리의 종류와 사용 시점, 성능 고려사항을 학습합니다.',
    icon: '\uD83D\uDD04',
    order: 4,
    color: '#F59E0B',
  },
  {
    id: 'sql-window',
    name: '윈도우 함수',
    shortDescription: 'ROW_NUMBER / RANK / LAG / LEAD / SUM OVER',
    longDescription: '분석 함수의 꽃. PARTITION BY와 ORDER BY를 활용한 윈도우 함수를 학습합니다.',
    icon: '\uD83E\uDE9F',
    order: 5,
    color: '#EC4899',
  },
  {
    id: 'sql-tuning',
    name: '튜닝 / 실행계획',
    shortDescription: '인덱스 / Full Scan / Join 방식 / 병목',
    longDescription: 'SQL 성능을 좌우하는 실행계획 읽기와 튜닝 포인트를 학습합니다.',
    icon: '\u26A1',
    order: 6,
    color: '#EF4444',
  },
  {
    id: 'oracle-arch',
    name: '오라클 아키텍처',
    shortDescription: 'SGA / PGA / Buffer Cache / Shared Pool',
    longDescription: '오라클 데이터베이스의 내부 구조를 이해합니다. 메모리, 프로세스, 파일 구조를 학습합니다.',
    icon: '\uD83C\uDFDB\uFE0F',
    order: 7,
    color: '#6366F1',
  },
];
