/**
 * GymOS v9 — Training Day Model
 */

import { warmupId } from '../utils/ids.js';

export function createWarmupItem(overrides = {}, dayId = 'd1', index = 0) {
  const name = overrides.name || 'New Warm-up';
  return {
    id: overrides.id || warmupId(dayId, name, index),
    name,
    sets: overrides.sets ?? 2,
    reps: overrides.reps ?? '10–12',
    role: overrides.role || 'warmup',
    ...overrides,
  };
}

export function createTrainingDay(overrides = {}) {
  return {
    id: overrides.id || 'd1',
    name: overrides.name || 'Day 1',
    focus: overrides.focus || '',
    notes: overrides.notes || '',
    group: overrides.group || 'upperHeavy',
    cardio: overrides.cardio || { type: 'Walk', minutes: 15 },
    warmup: overrides.warmup || [],
    exercises: overrides.exercises || [],
    ...overrides,
  };
}
