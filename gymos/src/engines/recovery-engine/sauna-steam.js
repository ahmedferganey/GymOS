/**
 * GymOS v9 — Sauna / Steam
 */

import { SAUNA_PRESETS, STEAM_PRESETS } from '../../data/presets/recovery-presets.js';

export function saunaRecommendation(weekType) {
  return SAUNA_PRESETS[weekType] || SAUNA_PRESETS.normal;
}

export function steamRecommendation(weekType) {
  return weekType?.includes('deload') ? STEAM_PRESETS.deload : STEAM_PRESETS.normal;
}
