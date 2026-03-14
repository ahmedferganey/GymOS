/**
 * GymOS v9 — Progression Model
 * Tracks load progression concepts
 */

export function createProgressionEntry(overrides = {}) {
  return {
    startLoad: overrides.startLoad ?? null,
    expectedLoad: overrides.expectedLoad ?? null,
    performedLoad: overrides.performedLoad ?? null,
    nextTarget: overrides.nextTarget ?? null,
    performanceDelta: overrides.performanceDelta ?? null,
    ...overrides,
  };
}
