/**
 * GymOS v9 — Muscle Map
 * Maps muscles to their common groupings for workload analytics
 */

import { MUSCLE_GROUPS } from '../../core/constants/muscle-groups.js';

/** Muscles that are often under-trained (priority candidates) */
export const COMMON_PRIORITY_MUSCLES = [
  'Upper chest',
  'Lats',
  'Side delts',
  'Rear delts',
  'Upper back',
  'Glutes',
  'Hamstrings',
  'Quads',
];

/** Default target muscles per day (from v8 baseTargetMuscles) */
export const DAY_TARGET_MUSCLES = {
  d1: ['Upper chest', 'Lats', 'Upper back'],
  d2: ['Lats', 'Lower lats'],
  d3: ['Quads', 'Hamstrings'],
  d4: ['Shoulders', 'Side delts', 'Rear delts', 'Biceps'],
  d5: ['Upper chest'],
  d6: ['Glutes', 'Hamstrings'],
  d7: ['Hips', 'Pelvis', 'Spine', 'Core'],
};

export { MUSCLE_GROUPS };
