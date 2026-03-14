/**
 * GymOS v9 — Load Guide Screen
 * Helps choose start load using history and expected load.
 */

import { getState } from '../../app/app-state.js';
import { getProgram, getActiveDay } from '../../services/program.service.js';
import { normalizeWeekType, WEEK_TYPE_LABELS } from '../../core/constants/week-types.js';
import { expectedLoadForWeek } from '../../engines/progression-engine/expected-load.js';
import { suggestNextTarget } from '../../engines/progression-engine/next-target.js';

function findHistoricalLoad(state, dayId, exIndex, uptoWeek) {
  for (let w = Math.max(1, uptoWeek); w >= 1; w--) {
    const slot = state.logs?.[w]?.[dayId]?.[exIndex];
    const load = Number(slot?.todayLoad || slot?.startLoad || 0);
    if (Number.isFinite(load) && load > 0) return { week: w, load };
  }
  return null;
}

function startLoadRule(weekType) {
  if (weekType === 'deload') return 'Deload: start ~85–90% of a normal week load; keep reps crisp.';
  if (weekType === 'refeed') return 'Refeed: start from recent successful load; only push up if bar speed is clearly better.';
  if (weekType === 'refeed_deload' || weekType === 'refeed+deload') return 'Refeed+Deload: use deload loading, treat it as quality practice.';
  return 'Normal: choose a load that matches the prescribed RIR and clean reps.';
}

export function renderLoadGuide(container) {
  const state = getState();
  const program = getProgram(state);
  const day = getActiveDay(state, program);
  const measures = state.measures || [];
  const measure = measures[state.week - 1] || {};
  const weekType = normalizeWeekType(measure.weekType || 'auto');

  const examples = (day.exercises || []).slice(0, 8).map((ex, idx) => {
    const hist = findHistoricalLoad(state, day.id, idx, state.week - 1);
    const expected = expectedLoadForWeek(state.logs || {}, state.week, day.id, idx, ex[1], state.unit);
    const seed = hist?.load || Number(expected) || 0;
    const next = seed ? suggestNextTarget(seed, ex[1], state.phase, weekType, state.unit) : '';
    const source = hist ? `Historical (Week ${hist.week})` : expected ? 'Expected load' : 'No history yet';
    return `
      <div class="dayCard">
        <div class="row between">
          <div style="min-width:0;">
            <strong>${ex[0]}</strong>
            <div class="small">${ex[1]} • ${source}</div>
          </div>
          <div style="text-align:right;">
            <div>${seed ? `${seed} ${state.unit}` : '—'}</div>
            <div class="small">seed</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="grid2">
          <div class="slot"><label>Expected (W${state.week})</label><div class="v">${expected || '—'}</div></div>
          <div class="slot"><label>Next target</label><div class="v">${next || '—'}</div></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="card">
      <h2>Load Guide</h2>
      <div class="small">Choose a sensible start load based on history and the app’s forecast.</div>
      <div class="badgeRow">
        <div class="badge blue">Week ${state.week}</div>
        <div class="badge">${WEEK_TYPE_LABELS[weekType] || 'Auto'}</div>
        <div class="badge">${day.name}</div>
      </div>
    </div>

    <div class="card section">
      <h2>Week-type rule</h2>
      <div class="small">${startLoadRule(weekType)}</div>
    </div>

    <div class="card section">
      <h2>Examples (active day)</h2>
      <div class="list">
        ${examples || `<div class="dayCard"><div class="small">No exercises found.</div></div>`}
      </div>
    </div>
  `;
}

