/**
 * GymOS v9 — Lock Session
 */

import { sessionKey, createSessionSnapshot } from '../../core/models/session.model.js';
import { fatigueCost } from '../program-engine/fatigue-budget.js';
import { parseSets, parseRepRange } from '../../core/utils/formatters.js';

export function buildSessionSnapshot(day, week, phase, weekType, readiness = 72) {
  const exercises = (day.exercises || []).map((ex) => {
    const sets = parseSets(ex[2] || ex.sets || 3);
    const reps = parseRepRange(ex[3] || ex.reps || '10');
    return {
      sets,
      reps: reps.min === reps.max ? String(reps.mid) : `${reps.min}–${reps.max}`,
      rir: ex[4] || ex.rir || 'RIR 1–2',
      rest: (ex[1] || ex.type) === 'compound' ? '120–150s' : '45–60s',
      focus: 'Standard controlled reps.',
      readiness,
      tier: ex.tier || (sets >= 4 ? 'Tier A' : 'Tier B'),
      fatigueCost: fatigueCost(ex),
      weekType,
    };
  });

  return createSessionSnapshot({
    key: sessionKey(week, day.id),
    week,
    dayId: day.id,
    phase,
    weekType,
    startedAt: new Date().toISOString(),
    readiness,
    exercises,
  });
}

function getWeekType(state) {
  const m = (state.measures || [])[state.week - 1];
  return (m?.weekType && m.weekType !== 'auto') ? m.weekType : 'normal';
}

export function lockSession(state, day, week) {
  const sessionLocks = { ...(state.sessionLocks || {}) };
  const snapshot = buildSessionSnapshot(
    day,
    week,
    state.phase ?? 1,
    getWeekType(state),
    72
  );
  sessionLocks[snapshot.key] = snapshot;
  return { ...state, sessionLocks };
}

export function unlockSession(state, week, dayId) {
  const sessionLocks = { ...(state.sessionLocks || {}) };
  const key = sessionKey(week, dayId);
  delete sessionLocks[key];
  return { ...state, sessionLocks };
}
