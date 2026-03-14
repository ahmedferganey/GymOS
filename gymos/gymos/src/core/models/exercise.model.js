/**
 * GymOS v9 — Exercise Model
 * Structured model replacing v8 array indices
 */

import { exerciseId } from '../utils/ids.js';
import { METHODOLOGY } from '../constants/exercise-methods.js';

export const EXERCISE_ROLES = {
  ANCHOR_COMPOUND: 'anchor_compound',
  HYPERTROPHY_COMPOUND: 'hypertrophy_compound',
  ISOLATION: 'isolation',
  FINISHER: 'finisher',
  MOBILITY: 'mobility',
};

export const EXERCISE_TYPES = {
  COMPOUND: 'compound',
  ISOLATION: 'isolation',
  MOBILITY: 'mobility',
};

export function createExercise(overrides = {}, dayId = 'd1', index = 0) {
  const name = overrides.name || 'New Exercise';
  return {
    id: overrides.id || exerciseId(dayId, name, index),
    name,
    type: overrides.type || EXERCISE_TYPES.COMPOUND,
    sets: overrides.sets ?? '3',
    reps: overrides.reps ?? '8–12',
    rir: overrides.rir ?? 'RIR 1–2',
    tempo: overrides.tempo ?? '2-1-1',
    primaryMuscles: overrides.primaryMuscles || [],
    secondaryMuscles: overrides.secondaryMuscles || [],
    substitute: overrides.substitute || '',
    role: overrides.role || EXERCISE_ROLES.HYPERTROPHY_COMPOUND,
    methodology: overrides.methodology || METHODOLOGY.NORMAL,
    methodologyPairId: overrides.methodologyPairId || null,
    expectedLoad: overrides.expectedLoad ?? null,
    performedLoad: overrides.performedLoad ?? null,
    nextTarget: overrides.nextTarget ?? null,
    fatigueCost: overrides.fatigueCost ?? null,
    notes: overrides.notes || '',
    ...overrides,
  };
}
