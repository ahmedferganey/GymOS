/**
 * GymOS v9 — Program Service
 */

import { getDefaultProgram } from '../data/templates/default-program.js';
import { deepClone } from '../core/utils/deep-clone.js';

export function getProgram(state) {
  if (state.customProgram && Array.isArray(state.customProgram) && state.customProgram.length > 0) {
    return deepClone(state.customProgram);
  }
  return getDefaultProgram();
}

export function getActiveDay(state, program) {
  const dayId = state.activeDayId || 'd1';
  return program.find((d) => d.id === dayId) || program[0];
}
