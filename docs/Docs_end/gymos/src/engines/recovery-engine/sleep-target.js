/**
 * GymOS v9 — Sleep Target
 */

import { DEFAULT_SLEEP_TARGET, DELOAD_SLEEP_TARGET } from '../../data/presets/recovery-presets.js';

export function sleepTarget(weekType, readiness) {
  if (weekType?.includes('deload') || readiness < 60) return DELOAD_SLEEP_TARGET;
  return DEFAULT_SLEEP_TARGET;
}
