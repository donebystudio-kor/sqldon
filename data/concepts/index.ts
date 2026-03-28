import type { Concept } from '@/types/concept';

export const CONCEPTS: Concept[] = [
  // ===== 기초 SQL =====
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
    tag: 'where',
    title: 'WHERE 조건',
    shortDefinition: 'FROM으로 지정한 테이블에서 조건에 맞는 행만 골라내는 필터링 절',
    whyImportant: 'WHERE가 없으면 테이블 전체를 읽습니다. 대용량 테이블에서 WHERE 없이 조회하면 불필요한 I/O가 발생하고, 인덱스도 활용할 수 없습니다. WHERE 조건이 인덱스를 탈 수 있는지가 SQL 성능의 핵심입니다.',
    commonMistakes: [
      'WHERE 절에 함수를 씌우면 인덱스를 무력화합니다. WHERE TO_CHAR(date_col) = \'2024\' 대신 WHERE date_col >= TO_DATE(\'2024-01-01\')으로 작성해야 인덱스를 탑니다.',
      'NULL은 = 로 비교할 수 없습니다. WHERE status = NULL은 항상 결과가 비어있습니다. IS NULL을 사용해야 합니다.',
      'AND와 OR을 혼합할 때 우선순위를 놓치면 의도와 다른 결과가 나옵니다. AND가 OR보다 먼저 평가되므로, 괄호를 명시하는 것이 안전합니다.',
    ],
    example: "SELECT name, salary FROM employees WHERE department_id = 10 AND salary > 5000;",
    relatedCategories: ['sql-basic'],
  },
  {
    tag: 'order-by',
    title: 'ORDER BY 정렬',
    shortDefinition: '조회 결과의 행 순서를 특정 컬럼 기준으로 정렬하는 절',
    whyImportant: 'ORDER BY가 없으면 SQL 결과의 순서는 보장되지 않습니다. 같은 쿼리를 두 번 실행해도 다른 순서로 나올 수 있습니다. 정렬은 추가 메모리와 CPU를 사용하므로, 불필요한 정렬은 성능에 영향을 줍니다.',
    commonMistakes: [
      '기본 정렬 방향은 ASC(오름차순)입니다. DESC를 써야 내림차순. 날짜를 최신 순으로 보려면 반드시 DESC를 명시해야 합니다.',
      'ORDER BY는 SQL 실행 순서에서 가장 마지막에 실행됩니다. SELECT에서 정의한 별칭(alias)을 ORDER BY에서 사용할 수 있는 이유가 이것입니다.',
      'NULL 값의 정렬 위치는 DB마다 다릅니다. 오라클은 ASC 시 NULL이 마지막, PostgreSQL은 NULL이 마지막. 명시적으로 NULLS FIRST/LAST를 쓰는 것이 안전합니다.',
    ],
    example: "SELECT name, salary FROM employees ORDER BY salary DESC, name ASC;",
    relatedCategories: ['sql-basic'],
  },
  {
    tag: 'distinct',
    title: 'DISTINCT 중복 제거',
    shortDefinition: 'SELECT 결과에서 완전히 동일한 행을 제거하고 고유한 행만 반환하는 키워드',
    whyImportant: '중복 데이터를 제거해야 할 때 사용합니다. 단, DISTINCT는 결과 전체를 정렬하거나 해시해야 하므로 대용량 데이터에서는 성능 비용이 큽니다. GROUP BY로 대체할 수 있는 경우가 많습니다.',
    commonMistakes: [
      'DISTINCT는 특정 컬럼 하나가 아닌 SELECT의 모든 컬럼 조합 기준으로 중복을 제거합니다. SELECT DISTINCT name, dept_id는 (name, dept_id) 쌍이 동일한 행만 제거합니다.',
      'COUNT(DISTINCT 컬럼)과 COUNT(컬럼)은 다릅니다. 전자는 고유 값 수, 후자는 NULL이 아닌 전체 행 수입니다.',
      'DISTINCT 남용은 보통 JOIN 조건이 잘못되어 중복 행이 생긴 것을 숨기는 경우가 많습니다. 중복의 원인을 먼저 확인하세요.',
    ],
    example: "SELECT DISTINCT department_id FROM employees;",
    relatedCategories: ['sql-basic'],
  },
  {
    tag: 'null-handling',
    title: 'NULL 처리',
    shortDefinition: 'SQL에서 NULL은 "값이 없음"을 의미하며, 일반적인 비교 연산과 다른 규칙이 적용된다',
    whyImportant: 'NULL은 0이 아니고, 빈 문자열도 아닙니다. NULL과의 모든 비교 연산은 UNKNOWN을 반환하므로, IS NULL/IS NOT NULL을 사용해야 합니다. 집계 함수는 NULL을 자동으로 제외하므로 COUNT(*)와 COUNT(컬럼)의 결과가 다를 수 있습니다.',
    commonMistakes: [
      'WHERE col = NULL은 항상 결과가 비어있습니다. NULL = NULL도 TRUE가 아니라 UNKNOWN입니다. 반드시 IS NULL을 사용하세요.',
      'AVG, SUM 등 집계 함수는 NULL을 무시합니다. 10, NULL, 30의 AVG는 (10+30)/2 = 20이지, (10+0+30)/3이 아닙니다.',
      'COALESCE(컬럼, 기본값)으로 NULL을 대체할 수 있습니다. NVL은 오라클 전용이고, IFNULL은 MySQL 전용이므로 표준인 COALESCE를 권장합니다.',
    ],
    example: "SELECT name, COALESCE(phone, '연락처 없음') AS phone FROM employees WHERE email IS NOT NULL;",
    relatedCategories: ['sql-basic'],
  },

  // ===== JOIN =====
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
    tag: 'inner-join',
    title: 'INNER JOIN',
    shortDefinition: '두 테이블에서 조인 조건을 만족하는 행만 반환하는 가장 기본적인 조인 방식',
    whyImportant: '양쪽 테이블 모두에 매칭되는 데이터만 필요할 때 사용합니다. 매칭되지 않는 행은 결과에서 완전히 제외되므로, 데이터 누락이 의도적인지 반드시 확인해야 합니다.',
    commonMistakes: [
      'INNER JOIN은 양쪽 모두 매칭되어야 반환됩니다. 한쪽에만 있는 데이터는 사라집니다. 신규 부서에 직원이 없으면 해당 부서는 결과에 나오지 않습니다.',
      'JOIN과 INNER JOIN은 동일합니다. INNER는 기본값이라 생략 가능하지만, 의도를 명확히 하기 위해 명시하는 것을 권장합니다.',
      'ON 절의 조건과 WHERE 절의 조건을 혼동하면 안 됩니다. ON은 조인 조건, WHERE는 결과 필터링입니다. INNER JOIN에서는 결과가 같지만 OUTER JOIN에서는 완전히 다릅니다.',
    ],
    example: "SELECT e.name, d.dept_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;",
    relatedCategories: ['sql-join'],
  },
  {
    tag: 'left-right-join',
    title: 'LEFT / RIGHT JOIN',
    shortDefinition: '한쪽 테이블의 모든 행을 보존하면서, 다른 쪽 테이블과 매칭되는 데이터를 조인하는 방식',
    whyImportant: '매칭 데이터가 없어도 기준 테이블의 행을 유지해야 할 때 필수입니다. 예: 주문이 없는 고객도 포함해야 할 때. LEFT JOIN을 잘못 사용하면 의도치 않게 INNER JOIN과 같은 결과가 나올 수 있습니다.',
    commonMistakes: [
      'LEFT JOIN 후 WHERE에서 오른쪽 테이블 컬럼을 조건으로 걸면 NULL 행이 제거되어 INNER JOIN과 같아집니다. 오른쪽 테이블 조건은 ON 절에 넣어야 LEFT JOIN 효과가 유지됩니다.',
      'LEFT JOIN과 RIGHT JOIN은 테이블 순서만 다릅니다. A LEFT JOIN B는 B RIGHT JOIN A와 동일합니다. 실무에서는 LEFT JOIN만 사용하는 것이 가독성에 좋습니다.',
      'LEFT JOIN 결과에서 오른쪽 테이블 컬럼은 NULL일 수 있습니다. 이 NULL을 처리하지 않으면 계산이나 표시에서 문제가 생깁니다. COALESCE를 활용하세요.',
    ],
    example: "SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.department_id = d.id;",
    relatedCategories: ['sql-join'],
  },

  // ===== 집계 =====
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
    tag: 'having',
    title: 'HAVING',
    shortDefinition: 'GROUP BY로 만든 그룹에 대해 조건을 적용하는 절. WHERE가 행을 필터링한다면, HAVING은 그룹을 필터링한다.',
    whyImportant: 'WHERE에서는 집계 함수(COUNT, SUM, AVG 등)를 사용할 수 없습니다. 그룹화된 결과에 조건을 걸려면 반드시 HAVING을 사용해야 합니다. SQL 실행 순서에서 GROUP BY 이후에 실행됩니다.',
    commonMistakes: [
      'WHERE에 집계 함수를 쓰면 오류가 발생합니다. WHERE COUNT(*) > 3은 안 되고, HAVING COUNT(*) > 3으로 써야 합니다.',
      'HAVING은 GROUP BY 없이도 사용 가능하지만, 이 경우 전체 테이블이 하나의 그룹이 됩니다. 실무에서는 거의 GROUP BY와 함께 씁니다.',
      'HAVING에서 SELECT 별칭을 사용할 수 있는지는 DB마다 다릅니다. 오라클은 불가, MySQL은 가능. 안전하게 집계 함수를 직접 쓰세요.',
    ],
    example: "SELECT department_id, COUNT(*) AS cnt FROM employees GROUP BY department_id HAVING COUNT(*) >= 3;",
    relatedCategories: ['sql-aggregate'],
  },

  // ===== 윈도우 함수 =====
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
    tag: 'partition-by',
    title: 'PARTITION BY',
    shortDefinition: '윈도우 함수에서 데이터를 그룹으로 나누는 키워드. GROUP BY와 달리 행을 합치지 않는다.',
    whyImportant: 'PARTITION BY가 없으면 윈도우 함수는 전체 데이터를 하나의 윈도우로 처리합니다. 부서별 순위, 카테고리별 누적합 등 그룹 내 계산이 필요할 때 반드시 지정해야 합니다.',
    commonMistakes: [
      'PARTITION BY를 생략하면 전체 데이터가 하나의 그룹이 됩니다. ROW_NUMBER() OVER(ORDER BY salary DESC)는 전체 직원 순위가 됩니다.',
      'PARTITION BY와 GROUP BY를 혼동하면 안 됩니다. PARTITION BY는 원본 행을 유지하고, GROUP BY는 행을 합칩니다.',
      'PARTITION BY에 여러 컬럼을 지정하면 해당 컬럼 조합별로 윈도우가 나뉩니다. 너무 세분화하면 의미가 없어질 수 있습니다.',
    ],
    example: "SELECT name, department_id, salary, SUM(salary) OVER(PARTITION BY department_id) AS dept_total FROM employees;",
    relatedCategories: ['sql-window'],
  },
  {
    tag: 'rank-row-number',
    title: 'RANK / ROW_NUMBER',
    shortDefinition: '윈도우 함수에서 행에 순위나 순번을 매기는 함수들. 동일 값 처리 방식이 다르다.',
    whyImportant: '순위 기반 조회(상위 N건, 부서별 1등 등)에 필수입니다. ROW_NUMBER, RANK, DENSE_RANK 세 함수의 차이를 정확히 이해해야 의도한 결과를 얻을 수 있습니다.',
    commonMistakes: [
      'ROW_NUMBER는 동일 값이어도 항상 고유한 번호를 부여합니다(1,2,3). RANK는 동일 값에 같은 순위를 주고 다음을 건너뜁니다(1,1,3). DENSE_RANK는 건너뛰지 않습니다(1,1,2).',
      'WHERE 절에서 직접 윈도우 함수를 쓸 수 없습니다. 서브쿼리나 CTE로 감싸서 필터링해야 합니다. WHERE ROW_NUMBER() OVER(...) = 1은 오류입니다.',
      'ORDER BY를 지정하지 않으면 순위의 기준이 없으므로 결과가 비결정적입니다. 반드시 ORDER BY를 포함하세요.',
    ],
    example: "SELECT name, salary, ROW_NUMBER() OVER(ORDER BY salary DESC) AS rn, RANK() OVER(ORDER BY salary DESC) AS rnk FROM employees;",
    relatedCategories: ['sql-window'],
  },

  // ===== 튜닝 =====
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
    tag: 'index-range-scan',
    title: 'Index Range Scan',
    shortDefinition: '인덱스에서 조건에 맞는 범위만 효율적으로 읽는 데이터 접근 방식. Full Table Scan의 대안.',
    whyImportant: 'WHERE 조건에 인덱스 컬럼이 포함되면 옵티마이저가 Index Range Scan을 선택할 수 있습니다. 전체 테이블을 읽지 않고 필요한 범위만 읽으므로 대용량 테이블에서 성능이 극적으로 개선됩니다.',
    commonMistakes: [
      '복합 인덱스(A, B, C)에서 선두 컬럼(A)이 WHERE 조건에 없으면 Index Range Scan이 불가합니다. B나 C만으로는 인덱스를 효과적으로 탈 수 없습니다.',
      'WHERE 조건에 함수를 씌우면 인덱스를 무력화합니다. WHERE UPPER(name) = \'KIM\' 대신 함수 기반 인덱스를 만들거나 조건을 변경해야 합니다.',
      'Index Range Scan 후 TABLE ACCESS BY INDEX ROWID로 테이블을 다시 읽는 비용이 있습니다. 대량 데이터를 읽으면 오히려 Full Table Scan이 빠를 수 있습니다.',
    ],
    example: "-- 실행계획에서 INDEX RANGE SCAN이 나타나면 인덱스가 효과적으로 활용된 것",
    relatedCategories: ['sql-tuning'],
  },

  // ===== 오라클 아키텍처 =====
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
    example: '-- SGA 구성: Database Buffer Cache + Shared Pool + Redo Log Buffer + Large Pool',
    relatedCategories: ['oracle-arch'],
  },
  {
    tag: 'pga',
    title: 'PGA (Program Global Area)',
    shortDefinition: '각 서버 프로세스가 독립적으로 사용하는 비공유 메모리 영역. 정렬, 해시 조인 등 작업 공간.',
    whyImportant: 'SQL의 정렬(ORDER BY, GROUP BY)이나 해시 조인은 PGA의 Sort Area, Hash Area에서 수행됩니다. PGA가 부족하면 디스크 임시 공간을 사용하게 되어 성능이 크게 저하됩니다.',
    commonMistakes: [
      'PGA는 SGA와 달리 각 프로세스 전용입니다. 접속 사용자 수가 늘어나면 PGA 총 사용량도 비례하여 증가합니다.',
      'PGA_AGGREGATE_TARGET을 너무 작게 설정하면 Disk Sort가 빈번해집니다. 실행계획에서 SORT ORDER BY가 보이면 PGA 크기를 확인하세요.',
      'PGA 안의 Sort Area가 부족하면 임시 테이블스페이스에 데이터를 기록하는 Disk Sort가 발생합니다. 이는 디스크 I/O를 유발하여 성능이 수배 저하됩니다.',
    ],
    example: "-- PGA 크기 확인: SHOW PARAMETER pga_aggregate_target",
    relatedCategories: ['oracle-arch'],
  },
  {
    tag: 'bg-processes',
    title: '백그라운드 프로세스',
    shortDefinition: '오라클 인스턴스가 실행되는 동안 뒤에서 자동으로 동작하는 시스템 프로세스들',
    whyImportant: '사용자의 데이터 변경을 디스크에 안전하게 기록하고, 장애 시 자동 복구를 수행하며, 비정상 세션을 정리합니다. 이 프로세스들이 멈추면 인스턴스 자체가 중단됩니다.',
    commonMistakes: [
      'DBWn(Database Writer)은 변경된 데이터를 디스크에 기록합니다. 커밋할 때 쓰는 것이 아니라, 특정 조건(체크포인트, 메모리 부족 등)에서 비동기로 기록합니다.',
      'LGWR(Log Writer)은 Redo Log Buffer를 Redo Log File에 기록합니다. 커밋 시 LGWR이 Redo를 먼저 기록해야 커밋이 완료됩니다. 이것이 "Write-Ahead Logging" 원리입니다.',
      'SMON(System Monitor)은 인스턴스 재시작 시 자동 복구를 수행합니다. PMON(Process Monitor)은 비정상 종료된 세션의 리소스를 정리합니다.',
    ],
    example: "-- 주요 프로세스: DBWn(데이터 기록), LGWR(로그 기록), CKPT(체크포인트), SMON(복구), PMON(정리)",
    relatedCategories: ['oracle-arch'],
  },
];

export function getConceptByTag(tag: string): Concept | undefined {
  return CONCEPTS.find(c => c.tag === tag);
}
