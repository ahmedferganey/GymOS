/**
 * GymOS v9 — Today Screen
 */

import { getState } from '../../app/app-state.js';
import { getProgram, getActiveDay } from '../../services/program.service.js';
import { PHASES, phaseFromWeek } from '../../data/presets/week-presets.js';
import { WEEK_TYPE_LABELS, normalizeWeekType } from '../../core/constants/week-types.js';
import { computeReadinessScore, readinessLabel } from '../../engines/readiness-engine/readiness-score.js';
import { localMuscleFatigueMap, classifyLocalFatigue } from '../../engines/readiness-engine/local-fatigue.js';
import { fatigueBreakdown } from '../../engines/readiness-engine/systemic-fatigue.js';
import { cardioRecommendation } from '../../engines/recovery-engine/cardio-recommendation.js';
import { sessionKey } from '../../core/models/session.model.js';
import { getPhaseMod } from '../../data/presets/week-presets.js';

export function renderToday(container) {
  const state = getState();
  const program = getProgram(state);
  const day = getActiveDay(state, program);
  const phase = PHASES[state.phase] || PHASES[1];
  const phaseMod = getPhaseMod(state.phase);
  const cardio = cardioRecommendation(day, state.phase);
  const lock = (state.sessionLocks || {})[sessionKey(state.week, day.id)];
  const measures = state.measures || [];
  const measure = measures[state.week - 1] || {};
  const weekType = normalizeWeekType(measure.weekType || 'auto');
  const bd = fatigueBreakdown(
    state.recoveryLog || {},
    measures,
    state.nutrition || {},
    state.logs || {},
    program,
    state.week
  );
  const localMap = localMuscleFatigueMap(state.logs || {}, program, state.week);
  const dayLocal = (day.exercises || []).reduce((sum, ex) => {
    const muscles = ex[6] || [];
    const avg = muscles.length ? muscles.reduce((a, m) => a + (localMap[m] || 0), 0) / muscles.length : 0;
    return sum + avg;
  }, 0) / Math.max(1, (day.exercises || []).length);
  const ready = computeReadinessScore(bd.total, dayLocal);

  const warmup = (day.warmup || []).map((w) => {
    const sets = Math.max(1, (w[1] || 2) + (phaseMod?.setAdj || 0));
    return { name: w[0], sets, reps: w[2] };
  });

  const muscles = (day.exercises || []).reduce((acc, ex) => {
    (ex[6] || []).forEach((m) => (acc[m] = (acc[m] || 0) + 1));
    return acc;
  }, {});
  const muscleList = Object.entries(muscles).sort((a, b) => b[1] - a[1]).slice(0, 6);

  container.innerHTML = `
    <div class="hero">
      <div class="row between">
        <div>
          <div class="small">Today</div>
          <div style="font-size:22px;font-weight:800;line-height:1.1;">${day.name}</div>
          <div class="small" style="margin-top:6px;">${day.focus}</div>
        </div>
        <button class="btn secondary" id="jumpTrainingBtn">Open day</button>
      </div>
      <div class="badgeRow">
        <div class="badge blue">${phase.label}</div>
        <div class="badge">Week ${state.week}</div>
        <div class="badge">${WEEK_TYPE_LABELS[weekType] || 'Auto'}</div>
        <div class="badge ${ready >= 68 ? 'good' : ''}">Readiness ${ready}/100</div>
        <div class="badge">${readinessLabel(ready)}</div>
        <div class="badge ${lock ? 'blue' : ''}">${lock ? 'Session locked' : 'Session not locked'}</div>
      </div>
    </div>

    <div class="card section">
      <h2>Session controls</h2>
      <div class="grid2">
        <div class="slot"><label>Week</label><div class="v">${state.week}</div></div>
        <div class="slot"><label>Phase</label><div class="v">${phase.label}</div></div>
        <div class="slot"><label>Active day</label><div class="v">${day.name}</div></div>
      </div>
      <div class="quickActions" style="margin-top:10px;">
        <button class="btn secondary" id="lockSessionBtn">${lock ? 'Finish / unlock session' : 'Start session lock'}</button>
        <button class="btn primary" id="saveStateBtn">Save</button>
        <button class="btn" id="exportBtn">Export JSON</button>
      </div>
    </div>

    <div class="card section">
      <h2>Warm-up</h2>
      <div class="small">${phaseMod?.note || ''}</div>
      <div class="list" style="margin-top:10px;">
        ${warmup.map((w) => `<div class="dayCard"><div class="row between"><strong>${w.name}</strong><span class="small">${w.sets} × ${w.reps}</span></div></div>`).join('')}
      </div>
    </div>

    <div class="card section">
      <h2>Exercises</h2>
      <div class="list" id="todayExercises">
        ${(day.exercises || []).map((ex, i) => `
          <div class="exercise">
            <div class="exHead">
              <div>
                <div class="exName">${ex[0]}</div>
                <div class="exTags">
                  <span class="tag good">${(ex[6] || []).join(' • ') || 'General'}</span>
                  <span class="tag">${ex[1]}</span>
                  <span class="tag blue">${ex[2]} × ${ex[3]}</span>
                  <span class="tag warn">${ex[4]}</span>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card section">
      <h2>Session lane</h2>
      <div class="grid2">
        <div class="slot"><label>Cardio</label><div class="v">${cardio.minutes} min</div><div class="small">${cardio.type}</div></div>
        <div class="slot"><label>Readiness</label><div class="v">${ready}</div><div class="small">${readinessLabel(ready)}</div></div>
      </div>
    </div>

    <div class="card section">
      <h2>Top muscle emphasis</h2>
      <div class="list">
        ${muscleList.map(([m, n]) => `<div><div class="row between"><span>${m}</span><span class="small">${n} drills</span></div></div>`).join('')}
      </div>
    </div>
  `;

  return { container, day, lock };
}
