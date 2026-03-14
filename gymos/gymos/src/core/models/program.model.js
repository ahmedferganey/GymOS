/**
 * GymOS v9 — Program Model
 */

import { createTrainingDay } from './training-day.model.js';

export function createProgram(overrides = {}) {
  return {
    id: overrides.id || 'default',
    name: overrides.name || 'Default Program',
    days: overrides.days || [],
    ...overrides,
  };
}

export function createEmptyProgram() {
  return createProgram({
    days: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].map((id, i) =>
      createTrainingDay({ id, name: `Day ${i + 1}` })
    ),
  });
}
