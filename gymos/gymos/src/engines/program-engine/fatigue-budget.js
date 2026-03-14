/**
 * GymOS v9 — Fatigue Budget
 */

import { parseSets, parseRepRange } from '../../core/utils/formatters.js';

export function exerciseTier(ex) {
  const type = ex[1] || ex.type || 'compound';
  const sets = parseSets(ex[2] || ex.sets || 3);
  if (type === 'compound' && sets >= 4) return 'Tier A';
  if (type === 'compound' || sets >= 3) return 'Tier B';
  return 'Tier C';
}

export function fatigueCost(ex) {
  const sets = parseSets(ex[2] || ex.sets || 3);
  const reps = parseRepRange(ex[3] || ex.reps || '10').mid || 10;
  const base = (ex[1] || ex.type) === 'compound' ? 1.5 : 0.9;
  return Math.round(sets * base * (reps <= 6 ? 1.2 : reps >= 12 ? 0.9 : 1));
}
