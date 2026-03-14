/**
 * GymOS v9 — Performance Delta
 */

import { roundToStep } from '../../core/utils/math.js';

export function performanceDelta(performedLoad, expectedLoad, unit = 'kg') {
  const perf = Number(performedLoad);
  const exp = Number(expectedLoad);
  if (!isFinite(perf) || !isFinite(exp) || exp <= 0) return null;
  const delta = perf - exp;
  const ratio = perf / exp;
  const step = unit === 'kg' ? 0.25 : 0.5;
  return {
    delta: roundToStep(delta, step),
    ratio,
    status: ratio >= 1.035 ? 'ahead' : ratio >= 0.97 ? 'on_track' : 'behind',
  };
}
