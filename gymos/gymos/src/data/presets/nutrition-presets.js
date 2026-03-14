/**
 * GymOS v9 — Nutrition Presets
 */

export const DEFAULT_NUTRITION = {
  calories: 2000,
  protein: 160,
  carbs: 180,
  fat: 60,
  steps: 8000,
  water: 3,
  meals: 4,
  trainingDayCarbs: 180,
  restDayCarbs: 140,
};

export const REFEED_ADJUSTMENTS = {
  caloriesBoost: 180,
  carbsMultiplier: 1.2,
  fatMin: 35,
  fatReduction: 5,
};

export const DELOAD_ADJUSTMENTS = {
  carbsMultiplier: 0.92,
};

export const REFEED_DELOAD_ADJUSTMENTS = {
  caloriesBoost: 120,
  carbsMultiplier: 1.12,
  fatMin: 35,
  fatReduction: 8,
};
