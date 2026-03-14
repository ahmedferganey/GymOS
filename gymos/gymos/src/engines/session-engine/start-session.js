/**
 * GymOS v9 — Start Session
 */

import { sessionKey, createSessionSnapshot } from '../../core/models/session.model.js';

export function canStartSession(week, dayId, sessionLocks = {}) {
  const key = sessionKey(week, dayId);
  return !sessionLocks[key];
}
