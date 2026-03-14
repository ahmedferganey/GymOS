/**
 * GymOS v9 — Recovery Screen
 * Weekly recovery log + prescriptions.
 */

import { getState, setState } from '../../app/app-state.js';
import { getProgram, getActiveDay } from '../../services/program.service.js';
import { normalizeWeekType, WEEK_TYPE_LABELS } from '../../core/constants/week-types.js';
import { fatigueBreakdown } from '../../engines/readiness-engine/systemic-fatigue.js';
import { localMuscleFatigueMap, classifyLocalFatigue } from '../../engines/readiness-engine/local-fatigue.js';
import { computeReadinessScore, readinessLabel } from '../../engines/readiness-engine/readiness-score.js';
import { sleepTarget } from '../../engines/recovery-engine/sleep-target.js';
import { cardioRecommendation } from '../../engines/recovery-engine/cardio-recommendation.js';
import { mobilityRecommendation } from '../../engines/recovery-engine/mobility-recommendation.js';
import { saunaRecommendation, steamRecommendation } from '../../engines/recovery-engine/sauna-steam.js';
import { hydrationTarget } from '../../engines/nutrition-engine/hydration-target.js';

export function renderRecovery(container) {
  const state = getState();
  const program = getProgram(state);
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
  const ready = computeReadinessScore(bd.total, dayLocal);

  const rx = {
    sleep: sleepTarget(weekType, ready),
    cardio: cardioRecommendation(day, state.phase),
    mobility: mobilityRecommendation(day.id),
    sauna: saunaRecommendation(weekType),
    steam: steamRecommendation(weekType),
    hydration: `${hydrationTarget(state.nutrition?.water ?? 3, weekType).toFixed(1)} L`,
  };

  const entry = (state.recoveryLog || {})[state.week] || { sleep: '', soreness: '', stress: '', water: '', sauna: '', steam: '', steps: '', notes: '' };

  const topLocal = Object.entries(localMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([m, score]) => ({ m, score, label: classifyLocalFatigue(score) }));

  container.innerHTML = `
    <div class="card">
      <h2>Recovery</h2>
      <div class="small">Readiness + systemic fatigue + weekly recovery log.</div>
      <div class="grid2" style="margin-top:12px;">
        <div class="slot"><label>Readiness</label><div class="v">${ready}</div><div class="small">${readinessLabel(ready)}</div></div>
        <div class="slot"><label>Systemic fatigue</label><div class="v">${bd.total}</div></div>
      </div>
      <div class="badgeRow">
        <div class="badge blue">Week ${state.week}</div>
        <div class="badge">${WEEK_TYPE_LABELS[weekType] || 'Auto'}</div>
        <div class="badge">${day.name}</div>
      </div>
    </div>

    <div class="card section">
      <h2>Prescription</h2>
      <div class="grid2">
        <div class="slot"><label>Sleep target</label><div class="v">${rx.sleep}</div></div>
        <div class="slot"><label>Hydration target</label><div class="v">${rx.hydration}</div></div>
        <div class="slot"><label>Cardio</label><div class="v">${rx.cardio.minutes} min</div><div class="small">${rx.cardio.type}</div></div>
        <div class="slot"><label>Mobility</label><div class="v">${rx.mobility}</div></div>
        <div class="slot"><label>Sauna</label><div class="small">${rx.sauna}</div></div>
        <div class="slot"><label>Steam</label><div class="small">${rx.steam}</div></div>
      </div>
    </div>

    <div class="card section">
      <h2>Weekly recovery log (averages)</h2>
      <div class="miniGrid" style="margin-top:12px;">
        <div class="chipInput"><label>Sleep avg (h)</label><input type="number" step="0.1" id="recSleep" value="${entry.sleep}"></div>
        <div class="chipInput"><label>Soreness / 10</label><input type="number" step="1" id="recSoreness" value="${entry.soreness}"></div>
        <div class="chipInput"><label>Stress / 10</label><input type="number" step="1" id="recStress" value="${entry.stress}"></div>
        <div class="chipInput"><label>Water avg (L)</label><input type="number" step="0.1" id="recWater" value="${entry.water}"></div>
        <div class="chipInput"><label>Sauna sessions</label><input type="number" step="1" id="recSauna" value="${entry.sauna}"></div>
        <div class="chipInput"><label>Steam sessions</label><input type="number" step="1" id="recSteam" value="${entry.steam}"></div>
        <div class="chipInput"><label>Steps avg</label><input type="number" step="100" id="recSteps" value="${entry.steps}"></div>
        <div class="chipInput" style="grid-column:1 / -1;"><label>Notes</label><textarea id="recNotes">${entry.notes || ''}</textarea></div>
      </div>
      <div class="toolbar" style="margin-top:10px;">
        <button class="btn primary" id="saveRecoveryBtn">Save recovery log</button>
      </div>
    </div>

    <div class="card section">
      <h2>Local muscle fatigue (top)</h2>
      <div class="list">
        ${
          topLocal.length
            ? topLocal.map((x) => `
              <div class="dayCard">
                <div class="row between">
                  <div><strong>${x.m}</strong><div class="small">${x.label}</div></div>
                  <div class="small">${x.score}</div>
                </div>
              </div>
            `).join('')
            : `<div class="dayCard"><div class="small">No local fatigue signal yet.</div></div>`
        }
      </div>
    </div>
  `;

  container.querySelector('#saveRecoveryBtn')?.addEventListener('click', () => {
    const v = (id) => String(container.querySelector(id)?.value || '');
    setState((s) => {
      s.recoveryLog = s.recoveryLog || {};
      s.recoveryLog[s.week] = {
        sleep: v('#recSleep'),
        soreness: v('#recSoreness'),
        stress: v('#recStress'),
        water: v('#recWater'),
        sauna: v('#recSauna'),
        steam: v('#recSteam'),
        steps: v('#recSteps'),
        notes: v('#recNotes'),
      };
    });
  });
}

