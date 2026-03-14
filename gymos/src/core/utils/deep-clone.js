/**
 * GymOS v9 — Deep Clone
 */

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
