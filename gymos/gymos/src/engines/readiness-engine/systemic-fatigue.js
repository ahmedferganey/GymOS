/**
 * GymOS v9 — Systemic Fatigue
 */

import { clamp } from '../../core/utils/math.js';

export function fatigueBreakdown(recoveryLog = {}, measures = {}, nutrition = {}, logs = {}, program = {}, week = 1) {
  const rec = recoveryLog[week] || {};
  const m = measures[week - 1] || {};
  const n = nutrition || {};
  const training = fatigueScoreFromLogs(logs, program, week);
  const sleep = Number(rec.sleep || m.sleep || 0);
  const soreness = Number(rec.soreness || 0);
  const stress = Number(rec.stress || 0);
  const water = Number(rec.water || 0);
  const sleepPenalty = sleep ? clamp((7.5 - sleep) * 2.2, 0, 8) : 2;
  const sorenessPenalty = clamp(soreness * 1.2, 0, 12);
  const stressPenalty = clamp(stress * 1.1, 0, 11);
  const hydrationPenalty = clamp((Number(n.water || 3) - water) * 1.6, 0, 6);
  const total = Math.max(0, Math.round(training + sleepPenalty + sorenessPenalty + stressPenalty + hydrationPenalty));
  return { total, training, sleepPenalty, sorenessPenalty, stressPenalty, hydrationPenalty };
}

function fatigueScoreFromLogs(logs, program, week) {
  const wk = logs[week] || {};
  let score = 0;
  program.forEach((day) => {
    (day.exercises || []).forEach((ex, idx) => {
      const slot = wk[day.id]?.[idx];
      if (!slot?.done) return;
      const base = (ex[1] || ex.type) === 'compound' ? 2.4 : 1.1;
      const load = Number(slot.todayLoad || slot.startLoad || 0) || 0;
      const loadFactor = load ? Math.min(2.5, load / 40) : 0.8;
      score += base * loadFactor;
    });
  });
  return Math.round(score);
}
