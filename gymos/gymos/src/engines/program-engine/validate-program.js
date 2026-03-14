/**
 * GymOS v9 — Validate Program
 */

import { parseSets } from '../../core/utils/formatters.js';

export function validateProgram(program) {
  const errors = [];
  if (!Array.isArray(program)) {
    errors.push({ level: 'error', message: 'Program must be an array of days' });
    return { valid: false, errors };
  }
  program.forEach((day, i) => {
    if (!day.id) errors.push({ level: 'error', message: `Day ${i + 1} missing id` });
    if (!day.name) errors.push({ level: 'warn', message: `Day ${i + 1} missing name` });
    if (!Array.isArray(day.exercises)) {
      errors.push({ level: 'error', message: `Day ${day.id} has no exercises array` });
    }
  });
  return {
    valid: errors.filter((e) => e.level === 'error').length === 0,
    errors,
  };
}
