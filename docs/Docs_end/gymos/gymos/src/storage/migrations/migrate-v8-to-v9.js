/**
 * GymOS v9 — Migrate v8 to v9
 */

import { getDefaultProgram } from '../../data/templates/default-program.js';
import { phaseFromWeek } from '../../data/presets/week-presets.js';
import { normalizeWeekType } from '../../core/constants/week-types.js';

export function migrateV8ToV9(v8Data) {
  if (!v8Data || typeof v8Data !== 'object') return null;
  const program = v8Data.customProgram && Array.isArray(v8Data.customProgram) ? v8Data.customProgram : getDefaultProgram();
  const measures = Array.isArray(v8Data.measures) ? v8Data.measures : [];
  const expandedMeasures = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    weight: measures[i]?.weight ?? '',
    waist: measures[i]?.waist ?? '',
    sleep: measures[i]?.sleep ?? '',
    refeed: measures[i]?.refeed ?? '',
    weekType: normalizeWeekType(measures[i]?.weekType ?? 'auto'),
    notes: measures[i]?.notes ?? '',
  }));
  return {
    profileName: v8Data.profileName ?? 'Athlete',
    unit: v8Data.unit ?? 'kg',
    week: Math.max(1, Math.min(12, v8Data.week ?? 1)),
    phase: phaseFromWeek(v8Data.week ?? 1),
    activeDayId: v8Data.activeDayId ?? 'd1',
    screen: v8Data.screen ?? 'today',
    logs: v8Data.logs ?? {},
    nutrition: { ...{ calories: 2000, protein: 160, carbs: 180, fat: 60, steps: 8000, water: 3, meals: 4, trainingDayCarbs: 180, restDayCarbs: 140, notes: '' }, ...v8Data.nutrition },
    measures: expandedMeasures,
    nutritionLog: v8Data.nutritionLog ?? {},
    recoveryLog: v8Data.recoveryLog ?? {},
    prs: v8Data.prs ?? {},
    sessionLocks: v8Data.sessionLocks ?? {},
    customProgram: program,
    trainingFocusDayId: v8Data.trainingFocusDayId ?? v8Data.activeDayId ?? 'd1',
    priorities: v8Data.priorities ?? {},
    schemaVersion: 1,
  };
}
