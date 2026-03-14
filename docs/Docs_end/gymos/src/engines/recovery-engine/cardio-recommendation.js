/**
 * GymOS v9 — Cardio Recommendation
 */

import { CARDIO_BY_GROUP } from '../../data/presets/recovery-presets.js';
import { getPhaseMod } from '../../data/presets/week-presets.js';

export function cardioRecommendation(day, phaseId) {
  const base = CARDIO_BY_GROUP[day.group] || 15;
  const mod = getPhaseMod(phaseId);
  const minutes = Math.max(8, base + (mod?.cardioAdj || 0));
  if (day.group === 'recovery') return { type: day.cardio?.type || 'Recovery Walk / Bike', minutes: 20 + (phaseId >= 4 ? 5 : 0) };
  return { type: day.cardio?.type || 'Walk', minutes };
}
