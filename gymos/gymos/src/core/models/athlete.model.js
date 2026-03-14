/**
 * GymOS v9 — Athlete Model
 */

export function createAthlete(overrides = {}) {
  return {
    profileName: 'Athlete',
    unit: 'kg',
    priorities: {},
    ...overrides,
  };
}
