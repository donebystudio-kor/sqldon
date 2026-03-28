const PREFIX = 'sqldon';

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`${PREFIX}.${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value));
  } catch {}
}

export const storage = {
  getProgress: () => getItem<Record<string, boolean>>('progress', {}),
  setProgress: (v: Record<string, boolean>) => setItem('progress', v),
  markSolved: (id: string, correct: boolean) => {
    const p = storage.getProgress();
    p[id] = correct;
    storage.setProgress(p);
  },

  getWrongAnswers: () => getItem<string[]>('wrongAnswers', []),
  addWrongAnswer: (id: string) => {
    const w = storage.getWrongAnswers();
    if (!w.includes(id)) { w.push(id); setItem('wrongAnswers', w); }
  },
  removeWrongAnswer: (id: string) => {
    const w = storage.getWrongAnswers().filter(i => i !== id);
    setItem('wrongAnswers', w);
  },

  getBookmarks: () => getItem<string[]>('bookmarks', []),
  toggleBookmark: (id: string) => {
    const b = storage.getBookmarks();
    const idx = b.indexOf(id);
    if (idx >= 0) b.splice(idx, 1); else b.push(id);
    setItem('bookmarks', b);
    return idx < 0;
  },
  isBookmarked: (id: string) => storage.getBookmarks().includes(id),

  getRecentCategory: () => getItem<string | null>('recentCategory', null),
  setRecentCategory: (c: string) => setItem('recentCategory', c),
};
