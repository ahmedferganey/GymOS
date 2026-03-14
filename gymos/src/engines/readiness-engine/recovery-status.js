/**
 * GymOS v9 — Recovery Status
 */

import { readinessLabel } from './readiness-score.js';

export function getRecoveryStatus(readinessScore) {
  const label = readinessLabel(readinessScore);
  return {
    score: readinessScore,
    label,
    recommendation:
      label === 'Push'
        ? 'Ready to push; priority compounds can add load or extra set.'
        : label === 'Recovery bias'
          ? 'Reduce intensity, add rest, avoid grinding.'
          : 'Standard execution; follow the plan.',
  };
}
