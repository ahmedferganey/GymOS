/**
 * GymOS v9 — Calorie Target
 */

import { REFEED_ADJUSTMENTS, DELOAD_ADJUSTMENTS, REFEED_DELOAD_ADJUSTMENTS } from '../../data/presets/nutrition-presets.js';

export function calorieTarget(baseCalories, weekType) {
  let out = Number(baseCalories) || 2000;
  if (weekType === 'refeed') out += REFEED_ADJUSTMENTS.caloriesBoost;
  if (weekType === 'refeed_deload' || weekType === 'refeed+deload') out += REFEED_DELOAD_ADJUSTMENTS.caloriesBoost;
  return out;
}
