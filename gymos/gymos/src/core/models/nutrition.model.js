/**
 * GymOS v9 — Nutrition Model
 */

export function createNutrition(overrides = {}) {
  return {
    calories: overrides.calories ?? 2000,
    protein: overrides.protein ?? 160,
    carbs: overrides.carbs ?? 180,
    fat: overrides.fat ?? 60,
    steps: overrides.steps ?? 8000,
    water: overrides.water ?? 3,
    meals: overrides.meals ?? 4,
    trainingDayCarbs: overrides.trainingDayCarbs ?? 180,
    restDayCarbs: overrides.restDayCarbs ?? 140,
    notes: overrides.notes ?? '',
    ...overrides,
  };
}
