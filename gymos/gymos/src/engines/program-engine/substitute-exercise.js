/**
 * GymOS v9 — Substitute Exercise
 */

import { findLibraryItem } from '../../data/exercises/exercise-library.js';

/**
 * Get substitution string for an exercise (v8 format: "Alt1 • Alt2")
 */
export function getSubstitution(ex, readiness = 72) {
  const substitute = ex[8] || ex.substitute || '';
  if (!substitute) return 'No direct substitution saved';
  const options = substitute.split(' • ').map((s) => s.trim()).filter(Boolean);
  if (readiness >= 68) return options[0] || substitute;
  if (options.length > 1) return options[1];
  return options[0] || substitute;
}
