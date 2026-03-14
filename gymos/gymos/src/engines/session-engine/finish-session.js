/**
 * GymOS v9 — Finish Session
 */

import { unlockSession } from './lock-session.js';

export function finishSession(state, week, dayId) {
  return unlockSession(state, week, dayId);
}
