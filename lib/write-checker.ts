// MVP 수준의 제한적 채점. 향후 교체 가능하도록 분리.
export function checkWriteAnswer(userAnswer: string, acceptableAnswers: string[]): boolean {
  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/;$/, '').trim();
  const normalized = normalize(userAnswer);
  return acceptableAnswers.some(a => normalize(a) === normalized);
}
