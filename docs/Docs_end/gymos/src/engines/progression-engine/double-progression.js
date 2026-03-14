/**
 * GymOS v9 — Double Progression
 * Progress when both load and reps hit target
 */

import { parseRepRange } from '../../core/utils/formatters.js';

export function canProgressLoad(performedReps, targetRepRange, performedLoad, targetLoad) {
  const range = parseRepRange(targetRepRange);
  if (!range.mid) return false;
  const hitReps = performedReps >= (range.min || range.mid);
  const hitLoad = !targetLoad || (performedLoad && Number(performedLoad) >= Number(targetLoad) * 0.98);
  return hitReps && hitLoad;
}
