/**
 * GymOS v9 — Next Week Strategy
 */

import { WEEK_TYPE_LABELS } from '../../core/constants/week-types.js';

export function nextWeekRecommendation(fatigueBreakdown, completion, fromWeek) {
  const total = fatigueBreakdown?.total ?? 0;
  let type = 'normal';
  const reasons = [];
  if (total >= 20) {
    type = 'refeed_deload';
    reasons.push('Fatigue is persistently high across recent weeks.');
  } else if (total >= 16) {
    type = 'deload';
    reasons.push('Fatigue trend suggests recovery debt is accumulating.');
  } else if (total >= 11) {
    type = 'refeed';
    reasons.push('Performance or recovery looks flat enough to justify more fuel.');
  } else {
    type = 'normal';
    reasons.push('Fatigue and recovery trend support another normal week.');
  }
  const confidence = completion >= 70 ? 'high' : completion >= 40 ? 'medium' : 'low';
  return {
    nextWeek: Math.min(12, fromWeek + 1),
    type,
    label: WEEK_TYPE_LABELS[type] || type,
    confidence,
    reasonText: reasons.join(' • '),
  };
}
