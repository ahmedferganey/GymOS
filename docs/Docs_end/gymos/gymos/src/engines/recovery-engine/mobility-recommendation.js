/**
 * GymOS v9 — Mobility Recommendation
 */

export function mobilityRecommendation(dayId) {
  if (dayId === 'd3' || dayId === 'd6') return '12 min hips + trunk';
  return '8–10 min shoulders + T-spine';
}
