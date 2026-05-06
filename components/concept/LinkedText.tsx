import Link from 'next/link';
import { CONCEPTS } from '@/data/concepts';

interface Segment {
  text: string;
  tag?: string;
}

const KEYWORDS: { text: string; tag: string }[] = CONCEPTS
  .flatMap(c => [
    { text: c.title, tag: c.tag },
    ...(c.aliases || []).map(a => ({ text: a, tag: c.tag })),
  ])
  .sort((a, b) => b.text.length - a.text.length);

function tokenize(text: string, currentTag: string): Segment[] {
  let segments: Segment[] = [{ text }];
  const used = new Set<string>();

  for (const kw of KEYWORDS) {
    if (used.has(kw.tag)) continue;
    if (kw.tag === currentTag) continue;

    let found = false;
    const next: Segment[] = [];

    for (const seg of segments) {
      if (found || seg.tag) {
        next.push(seg);
        continue;
      }
      const idx = seg.text.indexOf(kw.text);
      if (idx === -1) {
        next.push(seg);
        continue;
      }
      if (idx > 0) next.push({ text: seg.text.slice(0, idx) });
      next.push({ text: kw.text, tag: kw.tag });
      const remainder = seg.text.slice(idx + kw.text.length);
      if (remainder) next.push({ text: remainder });
      found = true;
      used.add(kw.tag);
    }

    segments = next;
  }

  return segments;
}

interface Props {
  text: string;
  currentTag: string;
  className?: string;
}

export default function LinkedText({ text, currentTag, className }: Props) {
  const segments = tokenize(text, currentTag);

  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.tag ? (
          <Link
            key={i}
            href={`/concept/${seg.tag}`}
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {seg.text}
          </Link>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
