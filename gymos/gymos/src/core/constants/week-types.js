/**
 * GymOS v9 — Week Types
 */

export const WEEK_TYPES = {
  NORMAL: 'normal',
  REFEED: 'refeed',
  DELOAD: 'deload',
  REFEED_DELOAD: 'refeed_deload',
  AUTO: 'auto',
};

export const WEEK_TYPE_LABELS = {
  [WEEK_TYPES.NORMAL]: 'Normal',
  [WEEK_TYPES.REFEED]: 'Refeed',
  [WEEK_TYPES.DELOAD]: 'Deload',
  [WEEK_TYPES.REFEED_DELOAD]: 'Refeed + Deload',
  [WEEK_TYPES.AUTO]: 'Auto',
};

export function normalizeWeekType(type) {
  const raw = String(type || 'auto').trim().toLowerCase().replaceAll(' ', '');
  if (raw === 'refeed_deload' || raw === 'refeed+deload') return WEEK_TYPES.REFEED_DELOAD;
  if (Object.values(WEEK_TYPES).includes(raw)) return raw;
  return WEEK_TYPES.AUTO;
}
