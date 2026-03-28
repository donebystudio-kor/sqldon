'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/local-storage';

interface Props {
  problemId: string;
}

export default function BookmarkButton({ problemId }: Props) {
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    setMarked(storage.isBookmarked(problemId));
  }, [problemId]);

  const toggle = () => {
    const newState = storage.toggleBookmark(problemId);
    setMarked(newState);
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
        marked
          ? 'bg-warning/10 border-warning text-warning'
          : 'border-border text-text-sub hover:border-warning hover:text-warning'
      }`}
      title={marked ? '북마크 해제' : '북마크'}
    >
      {marked ? '★ 북마크됨' : '☆ 북마크'}
    </button>
  );
}
