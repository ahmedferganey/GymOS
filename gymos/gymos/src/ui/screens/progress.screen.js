/**
 * GymOS v9 — Progress Screen
 * PRs, completion, and basic analytics derived from logs.
 */

import { getState } from '../../app/app-state.js';
import { getProgram } from '../../services/program.service.js';
import { weekCompletion } from '../../engines/session-engine/session-summary.js';
import { fatigueBreakdown } from '../../engines/readiness-engine/systemic-fatigue.js';
import { localMuscleFatigueMap, classifyLocalFatigue } from '../../engines/readiness-engine/local-fatigue.js';

function getAllLogRows(state, program) {
  const rows = [];
  const logs = state.logs || {};
  Object.entries(logs).forEach(([weekStr, days]) => {
    const week = Number(weekStr);
    program.forEach((day) => {
      const dayLogs = days?.[day.id] || {};
      (day.exercises || []).forEach((ex, idx) => {
        const slot = dayLogs[idx];
        if (!slot) return;
        rows.push({
          week,
          dayId: day.id,
          dayName: day.name,
          exercise: ex[0],
          type: ex[1],
          primary: ex[6] || [],
          todayLoad: Number(slot.todayLoad || 0),
          startLoad: Number(slot.startLoad || 0),
          nextTarget: Number(slot.nextTarget || 0),
          done: !!slot.done,
        });
      });
    });
  });
  return rows;
}

function computePRs(rows, unit) {
  const best = new Map();
  rows.forEach((r) => {
    const load = r.todayLoad || r.startLoad || r.nextTarget;
    if (!load) return;
    const cur = best.get(r.exercise);
    if (!cur || load > cur.load) best.set(r.exercise, { load, week: r.week, dayName: r.dayName, type: r.type });
  });
  return Array.from(best.entries()).sort((a, b) => b[1].load - a[1].load);
}

export function renderProgress(container) {
  const state = getState();
  const program = getProgram(state);
  const completion = weekCompletion(state.logs || {}, program, state.week);
  const bd = fatigueBreakdown(state.recoveryLog || {}, state.measures || [], state.nutrition || {}, state.logs || {}, program, state.week);
  const localMap = localMuscleFatigueMap(state.logs || {}, program, state.week);
  const rows = getAllLogRows(state, program);
  const prs = computePRs(rows, state.unit);

  const topMuscles = Object.entries(localMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([m, score]) => ({ muscle: m, score, label: classifyLocalFatigue(score) }));

  container.innerHTML = `
    <div class="card">
      <h2>Progress</h2>
      <div class="small">Weekly completion, PRs, fatigue, and muscle workload basics.</div>
      <div class="grid2" style="margin-top:12px;">
        <div class="slot"><label>Week completion</label><div class="v">${completion}%</div></div>
        <div class="slot"><label>Systemic fatigue</label><div class="v">${bd.total}</div></div>
      </div>
      <div class="badgeRow">
        <div class="badge blue">Week ${state.week}</div>
        <div class="badge">PRs ${prs.length}</div>
      </div>
    </div>

    <div class="card section">
      <h2>Strongest lifts (PRs)</h2>
      <div class="list">
        ${
          prs.length
            ? prs.slice(0, 12).map(([name, d]) => `
                <div class="dayCard">
                  <div class="row between">
                    <div style="min-width:0;">
                      <strong>${name}</strong>
                      <div class="small">${d.dayName}</div>
                    </div>
                    <div style="text-align:right;">
                      <div>${d.load} ${state.unit}</div>
                      <div class="small">Week ${d.week}</div>
                    </div>
                  </div>
                </div>
              `).join('')
            : `<div class="dayCard"><div class="small">No PR signal yet. Log loads (Today screen) and mark Done.</div></div>`
        }
      </div>
    </div>

    <div class="card section">
      <h2>Local muscle fatigue (top)</h2>
      <div class="list">
        ${
          topMuscles.length
            ? topMuscles.map((m) => `
              <div class="dayCard">
                <div class="row between">
                  <div><strong>${m.muscle}</strong><div class="small">${m.label}</div></div>
                  <div class="small">${m.score}</div>
                </div>
              </div>
            `).join('')
            : `<div class="dayCard"><div class="small">No local fatigue yet. Mark exercises Done to build signal.</div></div>`
        }
      </div>
    </div>

    <div class="card section">
      <h2>Fatigue breakdown</h2>
      <div class="list">
        ${[
          ['Training', bd.training],
          ['Sleep penalty', bd.sleepPenalty],
          ['Soreness penalty', bd.sorenessPenalty],
          ['Stress penalty', bd.stressPenalty],
          ['Hydration penalty', bd.hydrationPenalty],
        ].map(([k, v]) => `
          <div class="dayCard">
            <div class="row between"><strong>${k}</strong><span class="small">${v}</span></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

