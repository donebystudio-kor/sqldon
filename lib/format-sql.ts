/**
 * Simple SQL formatter for display purposes.
 * Adds line breaks before major SQL keywords for readability.
 * Handles ___ blanks used in fill problems.
 */

const BREAK_BEFORE = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'JOIN',
  'ON',
  'UNION ALL',
  'UNION',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
];

const KEYWORD_REGEX = new RegExp(
  `(?<=\\s)(${BREAK_BEFORE.map(k => k.replace(/\s+/g, '\\s+')).join('|')})(?=\\s|$)`,
  'gi'
);

export function formatSql(sql: string): string {
  if (!sql) return sql;

  // Normalize whitespace
  let formatted = sql.trim().replace(/\s+/g, ' ');

  // Add newline before keywords
  formatted = formatted.replace(KEYWORD_REGEX, '\n$1');

  // Indent continuation lines
  const lines = formatted.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const upper = trimmed.toUpperCase();

    const isTopLevel = BREAK_BEFORE.some(kw =>
      upper.startsWith(kw)
    );

    if (isTopLevel) {
      result.push(trimmed);
    } else {
      result.push('  ' + trimmed);
    }
  }

  return result.join('\n');
}

/**
 * Format SQL template that contains ___ blanks.
 * Replaces ___ with unique tokens, formats, then restores.
 */
export function formatSqlTemplate(template: string): string {
  if (!template) return template;

  // Replace ___ with unique tokens that won't be affected by formatting
  const blanks: string[] = [];
  let tokenized = template.replace(/___/g, () => {
    const token = `\x00BLANK${blanks.length}\x00`;
    blanks.push(token);
    return token;
  });

  // Format the tokenized SQL
  const formatted = formatSql(tokenized);

  // Restore blanks
  let result = formatted;
  blanks.forEach((token, i) => {
    result = result.replace(token, '___');
  });

  return result;
}
