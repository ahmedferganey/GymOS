/**
 * GymOS v9 — Macro Targets
 */

import {
  REFEED_ADJUSTMENTS,
  DELOAD_ADJUSTMENTS,
  REFEED_DELOAD_ADJUSTMENTS,
} from '../../data/presets/nutrition-presets.js';

export function macroTargets(nutrition, weekType, dayType = 'training') {
  let carbs = dayType === 'lower' ? nutrition.trainingDayCarbs : nutrition.restDayCarbs || nutrition.carbs;
  let fat = nutrition.fat;
  if (weekType === 'refeed') {
    carbs = Math.round(carbs * REFEED_ADJUSTMENTS.carbsMultiplier);
    fat = Math.max(REFEED_ADJUSTMENTS.fatMin, fat - REFEED_ADJUSTMENTS.fatReduction);
  }
  if (weekType === 'deload') {
    carbs = Math.round(carbs * DELOAD_ADJUSTMENTS.carbsMultiplier);
  }
  if (weekType === 'refeed_deload' || weekType === 'refeed+deload') {
    carbs = Math.round(carbs * REFEED_DELOAD_ADJUSTMENTS.carbsMultiplier);
    fat = Math.max(REFEED_DELOAD_ADJUSTMENTS.fatMin, fat - REFEED_DELOAD_ADJUSTMENTS.fatReduction);
  }
  return {
    protein: nutrition.protein,
    carbs,
    fat,
  };
}
