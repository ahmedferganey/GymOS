/**
 * GymOS v9 — Finish Exercise
 */

import { updateLogSlot } from './log-set.js';

export function markExerciseDone(logs, week, dayId, exIndex, done = true) {
  return updateLogSlot(logs, week, dayId, exIndex, { done });
}
