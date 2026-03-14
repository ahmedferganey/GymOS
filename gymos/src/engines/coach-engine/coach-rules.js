/**
 * GymOS v9 — Coach Rules
 */

import { WEEK_TYPES } from '../../core/constants/week-types.js';

export function recommendWeekType(fatigueBreakdown, recentWeeks) {
  const total = fatigueBreakdown?.total ?? 0;
  if (total >= 24) return WEEK_TYPES.REFEED_DELOAD;
  if (total >= 18) return WEEK_TYPES.DELOAD;
  if (total >= 12) return WEEK_TYPES.REFEED;
  return WEEK_TYPES.NORMAL;
}
