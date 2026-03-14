/**
 * GymOS v9 — Recovery Model
 */

export function createRecoveryEntry(overrides = {}) {
  return {
    sleep: overrides.sleep ?? '',
    soreness: overrides.soreness ?? '',
    stress: overrides.stress ?? '',
    water: overrides.water ?? '',
    sauna: overrides.sauna ?? '',
    steam: overrides.steam ?? '',
    steps: overrides.steps ?? '',
    notes: overrides.notes ?? '',
    ...overrides,
  };
}
