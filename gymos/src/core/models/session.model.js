/**
 * GymOS v9 — Session Model
 * Represents a locked/frozen workout session
 */

export function sessionKey(week, dayId) {
  return `w${week}_${dayId}`;
}

export function createSessionSnapshot(overrides = {}) {
  return {
    key: overrides.key || '',
    week: overrides.week ?? 1,
    dayId: overrides.dayId || 'd1',
    phase: overrides.phase ?? 1,
    weekType: overrides.weekType || 'normal',
    startedAt: overrides.startedAt || new Date().toISOString(),
    readiness: overrides.readiness ?? 72,
    exercises: overrides.exercises || [],
    ...overrides,
  };
}
