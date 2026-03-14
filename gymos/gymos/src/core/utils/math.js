/**
 * GymOS v9 — Math Utilities
 */

/**
 * Round to step (e.g. 0.25 for kg, 0.5 for lb)
 */
export function roundToStep(value, step) {
  const n = Number(value);
  if (!isFinite(n)) return '';
  const result = Math.round(n / step) * step;
  return result.toFixed(step < 1 ? 2 : 1).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}
