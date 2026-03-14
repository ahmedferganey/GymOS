/**
 * GymOS v9 — Readiness Score
 */

import { clamp } from '../../core/utils/math.js';

export function computeReadinessScore(fatigueTotal = 0, localFatigue = 0) {
  const raw = 100 - fatigueTotal * 2.1 - Math.min(18, localFatigue * 0.45);
  return Math.max(25, Math.min(98, Math.round(raw)));
}

export function readinessLabel(score) {
  if (score >= 82) return 'Push';
  if (score >= 68) return 'Normal';
  if (score >= 52) return 'Conservative';
  return 'Recovery bias';
}
