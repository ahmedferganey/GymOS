/**
 * GymOS v9 — Refeed Adjustment
 */

export function refeedCarbBoost(baseCarbs, weekType) {
  if (weekType === 'refeed' || weekType === 'refeed_deload' || weekType === 'refeed+deload') {
    return Math.round(baseCarbs * 1.22);
  }
  return baseCarbs;
}
