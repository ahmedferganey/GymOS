/**
 * GymOS v9 — Formatters
 */

/**
 * Format rep range for display
 */
export function fmtRange(min, max) {
  if (min == null && max == null) return 'as planned';
  if (min === max) return String(min);
  return `${min}–${max}`;
}

/**
 * Parse rep range from string (e.g. "8–12" or "10")
 */
export function parseRepRange(value) {
  const s = String(value || '').replace(/\s/g, '').replaceAll('–', '-');
  const rangeMatch = s.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const min = +rangeMatch[1];
    const max = +rangeMatch[2];
    return { min, max, mid: Math.round((min + max) / 2) };
  }
  const singleMatch = s.match(/^(\d+)/);
  if (singleMatch) {
    const val = +singleMatch[1];
    return { min: val, max: val, mid: val };
  }
  return { min: null, max: null, mid: null };
}

/**
 * Parse sets from string (e.g. "4" or "3-5")
 */
export function parseSets(value) {
  const n = parseInt(String(value).match(/\d+/)?.[0] || '0', 10);
  return n > 0 ? n : 3;
}
