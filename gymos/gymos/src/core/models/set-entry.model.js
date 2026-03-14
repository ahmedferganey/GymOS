/**
 * GymOS v9 — Set Entry Model
 * Logged data for a single exercise in a session
 */

export function createSetEntry(overrides = {}) {
  return {
    startLoad: overrides.startLoad ?? '',
    todayLoad: overrides.todayLoad ?? '',
    nextTarget: overrides.nextTarget ?? '',
    done: overrides.done ?? false,
    note: overrides.note || '',
    ...overrides,
  };
}
