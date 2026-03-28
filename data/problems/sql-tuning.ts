import type { OxProblem, PlanProblem, FillProblem } from '@/types/problem';

export const SQL_TUNING_PROBLEMS = [
  {
    id: 'sto01',
    category: 'sql-tuning',
    difficulty: 'intermediate',
    type: 'ox',
    availableModes: ['write', 'fill'] as const,
    title: 'Full Table Scan이 항상 나쁜가',
    question: 'Full Table Scan의 성능 영향을 올바르게 이해하고 있는지 확인합니다.',
    learningPoint: 'Full Table Scan이 오히려 효율적인 경우도 있다',
    tags: ['Full Table Scan', '인덱스'],
    explanation: '소량 데이터 테이블이나 대부분의 행을 읽어야 하는 경우, Full Table Scan이 인덱스 스캔보다 효율적일 수 있습니다. 인덱스 스캔은 랜덤 I/O가 발생하지만, Full Table Scan은 순차 I/O(Multi-Block Read)를 사용합니다.',
    relatedConceptTags: ['full-table-scan'],
    statement: 'Full Table Scan은 항상 인덱스 스캔보다 느리므로 반드시 인덱스를 사용해야 한다.',
    answer: 'X',
    hints: {
      directional: ['Full Table Scan이 효율적인 경우가 있는지 생각해보세요'],
      misconception: ['소량 데이터나 전체 조회 시에는 Full Table Scan이 인덱스 스캔보다 빠를 수 있습니다'],
    },
  } as OxProblem,
  {
    id: 'stp01',
    category: 'sql-tuning',
    difficulty: 'intermediate',
    type: 'plan',
    availableModes: ['write', 'fill'] as const,
    title: 'Full Table Scan 병목 찾기',
    question: '아래 실행계획에서 가장 큰 병목이 되는 단계는?',
    learningPoint: 'Full Table Scan이 대량 테이블에서 성능 병목이 되는 이유',
    tags: ['실행계획', 'Full Table Scan'],
    explanation: 'TABLE ACCESS FULL은 전체 테이블을 읽으므로 대량 데이터에서 병목. 인덱스 활용을 고려해야 합니다.',
    relatedConceptTags: ['full-table-scan'],
    planText: `--------------------------------------------------------------
| Id  | Operation          | Name       | Rows  | Cost (%CPU)|
--------------------------------------------------------------
|   0 | SELECT STATEMENT   |            |  1000 |   450  (2)|
|*  1 |  TABLE ACCESS FULL | EMPLOYEES  |  1000 |   450  (2)|
--------------------------------------------------------------`,
    choices: ['SELECT STATEMENT', 'TABLE ACCESS FULL'],
    choiceExplanations: [
      { value: 'SELECT STATEMENT', explanation: '최상위 실행 노드로, 실제 작업을 수행하는 단계가 아닙니다. 하위 단계의 비용을 합산한 것입니다' },
      { value: 'TABLE ACCESS FULL', explanation: '테이블 전체를 순차적으로 읽습니다. 1000행을 모두 스캔하며 Cost 450으로 가장 큰 병목입니다' },
    ],
    correctAnswer: 'TABLE ACCESS FULL',
    hints: {
      directional: ['FULL이라는 키워드에 주목하세요'],
      constraint: ['비용(Cost)이 가장 높은 실제 작업 단계를 찾으세요'],
      misconception: ['SELECT STATEMENT는 최상위 노드일 뿐, 실제 병목 원인은 하위 단계입니다'],
    },
  } as PlanProblem,
  {
    id: 'stf01',
    category: 'sql-tuning',
    difficulty: 'intermediate',
    type: 'fill',
    availableModes: ['fill'] as const,
    title: '인덱스 활용 빈칸 채우기',
    question: '아래 설명의 빈칸을 채우세요. 복합 인덱스(A, B, C)가 있을 때, WHERE 조건이 ___ 컬럼부터 순서대로 사용해야 인덱스를 효율적으로 활용할 수 있다.',
    learningPoint: '복합 인덱스의 선두 컬럼 규칙',
    tags: ['인덱스', '복합 인덱스'],
    explanation: '복합 인덱스는 정의된 컬럼 순서가 중요합니다. 선두 컬럼(A)부터 사용해야 인덱스 Range Scan이 가능합니다. B나 C만 사용하면 인덱스를 타지 못하거나 Skip Scan이 발생합니다.',
    relatedConceptTags: ['full-table-scan'],
    sqlTemplate: '복합 인덱스(A, B, C)에서 효율적 활용을 위해 ___ 컬럼을 WHERE 조건에 반드시 포함해야 한다.',
    blanks: 1,
    options: ['선두(A)', '마지막(C)', '중간(B)', '아무거나'],
    optionExplanations: [
      { value: '선두(A)', explanation: '복합 인덱스는 정의 순서대로 정렬됩니다. 선두 컬럼부터 사용해야 Range Scan이 가능합니다' },
      { value: '마지막(C)', explanation: 'C만 사용하면 인덱스를 효율적으로 탈 수 없습니다. 선두 컬럼이 빠져있기 때문입니다' },
      { value: '중간(B)', explanation: 'B만 사용해도 선두 컬럼(A)이 없으므로 인덱스 Range Scan이 불가합니다' },
      { value: '아무거나', explanation: '인덱스 컬럼 순서는 매우 중요합니다. 아무 컬럼이나 사용해서는 효율적 활용이 안 됩니다' },
    ],
    correctAnswers: ['선두(A)'],
    hints: {
      directional: ['인덱스 컬럼 순서의 중요성을 생각해보세요'],
      misconception: ['복합 인덱스는 아무 컬럼이나 사용해도 되는 것이 아닙니다. 순서가 중요합니다'],
    },
  } as FillProblem,
];
