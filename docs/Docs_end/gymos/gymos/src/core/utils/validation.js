/**
 * GymOS v9 — Validation Utilities
 */

export function isNumber(value) {
  const n = Number(value);
  return isFinite(n);
}

export function isPositiveNumber(value) {
  const n = Number(value);
  return isFinite(n) && n > 0;
}

export function isNonNegativeNumber(value) {
  const n = Number(value);
  return isFinite(n) && n >= 0;
}

export function isString(value) {
  return typeof value === 'string';
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
