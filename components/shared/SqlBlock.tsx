import { formatSql } from '@/lib/format-sql';

interface Props {
  sql: string;
  highlight?: number[]; // line indices (0-based) to highlight
  className?: string;
}

export default function SqlBlock({ sql, highlight, className }: Props) {
  const formatted = formatSql(sql);
  const lines = formatted.split('\n');

  return (
    <pre className={`bg-code-bg text-code-text rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre leading-relaxed ${className || ''}`}>
      {lines.map((line, i) => {
        const isHighlighted = highlight?.includes(i);
        return (
          <span
            key={i}
            className={isHighlighted ? 'bg-primary/20 text-primary font-semibold' : ''}
          >
            {line}
            {i < lines.length - 1 && '\n'}
          </span>
        );
      })}
    </pre>
  );
}
