/**
 * GymOS v9 — Expected Load
 */

import { roundToStep } from '../../core/utils/math.js';

export function expectedLoadForWeek(logs, week, dayId, exIndex, exType, unit = 'kg') {
  const step = unit === 'kg' ? 0.25 : 0.5;
  const records = {};
  for (let w = 1; w <= 12; w++) {
    const slot = logs?.[w]?.[dayId]?.[exIndex];
    const val = Number(slot?.todayLoad || slot?.startLoad || slot?.nextTarget || 0);
    if (isFinite(val) && val > 0) records[w] = val;
  }
  const anchorWeek = Object.keys(records).length ? Math.min(...Object.keys(records).map(Number)) : week;
  const anchorLoad = records[anchorWeek] || 0;
  if (!anchorLoad) return '';
  const factor = 1 + (exType === 'compound' ? 0.025 : 0.02);
  let prev = anchorLoad;
  for (let w = anchorWeek + 1; w <= week; w++) {
    if (records[w]) prev = records[w];
    else prev = prev * factor;
  }
  return roundToStep(prev, step);
}
