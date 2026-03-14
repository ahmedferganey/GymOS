/**
 * GymOS v9 — Meal Timing
 */

export function preWorkoutTiming(dayType) {
  return dayType === 'lower'
    ? '60–90 min pre: protein + bigger carb meal.'
    : '60–90 min pre: protein + moderate carbs.';
}

export function postWorkoutTiming(weekType) {
  return weekType?.includes('refeed')
    ? 'Post: protein + aggressive glycogen refill meal.'
    : 'Post: protein + controlled carbs, keep fat lower.';
}
