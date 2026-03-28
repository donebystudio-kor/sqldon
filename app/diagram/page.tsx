import type { Metadata } from 'next';
import DiagramClient from './DiagramClient';

export const metadata: Metadata = {
  title: '오라클 아키텍처 다이어그램',
  description: 'SGA, PGA, 프로세스 구조를 인터랙티브하게 학습합니다.',
};

export default function DiagramPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">오라클 아키텍처</h1>
      <p className="text-text-sub mb-8">
        구성 요소를 클릭하면 오른쪽에 상세 설명이 표시됩니다. 각 영역의 역할과 관련 키워드를 확인해보세요.
      </p>
      <DiagramClient />
    </div>
  );
}
