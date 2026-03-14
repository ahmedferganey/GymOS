/**
 * GymOS v9 — Week/Phase Presets
 * From v8 PHASES
 */

export const PHASES = {
  1: {
    id: 1,
    label: 'Phase 1 — Tissue Prep',
    weeks: 'Weeks 1–2',
    loadPct: '~70–78%',
    restComp: '120–150s',
    restIso: '45–60s',
    failure: 'No grinder reps. No compound failure. Isolation only to RIR 1.',
    sauna: '1–2× weekly • 8–10 min',
    steam: 'Optional 1× • 6–8 min',
    cns: 'Build movement quality, tendon readiness, and repeatability.',
  },
  2: {
    id: 2,
    label: 'Phase 2 — Volume Build',
    weeks: 'Weeks 3–4',
    loadPct: '~72–82%',
    restComp: '120–180s',
    restIso: '45–75s',
    failure: '1 hard isolation set may reach RIR 0. Compounds stay RIR 1–2.',
    sauna: '2× weekly • 10–12 min',
    steam: '1× weekly • 8–10 min',
    cns: 'Highest local muscular workload; protect sleep and hydration.',
  },
  3: {
    id: 3,
    label: 'Phase 3 — Neural Build',
    weeks: 'Weeks 5–6',
    loadPct: '~78–88%',
    restComp: '150–210s',
    restIso: '60–75s',
    failure: 'Accessories only. Stop compounds before bar speed dies.',
    sauna: '1–2× weekly • 8–10 min',
    steam: 'Optional light steam only',
    cns: 'Higher neural demand; fewer junk reps, more clean top work.',
  },
  4: {
    id: 4,
    label: 'Phase 4 — Resensitize',
    weeks: 'Weeks 7–8',
    loadPct: '~65–75%',
    restComp: '90–150s',
    restIso: '45–60s',
    failure: 'No failure. Leave 2–3 reps in reserve almost everywhere.',
    sauna: '1–2× weekly • 8 min',
    steam: '1–2× weekly • 8–10 min',
    cns: 'Drop fatigue, restore joints, regain responsiveness.',
  },
  5: {
    id: 5,
    label: 'Phase 5 — Strength Skill',
    weeks: 'Weeks 9–10',
    loadPct: '~80–90%',
    restComp: '180–240s',
    restIso: '60–75s',
    failure: 'No missed reps. One crisp top set, then efficient back-off work.',
    sauna: '1× weekly • 8–10 min',
    steam: 'Optional only after upper days',
    cns: 'Peak coordination and force without digging a recovery hole.',
  },
  6: {
    id: 6,
    label: 'Phase 6 — Peak Cut',
    weeks: 'Weeks 11–12',
    loadPct: '~72–84%',
    restComp: '120–180s',
    restIso: '45–60s',
    failure: 'Pump work okay; compounds stay smooth and submaximal.',
    sauna: '1× weekly • 8–10 min max',
    steam: '1× weekly • 6–8 min',
    cns: 'Keep muscle, protect recovery, bias expenditure with easy cardio.',
  },
};

export function phaseFromWeek(week) {
  return Math.min(6, Math.max(1, Math.ceil((+week || 1) / 2)));
}

export function getPhaseMod(phaseId) {
  return {
    1: { setAdj: 0, cardioAdj: 0, note: 'Base activation volume.' },
    2: { setAdj: 1, cardioAdj: 2, note: 'Add one extra set to the first 1–2 warm-up drills.' },
    3: { setAdj: 0, cardioAdj: -2, note: 'Keep warm-up crisp; save CNS for work sets.' },
    4: { setAdj: -1, cardioAdj: 3, note: 'Reduce fatigue and bias mobility.' },
    5: { setAdj: 0, cardioAdj: -3, note: 'Short sharp primer; long rests before top sets.' },
    6: { setAdj: -1, cardioAdj: 4, note: 'Minimum effective warm-up; expenditure comes from easy cardio.' },
  }[phaseId] || { setAdj: 0, cardioAdj: 0, note: '' };
}
