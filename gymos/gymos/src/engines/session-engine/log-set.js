/**
 * GymOS v9 — Log Set
 */

import { createSetEntry } from '../../core/models/set-entry.model.js';

export function getLogSlot(logs, week, dayId, exIndex) {
  const weekLogs = logs[week] || {};
  const dayLogs = weekLogs[dayId] || {};
  const slot = dayLogs[exIndex];
  if (slot) return { ...slot };
  return createSetEntry();
}

export function updateLogSlot(logs, week, dayId, exIndex, updates) {
  const next = { ...logs };
  next[week] = next[week] || {};
  next[week][dayId] = next[week][dayId] || {};
  const existing = next[week][dayId][exIndex] || {};
  next[week][dayId][exIndex] = { ...existing, ...updates };
  return next;
}
