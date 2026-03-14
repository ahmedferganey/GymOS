/**
 * GymOS v9 — Coach Warnings
 */

import { fatigueCost } from '../program-engine/fatigue-budget.js';
import { parseSets } from '../../core/utils/formatters.js';

export function dayDesignWarnings(day, baseDay) {
  const warnings = [];
  const curEx = day.exercises || [];
  const baseEx = baseDay?.exercises || [];
  const baseAnchors = baseEx.filter((ex, i) => (ex[10] || ex.role) === 'anchor_compound').map((ex) => ex[9] || ex.id);
  const curAnchors = curEx.filter((ex, i) => (ex[10] || ex.role) === 'anchor_compound').map((ex) => ex[9] || ex.id);
  const missingAnchors = baseAnchors.filter((id) => !curAnchors.includes(id));
  if (missingAnchors.length) {
    warnings.push({ level: 'danger', text: `Anchor coverage dropped: ${missingAnchors.length} original anchor lift(s) removed.` });
  }
  const highFatigue = curEx.filter((ex) => (ex[1] || ex.type) === 'compound' && fatigueCost(ex) >= 8).length;
  if (highFatigue >= 5) {
    warnings.push({ level: 'warn', text: `Systemic fatigue is high: ${highFatigue} high-fatigue compounds in one session.` });
  }
  if (!warnings.length) {
    warnings.push({ level: 'good', text: 'Session remains coherent.' });
  }
  return warnings;
}
