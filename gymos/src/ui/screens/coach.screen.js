/**
 * GymOS v9 — Coach Screen
 * Next-week recommendation + actions + warnings + expected-load comparisons.
 */

import { getState } from '../../app/app-state.js';
import { getProgram, getActiveDay } from '../../services/program.service.js';
import { normalizeWeekType, WEEK_TYPE_LABELS } from '../../core/constants/week-types.js';
import { fatigueBreakdown } from '../../engines/readiness-engine/systemic-fatigue.js';
import { localMuscleFatigueMap } from '../../engines/readiness-engine/local-fatigue.js';
import { computeReadinessScore, readinessLabel } from '../../engines/readiness-engine/readiness-score.js';
import { nextWeekRecommendation } from '../../engines/coach-engine/next-week-strategy.js';
import { getCoachActions } from '../../engines/coach-engine/coach-recommendations.js';
import { dayDesignWarnings } from '../../engines/coach-engine/warnings.js';
import { expectedLoadForWeek } from '../../engines/progression-engine/expected-load.js';
import { performanceDelta } from '../../engines/progression-engine/performance-delta.js';
import { getDefaultProgram } from '../../data/templates/default-program.js';

function buildLoadIntel(state, program) {
  const ahead = [];
  const behind = [];
  program.forEach((day) => {
    (day.exercises || []).forEach((ex, idx) => {
      const expected = expectedLoadForWeek(state.logs || {}, state.week, day.id, idx, ex[1], state.unit);
      const slot = state.logs?.[state.week]?.[day.id]?.[idx] || {};
      const performed = slot.todayLoad || slot.startLoad || slot.nextTarget || '';
      if (!expected || !performed) return;
      const delta = performanceDelta(performed, expected, state.unit);
      if (!delta) return;
      const item = { exercise: ex[0], day: day.name, delta };
      if (delta.status === 'ahead') ahead.push(item);
      else if (delta.status === 'behind') behind.push(item);
    });
  });
  ahead.sort((a, b) => b.delta.ratio - a.delta.ratio);
  behind.sort((a, b) => a.delta.ratio - b.delta.ratio);
  return { ahead: ahead.slice(0, 6), behind: behind.slice(0, 6) };
}

export function renderCoach(container) {
  const state = getState();
  const program = getProgram(state);
  const baseProgram = getDefaultProgram();
  const day = getActiveDay(state, program);

  const measures = state.measures || [];
  const measure = measures[state.week - 1] || {};
  const weekType = normalizeWeekType(measure.weekType || 'auto');

  const bd = fatigueBreakdown(state.recoveryLog || {}, measures, state.nutrition || {}, state.logs || {}, program, state.week);
  const localMap = localMuscleFatigueMap(state.logs || {}, program, state.week);
  const dayLocal = (day.exercises || []).reduce((sum, ex) => {
    const muscles = ex[6] || [];
    const avg = muscles.length ? muscles.reduce((a, m) => a + (localMap[m] || 0), 0) / muscles.length : 0;
    return sum + avg;
  }, 0) / Math.max(1, (day.exercises || []).length);
  const readiness = computeReadinessScore(bd.total, dayLocal);

  const completion = (() => {
    const wk = state.logs?.[state.week] || {};
    let total = 0;
    let done = 0;
    program.forEach((d) => (d.exercises || []).forEach((_, i) => {
      total++;
      if (wk?.[d.id]?.[i]?.done) done++;
    }));
    return total ? Math.round((done / total) * 100) : 0;
  })();

  const next = nextWeekRecommendation(bd, completion, state.week);
  const loadIntel = buildLoadIntel(state, program);
  const actions = getCoachActions(next.type, readiness, loadIntel);

  const activeBaseDay = baseProgram.find((d) => d.id === day.id);
  const warnings = dayDesignWarnings(day, activeBaseDay);

  container.innerHTML = `
    <div class="card">
      <h2>Coach</h2>
      <div class="small">Adaptive decision support from fatigue + readiness + load signal.</div>
      <div class="grid2" style="margin-top:12px;">
        <div class="slot"><label>This week type</label><div class="v">${WEEK_TYPE_LABELS[weekType] || 'Auto'}</div></div>
        <div class="slot"><label>Next week</label><div class="v">${next.label}</div><div class="small">confidence ${next.confidence}</div></div>
        <div class="slot"><label>Readiness</label><div class="v">${readiness}</div><div class="small">${readinessLabel(readiness)}</div></div>
        <div class="slot"><label>Completion</label><div class="v">${completion}%</div></div>
      </div>
      <div class="badgeRow">
        <div class="badge blue">Week ${state.week}</div>
        <div class="badge">${day.name}</div>
      </div>
    </div>

    <div class="card section">
      <h2>What coach sees</h2>
      <div class="small">${next.reasonText}</div>
      <ul class="small" style="padding-left:18px; margin:10px 0 0;">
        ${actions.map((x) => `<li>${x}</li>`).join('')}
      </ul>
    </div>

    <div class="card section">
      <h2>Guardrails (active day)</h2>
      <div class="list">
        ${warnings.map((w) => {
          const border =
            w.level === 'danger'
              ? 'border-color:rgba(255,109,122,.45);'
              : w.level === 'warn'
                ? 'border-color:rgba(255,191,71,.45);'
                : 'border-color:rgba(79,213,168,.35);';
          return `<div class="callout small" style="${border}">${w.text}</div>`;
        }).join('')}
      </div>
    </div>

    <div class="card section">
      <h2>Expected-load intelligence</h2>
      <div class="small">Compares your logged loads to the expected forecast for the week.</div>
      <div class="grid2" style="margin-top:12px;">
        <div class="slot">
          <label>Ahead</label>
          <div class="small">
            ${loadIntel.ahead.length ? loadIntel.ahead.map((x) => `${x.exercise} (${Math.round((x.delta.ratio - 1) * 100)}%)`).join('<br>') : '—'}
          </div>
        </div>
        <div class="slot">
          <label>Behind</label>
          <div class="small">
            ${loadIntel.behind.length ? loadIntel.behind.map((x) => `${x.exercise} (${Math.round((1 - x.delta.ratio) * 100)}%)`).join('<br>') : '—'}
          </div>
        </div>
      </div>
    </div>
  `;
}

