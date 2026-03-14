/**
 * GymOS v9 — Methodology Presets
 */

import { METHODOLOGY } from '../../core/constants/exercise-methods.js';

export const METHODOLOGY_PRESETS = {
  [METHODOLOGY.NORMAL]: {
    restBetweenSets: 'full',
    dropCount: 0,
    dropPercent: 0,
    clusterRest: 0,
  },
  [METHODOLOGY.SUPERSET]: {
    restBetweenSets: 'minimal',
    pairId: null,
  },
  [METHODOLOGY.GIANT_SET]: {
    restBetweenSets: 'minimal',
    groupId: null,
  },
  [METHODOLOGY.DROPSET]: {
    dropCount: 2,
    dropPercent: 20,
    restBetweenDrops: 10,
  },
  [METHODOLOGY.REST_PAUSE]: {
    restBetweenClusters: 15,
    clusterReps: 3,
  },
  [METHODOLOGY.CLUSTER]: {
    clusterRest: 15,
    repsPerCluster: 3,
  },
};
