/**
 * GymOS v9 — Estimate 1RM
 * Epley formula: 1RM = weight * (1 + reps/30)
 */

export function estimate1RM(weight, reps) {
  const w = Number(weight);
  const r = Number(reps);
  if (!isFinite(w) || w <= 0 || !isFinite(r) || r <= 0) return null;
  if (r === 1) return w;
  return Math.round(w * (1 + r / 30) * 100) / 100;
}
