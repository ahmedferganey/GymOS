/**
 * GymOS v9 — Methodology Engine
 * Handles superset, dropset, cluster, etc.
 */

import { METHODOLOGY } from '../../core/constants/exercise-methods.js';

export function getMethodologyType(ex) {
  return ex.methodology || ex[11] || METHODOLOGY.NORMAL;
}

export function isLinkedExercise(ex) {
  const type = getMethodologyType(ex);
  return type === METHODOLOGY.SUPERSET || type === METHODOLOGY.GIANT_SET;
}

export function getPairOrGroupId(ex) {
  return ex.methodologyPairId || ex.methodologyGroupId || ex[12] || null;
}
