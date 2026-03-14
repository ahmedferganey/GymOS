/**
 * GymOS v9 — Hydration Target
 */

export function hydrationTarget(baseWater, weekType) {
  let water = Number(baseWater) || 3;
  if (weekType === 'refeed' || weekType === 'refeed_deload' || weekType === 'refeed+deload') {
    water += 0.3;
  }
  return water;
}
