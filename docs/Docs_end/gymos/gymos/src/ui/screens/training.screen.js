/**
 * GymOS v9 — Training Screen
 * Full weekly split editor with day-jump and guardrails.
 */

import { getState, setState } from '../../app/app-state.js';
import { getDefaultProgram } from '../../data/templates/default-program.js';
import { getProgram } from '../../services/program.service.js';
import { dayDesignWarnings } from '../../engines/coach-engine/warnings.js';
import { sessionKey } from '../../core/models/session.model.js';
import { deepClone } from '../../core/utils/deep-clone.js';
import { getWarmupLibrary, getExerciseLibrary, findLibraryItem } from '../../data/exercises/exercise-library.js';
import { uniqueId } from '../../core/utils/ids.js';

function isLocked(state, dayId) {
  return !!(state.sessionLocks || {})[sessionKey(state.week, dayId)];
}

function parseMuscles(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function musclesToString(arr) {
  return (arr || []).join(', ');
}

function updateProgramDay(state, dayId, updater) {
  if (isLocked(state, dayId)) {
    return { ok: false, error: 'This day is locked for the current week. Unlock session before editing.' };
  }
  const program = getProgram(state);
  const next = deepClone(program);
  const day = next.find((d) => d.id === dayId);
  if (!day) return { ok: false, error: 'Day not found' };
  updater(day);
  return { ok: true, program: next };
}

function setCustomProgram(nextProgram) {
  setState((s) => {
    s.customProgram = nextProgram;
  });
}

function addWarmupToDay(day) {
  const lib = getWarmupLibrary();
  const base = lib[0] || { name: 'New Warm-up', sets: 2, reps: '10–12', role: 'warmup' };
  day.warmup = day.warmup || [];
  day.warmup.push([base.name, Number(base.sets || 2), base.reps || '10–12', uniqueId(`${day.id}_wu`), base.role || 'warmup']);
}

function addExerciseToDay(day) {
  const lib = getExerciseLibrary();
  const base = lib[0] || {
    name: 'New Exercise',
    type: 'compound',
    sets: '3',
    reps: '8–12',
    rir: 'RIR 1–2',
    tempo: '2-1-1',
    primary: [],
    secondary: [],
    substitute: '',
    role: 'hypertrophy_compound',
  };
  day.exercises = day.exercises || [];
  day.exercises.push([
    base.name,
    base.type || 'compound',
    String(base.sets || '3'),
    base.reps || '8–12',
    base.rir || 'RIR 1–2',
    base.tempo || '2-1-1',
    deepClone(base.primary || []),
    deepClone(base.secondary || []),
    base.substitute || '',
    uniqueId(`${day.id}_ex`),
    base.role || 'hypertrophy_compound',
  ]);
}

export function renderTraining(container) {
  const state = getState();
  const program = getProgram(state);
  const baseProgram = getDefaultProgram();
  const focus = state.trainingFocusDayId || state.activeDayId || program[0]?.id || 'd1';
  const showAll = focus === '__all__';
  const showSummary = focus === '__summary__';

  const warmups = getWarmupLibrary();
  const exercises = getExerciseLibrary();

  container.innerHTML = `
    <datalist id="warmup-library">
      ${warmups.map((w) => `<option value="${w.name}"></option>`).join('')}
    </datalist>
    <datalist id="exercise-library">
      ${exercises.map((e) => `<option value="${e.name}"></option>`).join('')}
    </datalist>

    <div class="card">
      <h2>Training days + editor</h2>
      <div class="small">Edit warm-ups and exercises. Guardrails warn about anchor drops and fatigue overload. If a day is session-locked for the current week, it becomes read-only.</div>
    </div>

    <div class="card section">
      <div class="row between">
        <strong>Jump to training day</strong>
        <div class="row" style="gap:8px;">
          <button class="btn ghost" id="collapseDaysBtn">Collapse</button>
          <button class="btn ghost" id="expandDaysBtn">Expand all</button>
        </div>
      </div>
      <div class="jumpScroller" id="dayJump" style="margin-top:10px;"></div>
    </div>

    <div class="section list" id="daysList"></div>
  `;

  // Day jump chips
  const dayJump = container.querySelector('#dayJump');
  program.forEach((d) => {
    const btn = document.createElement('button');
    btn.className = `btn jumpChip ${focus === d.id ? 'secondary' : ''}`;
    btn.textContent = d.name;
    btn.addEventListener('click', () => {
      setState((s) => (s.trainingFocusDayId = d.id));
      requestAnimationFrame(() => container.querySelector(`[data-day-anchor="${d.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
    dayJump.appendChild(btn);
  });

  container.querySelector('#expandDaysBtn')?.addEventListener('click', () => setState((s) => (s.trainingFocusDayId = '__all__')));
  container.querySelector('#collapseDaysBtn')?.addEventListener('click', () => setState((s) => (s.trainingFocusDayId = '__summary__')));

  const daysList = container.querySelector('#daysList');

  program.forEach((day) => {
    const baseDay = baseProgram.find((x) => x.id === day.id);
    const locked = isLocked(state, day.id);
    const expanded = showAll || (!showSummary && focus === day.id);
    const warnings = dayDesignWarnings(day, baseDay);

    const wrap = document.createElement('div');
    wrap.className = `dayCard ${state.activeDayId === day.id ? 'active' : ''}`;
    wrap.dataset.dayAnchor = day.id;

    wrap.innerHTML = `
      <div class="row between">
        <div style="min-width:0;">
          <div style="font-size:15px;font-weight:750;">${day.name}</div>
          <div class="small" style="margin-top:4px;">${day.focus || ''}</div>
        </div>
        <div class="row" style="gap:8px; flex-wrap:wrap;">
          <button class="btn ghost" data-toggle>${expanded ? 'Collapse' : 'Expand'}</button>
          <button class="btn secondary" data-use>Use</button>
        </div>
      </div>

      <div class="badgeRow" style="margin-top:10px;">
        <div class="badge">${(day.exercises || []).length} exercises</div>
        <div class="badge">${(day.warmup || []).length} warm-ups</div>
        <div class="badge ${locked ? '' : 'blue'}">${locked ? 'Locked this week' : 'Editable'}</div>
      </div>

      <div class="${expanded ? '' : 'dayBodyCollapsed'}" style="margin-top:10px;">
        <div class="list">
          ${warnings
            .map((w) => {
              const border =
                w.level === 'danger'
                  ? 'border-color:rgba(255,109,122,.45);'
                  : w.level === 'warn'
                    ? 'border-color:rgba(255,191,71,.45);'
                    : 'border-color:rgba(79,213,168,.35);';
              return `<div class="callout small" style="${border}">${w.text}</div>`;
            })
            .join('')}
          ${locked ? `<div class="callout small" style="border-color:rgba(255,191,71,.45);">This day is locked for Week ${state.week}. Unlock the session on Today to edit it.</div>` : ''}
        </div>

        <div class="toolbar" style="margin-top:10px;">
          <button class="btn" data-add-warmup ${locked ? 'disabled' : ''}>Add warm-up</button>
          <button class="btn" data-add-ex ${locked ? 'disabled' : ''}>Add exercise</button>
          <button class="btn ghost" data-reset ${locked ? 'disabled' : ''}>Reset day</button>
        </div>

        <div class="section">
          <h3>Warm-ups</h3>
          <div class="list">
            ${(day.warmup || [])
              .map(
                (w, idx) => `
              <div class="exercise">
                <div class="exHead">
                  <div>
                    <div class="exName">Warm-up ${idx + 1}</div>
                    <div class="small">Low-fatigue prep</div>
                  </div>
                  <div class="tag">${w[1]} sets</div>
                </div>
                <div class="exBody">
                  <div class="miniGrid">
                    <div class="chipInput"><label>Name</label><input ${locked ? 'disabled' : ''} list="warmup-library" data-kind="warmup" data-field="name" data-day="${day.id}" data-index="${idx}" value="${w[0]}"></div>
                    <div class="chipInput"><label>Sets</label><input ${locked ? 'disabled' : ''} type="number" min="1" max="6" data-kind="warmup" data-field="sets" data-day="${day.id}" data-index="${idx}" value="${w[1]}"></div>
                    <div class="chipInput"><label>Reps / duration</label><input ${locked ? 'disabled' : ''} data-kind="warmup" data-field="reps" data-day="${day.id}" data-index="${idx}" value="${w[2]}"></div>
                  </div>
                  <div class="toolbar">
                    <button class="btn ghost" data-move="up" data-kind="warmup" data-day="${day.id}" data-index="${idx}" ${locked || idx === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn ghost" data-move="down" data-kind="warmup" data-day="${day.id}" data-index="${idx}" ${locked || idx === day.warmup.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn ghost" data-remove data-kind="warmup" data-day="${day.id}" data-index="${idx}" ${locked ? 'disabled' : ''}>Remove</button>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="section">
          <h3>Main exercises</h3>
          <div class="list">
            ${(day.exercises || [])
              .map(
                (ex, idx) => `
              <div class="exercise">
                <div class="exHead">
                  <div>
                    <div class="exName">${ex[0]}</div>
                    <div class="exTags">
                      <span class="tag blue">${ex[10] || ''}</span>
                      <span class="tag">${ex[1]}</span>
                      <span class="tag good">${(ex[6] || []).join(' • ') || 'General'}</span>
                    </div>
                  </div>
                </div>
                <div class="exBody">
                  <div class="miniGrid">
                    <div class="chipInput"><label>Name</label><input ${locked ? 'disabled' : ''} list="exercise-library" data-kind="main" data-field="name" data-day="${day.id}" data-index="${idx}" value="${ex[0]}"></div>
                    <div class="chipInput"><label>Type</label>
                      <select ${locked ? 'disabled' : ''} data-kind="main" data-field="type" data-day="${day.id}" data-index="${idx}">
                        <option value="compound" ${ex[1] === 'compound' ? 'selected' : ''}>Compound</option>
                        <option value="isolation" ${ex[1] === 'isolation' ? 'selected' : ''}>Isolation</option>
                        <option value="mobility" ${ex[1] === 'mobility' ? 'selected' : ''}>Mobility</option>
                      </select>
                    </div>
                    <div class="chipInput"><label>Sets</label><input ${locked ? 'disabled' : ''} type="number" min="1" max="8" data-kind="main" data-field="sets" data-day="${day.id}" data-index="${idx}" value="${ex[2]}"></div>
                    <div class="chipInput"><label>Reps</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="reps" data-day="${day.id}" data-index="${idx}" value="${ex[3]}"></div>
                    <div class="chipInput"><label>RIR</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="rir" data-day="${day.id}" data-index="${idx}" value="${ex[4]}"></div>
                    <div class="chipInput"><label>Tempo</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="tempo" data-day="${day.id}" data-index="${idx}" value="${ex[5]}"></div>
                    <div class="chipInput"><label>Substitute</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="substitute" data-day="${day.id}" data-index="${idx}" value="${ex[8] || ''}"></div>
                    <div class="chipInput" style="grid-column:1 / -1;"><label>Primary muscles (comma separated)</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="primary" data-day="${day.id}" data-index="${idx}" value="${musclesToString(ex[6])}"></div>
                    <div class="chipInput" style="grid-column:1 / -1;"><label>Secondary muscles (comma separated)</label><input ${locked ? 'disabled' : ''} data-kind="main" data-field="secondary" data-day="${day.id}" data-index="${idx}" value="${musclesToString(ex[7])}"></div>
                  </div>
                  <div class="toolbar">
                    <button class="btn ghost" data-move="up" data-kind="main" data-day="${day.id}" data-index="${idx}" ${locked || idx === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn ghost" data-move="down" data-kind="main" data-day="${day.id}" data-index="${idx}" ${locked || idx === day.exercises.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn ghost" data-remove data-kind="main" data-day="${day.id}" data-index="${idx}" ${locked ? 'disabled' : ''}>Remove</button>
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    // Expand/collapse + use
    wrap.querySelector('[data-toggle]')?.addEventListener('click', () => {
      setState((s) => {
        s.trainingFocusDayId = showAll || focus === day.id ? '__summary__' : day.id;
      });
    });
    wrap.querySelector('[data-use]')?.addEventListener('click', () => {
      setState((s) => (s.activeDayId = day.id));
    });

    // Actions
    wrap.querySelector('[data-add-warmup]')?.addEventListener('click', () => {
      const res = updateProgramDay(getState(), day.id, (d) => addWarmupToDay(d));
      if (res.ok) setCustomProgram(res.program);
    });
    wrap.querySelector('[data-add-ex]')?.addEventListener('click', () => {
      const res = updateProgramDay(getState(), day.id, (d) => addExerciseToDay(d));
      if (res.ok) setCustomProgram(res.program);
    });
    wrap.querySelector('[data-reset]')?.addEventListener('click', () => {
      const res = updateProgramDay(getState(), day.id, (d) => {
        const base = baseProgram.find((x) => x.id === day.id);
        if (!base) return;
        d.warmup = deepClone(base.warmup || []);
        d.exercises = deepClone(base.exercises || []);
        d.focus = base.focus;
        d.notes = base.notes;
      });
      if (res.ok) setCustomProgram(res.program);
    });

    // Remove/move handlers
    wrap.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dayId = btn.getAttribute('data-day');
        const kind = btn.getAttribute('data-kind');
        const idx = Number(btn.getAttribute('data-index'));
        const res = updateProgramDay(getState(), dayId, (d) => {
          if (kind === 'warmup') d.warmup.splice(idx, 1);
          else d.exercises.splice(idx, 1);
        });
        if (res.ok) setCustomProgram(res.program);
      });
    });
    wrap.querySelectorAll('[data-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dayId = btn.getAttribute('data-day');
        const kind = btn.getAttribute('data-kind');
        const idx = Number(btn.getAttribute('data-index'));
        const dir = btn.getAttribute('data-move') === 'up' ? -1 : 1;
        const res = updateProgramDay(getState(), dayId, (d) => {
          const arr = kind === 'warmup' ? d.warmup : d.exercises;
          const to = idx + dir;
          if (to < 0 || to >= arr.length) return;
          [arr[idx], arr[to]] = [arr[to], arr[idx]];
        });
        if (res.ok) setCustomProgram(res.program);
      });
    });

    // Field edits (on blur / change)
    wrap.querySelectorAll('input[data-field], select[data-field]').forEach((el) => {
      const handler = () => {
        const dayId = el.getAttribute('data-day');
        const kind = el.getAttribute('data-kind');
        const field = el.getAttribute('data-field');
        const idx = Number(el.getAttribute('data-index'));

        const res = updateProgramDay(getState(), dayId, (d) => {
          if (kind === 'warmup') {
            const row = d.warmup[idx];
            if (!row) return;
            if (field === 'name') {
              row[0] = el.value.trim() || row[0];
              const lib = findLibraryItem(row[0], 'warmup');
              if (lib) {
                row[1] = Number(lib.sets || row[1] || 2);
                row[2] = lib.reps || row[2] || '10–12';
                row[4] = row[4] || lib.role || 'warmup';
              }
            } else if (field === 'sets') row[1] = Math.max(1, Number(el.value || 1));
            else if (field === 'reps') row[2] = el.value;
          } else {
            const row = d.exercises[idx];
            if (!row) return;
            if (field === 'name') {
              row[0] = el.value.trim() || row[0];
              const lib = findLibraryItem(row[0], 'main');
              if (lib) {
                row[1] = lib.type || row[1] || 'compound';
                row[2] = String(lib.sets || row[2] || '3');
                row[3] = lib.reps || row[3] || '8–12';
                row[4] = lib.rir || row[4] || 'RIR 1–2';
                row[5] = lib.tempo || row[5] || '2-1-1';
                row[6] = deepClone(lib.primary || row[6] || []);
                row[7] = deepClone(lib.secondary || row[7] || []);
                row[8] = lib.substitute || row[8] || '';
                row[10] = row[10] || lib.role || row[10] || 'hypertrophy_compound';
              }
            } else if (field === 'type') row[1] = el.value;
            else if (field === 'sets') row[2] = String(Math.max(1, Number(el.value || 1)));
            else if (field === 'reps') row[3] = el.value;
            else if (field === 'rir') row[4] = el.value;
            else if (field === 'tempo') row[5] = el.value;
            else if (field === 'substitute') row[8] = el.value;
            else if (field === 'primary') row[6] = parseMuscles(el.value);
            else if (field === 'secondary') row[7] = parseMuscles(el.value);
          }
        });

        if (res.ok) setCustomProgram(res.program);
      };

      if (el.tagName === 'SELECT') el.addEventListener('change', handler);
      else el.addEventListener('blur', handler);
    });

    daysList.appendChild(wrap);
  });
}

