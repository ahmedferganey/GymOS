/**
 * GymOS v9 — Next Target
 */

import { roundToStep } from '../../core/utils/math.js';

const PHASE_INCREMENT = {
  1: { compound: 0.02, isolation: 0.015 },
  2: { compound: 0.025, isolation: 0.02 },
  3: { compound: 0.03, isolation: 0.02 },
  4: { compound: 0.01, isolation: 0.01 },
  5: { compound: 0.02, isolation: 0.015 },
  6: { compound: 0.015, isolation: 0.01 },
};

export function suggestNextTarget(load, exType, phaseId, weekType = 'normal', unit = 'kg') {
  const n = Number(load);
  if (!isFinite(n) || n <= 0) return '';
  const inc = (PHASE_INCREMENT[phaseId] || PHASE_INCREMENT[2])[exType] ?? 0.02;
  const step = unit === 'kg' ? 0.25 : 0.5;
  let mult = 1;
  if (weekType === 'deload' || weekType === 'refeed_deload') mult = 1;
  else if (weekType === 'refeed') mult = 1.01;
  return roundToStep(n * (1 + inc) * mult, step);
}
