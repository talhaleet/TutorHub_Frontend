/** Normalize subject from API (string or { id, name }). */
export const subjectName = (s) => {
  if (s == null) return '';
  if (typeof s === 'string') return s;
  return s.name ?? s.Name ?? '';
};

export const subjectId = (s) => {
  if (s == null || typeof s === 'string') return null;
  return s.id ?? s.Id ?? null;
};

export const subjectKey = (s, index = 0) => {
  const id = subjectId(s);
  const name = subjectName(s);
  return id != null ? String(id) : `${name}-${index}`;
};
