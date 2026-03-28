'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/local-storage';
import { ALL_PROBLEMS } from '@/data/problems';

export default function HomeStats() {
  const [stats, setStats] = useState({ total: 0, solved: 0, bookmarks: 0, wrong: 0 });

  useEffect(() => {
    const progress = storage.getProgress();
    const bookmarks = storage.getBookmarks();
    const wrong = storage.getWrongAnswers();
    const solved = Object.keys(progress).length;
    setStats({ total: ALL_PROBLEMS.length, solved, bookmarks: bookmarks.length, wrong: wrong.length });
  }, []);

  const items = [
    { label: '전체 문제', value: stats.total, color: 'text-primary' },
    { label: '풀이 완료', value: stats.solved, color: 'text-success' },
    { label: '북마크', value: stats.bookmarks, color: 'text-warning' },
    { label: '오답 노트', value: stats.wrong, color: 'text-error' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(item => (
        <div key={item.label} className="bg-surface border border-border rounded-lg p-4 text-center">
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-sm text-text-sub mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
