import type { Metadata } from 'next';
import QuizSetup from './QuizSetup';

export const metadata: Metadata = {
  title: '문제 풀기 | 카테고리 & 난이도 선택',
  description: '풀고 싶은 카테고리와 난이도를 선택하고 SQL 문제를 풀어보세요.',
};

export default function QuizPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">문제 풀기</h1>
      <p className="text-text-sub mb-8">카테고리와 난이도를 선택하고 시작하세요.</p>
      <QuizSetup />
    </div>
  );
}
