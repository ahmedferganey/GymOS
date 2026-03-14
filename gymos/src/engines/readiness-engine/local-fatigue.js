/**
 * GymOS v9 — Local Muscle Fatigue
 */

import { parseSets } from '../../core/utils/formatters.js';

export function localMuscleFatigueMap(logs, program, week) {
  const out = {};
  const wk = logs[week] || {};
  program.forEach((day) => {
    (day.exercises || []).forEach((ex, idx) => {
      const slot = wk[day.id]?.[idx] || {};
      const load = Number(slot.todayLoad || slot.startLoad || slot.nextTarget || 0) || 0;
      const mult = (ex[1] || ex.type) === 'compound' ? 1.15 : 0.8;
      const sets = parseSets(ex[2] || ex.sets || 3);
      const done = !!slot.done;
      const contribution = (done ? sets : sets * 0.35) * mult * (1 + Math.min(1.5, load / 100));
      (ex[6] || ex.primaryMuscles || []).forEach((m) => {
        out[m] = (out[m] || 0) + contribution;
      });
    });
  });
  Object.keys(out).forEach((k) => (out[k] = Math.round(out[k])));
  return out;
}

export function classifyLocalFatigue(score) {
  if (score >= 26) return 'High';
  if (score >= 16) return 'Moderate';
  return 'Low';
}
