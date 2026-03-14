/**
 * GymOS v9 — Deload Decision
 */

export function shouldDeload(fatigueTotal, avgFatigue, risingFatigue, lowSleepStreak, highSorenessStreak) {
  if (fatigueTotal >= 20 || (avgFatigue >= 17 && risingFatigue >= 2)) return true;
  if (fatigueTotal >= 16 || avgFatigue >= 14 || highSorenessStreak >= 2) return true;
  if (lowSleepStreak >= 2 && highSorenessStreak >= 1) return true;
  return false;
}
