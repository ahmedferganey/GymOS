/**
 * GymOS v9 — Session Summary
 */

import { getLogSlot } from './log-set.js';

export function weekCompletion(logs, program, week) {
  const wk = logs[week] || {};
  let total = 0;
  let done = 0;
  program.forEach((day) => {
    (day.exercises || []).forEach((_, i) => {
      total++;
      const slot = getLogSlot(logs, week, day.id, i);
      if (slot.done) done++;
    });
  });
  return total ? Math.round((done / total) * 100) : 0;
}
