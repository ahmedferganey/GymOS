/**
 * GymOS v9 — RIR-based Progression
 */

export function parseRIR(rirText) {
  const txt = String(rirText || 'RIR 2');
  const nums = [...txt.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  return nums.length ? nums[0] : 2;
}

export function adjustRIRForWeekType(rirText, weekType) {
  const rir = parseRIR(rirText);
  if (weekType === 'deload' || weekType === 'refeed_deload') return Math.min(3, rir + 1.5);
  if (weekType === 'refeed') return Math.max(0, rir - 0.5);
  return rir;
}
