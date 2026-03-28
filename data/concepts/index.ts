import type { Concept } from '@/types/concept';

export const CONCEPTS: Concept[] = [
  {
    tag: 'select',
    title: 'SELECT 문',
    shortDefinition: '데이터베이스에서 데이터를 조회하는 가장 기본적인 SQL 명령어',
    whyImportant: '모든 SQL 작업의 시작점. SELECT를 정확히 이해해야 복잡한 쿼리도 작성할 수 있습니다.',
    commonMistakes: [
      'SELECT *를 습관적으로 사용하면 불필요한 컬럼까지 조회되어 성능 저하',
      'WHERE 절 없이 대용량 테이블 조회 시 전체 스캔 발생',
      'ORDER BY를 잊으면 결과 순서가 보장되지 않음',
    ],
    example: 'SELECT name, salary FROM employees WHERE department_id = 10;',
    relatedCategories: ['sql-basic'],
  },
  {
    tag: 'join',
    title: 'JOIN (테이블 결합)',
    shortDefinition: '두 개 이상의 테이블을 특정 조건으로 연결하여 데이터를 조회하는 방법',
    whyImportant: '실무 데이터는 여러 테이블에 분산되어 있으므로, JOIN 없이는 의미 있는 데이터 조회가 불가능합니다.',
    commonMistakes: [
      'ON 절 없이 JOIN하면 카테시안 곱(CROSS JOIN)이 발생하여 행이 폭증',
      'LEFT JOIN 후 WHERE에서 오른쪽 테이블 조건을 걸면 INNER JOIN과 같아짐',
      'SELF JOIN이 필요한 상황에서 서브쿼리를 남용하여 성능 저하',
    ],
    example: 'SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;',
    relatedCategories: ['sql-join'],
  },
  {
    tag: 'group-by',
    title: 'GROUP BY (그룹화)',
    shortDefinition: '특정 컬럼 기준으로 행을 그룹화하고 집계 함수를 적용하는 절',
    whyImportant: '데이터 분석과 리포트 작성의 핵심. 부서별 합계, 월별 매출 등 그룹 단위 통계에 필수입니다.',
    commonMistakes: [
      'SELECT에 집계 함수와 일반 컬럼을 혼용할 때 GROUP BY에 일반 컬럼을 빠뜨림',
      'WHERE와 HAVING을 혼동하여 그룹 조건을 WHERE에 작성',
      'GROUP BY 컬럼과 SELECT 컬럼의 불일치로 에러 발생',
    ],
    example: 'SELECT department_id, COUNT(*), AVG(salary) FROM employees GROUP BY department_id HAVING COUNT(*) >= 3;',
    relatedCategories: ['sql-aggregate'],
  },
  {
    tag: 'window-function',
    title: '윈도우 함수 (분석 함수)',
    shortDefinition: '행을 그룹화하지 않고도 그룹 단위 연산을 수행할 수 있는 고급 SQL 함수',
    whyImportant: 'GROUP BY는 행을 합치지만, 윈도우 함수는 원본 행을 유지하면서 순위, 누적합, 이전/다음 값 비교 등이 가능합니다.',
    commonMistakes: [
      'PARTITION BY를 빠뜨려 전체 데이터에 대해 연산이 적용됨',
      'ROW_NUMBER, RANK, DENSE_RANK의 차이를 혼동',
      'WHERE 절에서 윈도우 함수를 직접 사용하려고 시도 (서브쿼리로 감싸야 함)',
    ],
    example: 'SELECT name, salary, RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rnk FROM employees;',
    relatedCategories: ['sql-window'],
  },
  {
    tag: 'full-table-scan',
    title: 'Full Table Scan (전체 테이블 스캔)',
    shortDefinition: '테이블의 모든 데이터 블록을 순차적으로 읽는 데이터 접근 방식',
    whyImportant: '실행계획에서 가장 자주 보이는 병목 원인. 인덱스 설계와 SQL 튜닝의 시작점입니다.',
    commonMistakes: [
      'Full Table Scan이 항상 나쁘다고 단정 (소량 데이터에서는 오히려 효율적)',
      'WHERE 절에 함수를 씌워 인덱스를 무력화 (예: WHERE TO_CHAR(date_col) = ...)',
      '인덱스가 있는데도 통계정보 미갱신으로 옵티마이저가 Full Scan 선택',
    ],
    example: '-- 실행계획에서 TABLE ACCESS FULL이 나타나면 인덱스 활용 여부를 점검',
    relatedCategories: ['sql-tuning'],
  },
  {
    tag: 'sga',
    title: 'SGA (System Global Area)',
    shortDefinition: '오라클 인스턴스의 모든 서버 프로세스가 공유하는 메모리 영역',
    whyImportant: 'Database Buffer Cache, Shared Pool, Redo Log Buffer 등 핵심 메모리 구조를 포함하며, 오라클 성능의 근간입니다.',
    commonMistakes: [
      'SGA와 PGA를 혼동하여 메모리 할당 문제 진단 실패',
      'Shared Pool 크기가 부족하면 Hard Parse가 빈번해져 성능 저하',
      'Buffer Cache Hit Ratio만으로 성능을 판단하려는 오류',
    ],
    example: '-- SGA 구성: Database Buffer Cache + Shared Pool + Redo Log Buffer + Large Pool + Java Pool + Streams Pool',
    relatedCategories: ['oracle-arch'],
  },
];

export function getConceptByTag(tag: string): Concept | undefined {
  return CONCEPTS.find(c => c.tag === tag);
}
