/**
 * GymOS v9 — Autoregulation
 */

import { exerciseTier } from '../program-engine/fatigue-budget.js';

export function autoregulateSets(baseSets, readiness, tier) {
  if (readiness < 55 && tier === 'Tier C') return Math.max(1, baseSets - 1);
  return baseSets;
}

export function autoregulateRIR(baseRIR, readiness) {
  if (readiness < 55) return shiftRIR(baseRIR, 1);
  return baseRIR;
}

function shiftRIR(rirText, adj) {
  const nums = [...String(rirText || 'RIR 2').matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  if (!nums.length) return rirText;
  const shifted = nums.map((n) => Math.max(0, Math.round((n + adj) * 2) / 2));
  return `RIR ${shifted[0]}${shifted.length > 1 ? `–${shifted[1]}` : ''}`;
}
