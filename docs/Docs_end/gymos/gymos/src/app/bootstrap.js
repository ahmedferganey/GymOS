/**
 * GymOS v9 — Bootstrap
 * Entry point: initializes app, router, persistence, and screens
 */

import '../../assets/styles/tokens.css';
import '../../assets/styles/base.css';
import '../../assets/styles/layout.css';
import '../../assets/styles/components.css';
import '../../assets/styles/utilities.css';
import { initRouter, navigate } from './router.js';
import { getState, setState, ensureMeasures } from './app-state.js';
import { on } from './event-bus.js';
import { loadState, saveState } from '../storage/local-storage.js';
import { exportDownload } from '../storage/export-import.js';
import { getDefaultProgram } from '../data/templates/default-program.js';
import { phaseFromWeek } from '../data/presets/week-presets.js';
import { lockSession, unlockSession } from '../engines/session-engine/lock-session.js';
import { sessionKey } from '../core/models/session.model.js';
import { renderToday } from '../ui/screens/today.screen.js';
import { renderTraining } from '../ui/screens/training.screen.js';
import { renderProgress } from '../ui/screens/progress.screen.js';
import { renderNutrition } from '../ui/screens/nutrition.screen.js';
import { renderRecovery } from '../ui/screens/recovery.screen.js';
import { renderCoach } from '../ui/screens/coach.screen.js';
import { renderLoadGuide } from '../ui/screens/load-guide.screen.js';
import { getProgram } from '../services/program.service.js';

function $(id) {
  return document.getElementById(id);
}

/**
 * Apply theme (dark/light)
 */
function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  const btn = $('themeBtn');
  if (btn) btn.textContent = next === 'light' ? '☾' : '◐';
  try {
    localStorage.setItem('gymos_theme', next);
  } catch (_) {}
}

/**
 * Show toast message
 */
function toast(msg) {
  const el = $('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 1800);
}

/**
 * Load state from storage or use defaults
 */
function load() {
  const saved = loadState();
  if (saved && typeof saved === 'object') {
    const program = getDefaultProgram();
    setState({
      profileName: saved.profileName ?? 'Athlete',
      unit: saved.unit ?? 'kg',
      week: Math.max(1, Math.min(12, saved.week ?? 1)),
      phase: phaseFromWeek(saved.week ?? 1),
      activeDayId: saved.activeDayId ?? 'd1',
      screen: saved.screen ?? 'today',
      logs: saved.logs ?? {},
      nutrition: { ...{ calories: 2000, protein: 160, carbs: 180, fat: 60, steps: 8000, water: 3, meals: 4, trainingDayCarbs: 180, restDayCarbs: 140, notes: '' }, ...saved.nutrition },
      measures: saved.measures ?? [],
      nutritionLog: saved.nutritionLog ?? {},
      recoveryLog: saved.recoveryLog ?? {},
      prs: saved.prs ?? {},
      sessionLocks: saved.sessionLocks ?? {},
      customProgram: saved.customProgram ?? null,
      trainingFocusDayId: saved.trainingFocusDayId ?? 'd1',
      priorities: saved.priorities ?? {},
    });
    ensureMeasures();
    return;
  }
  ensureMeasures();
}

/**
 * Save state to storage
 */
function save() {
  const state = getState();
  saveState(state);
  toast('Saved');
}

/**
 * Render all screens
 */
function render() {
  const state = getState();
  const program = getProgram(state);

  // Today screen
  const todayEl = $('screen-today');
  if (todayEl) {
    const { day, lock } = renderToday(todayEl);
    todayEl.querySelector('#jumpTrainingBtn')?.addEventListener('click', () => navigate('training'));
    todayEl.querySelector('#saveStateBtn')?.addEventListener('click', save);
    todayEl.querySelector('#exportBtn')?.addEventListener('click', () => {
      exportDownload();
      toast('Exported');
    });
    todayEl.querySelector('#lockSessionBtn')?.addEventListener('click', () => {
      if (lock) {
        setState((s) => {
          const next = unlockSession(s, s.week, day.id);
          Object.assign(s, next);
        });
        toast('Session unlocked');
      } else {
        setState((s) => {
          const next = lockSession(s, day, s.week);
          Object.assign(s, next);
        });
        toast('Session locked');
      }
      render();
    });
  }

  // Training
  const trainingEl = $('screen-training');
  if (trainingEl) renderTraining(trainingEl);

  // Progress
  const progressEl = $('screen-progress');
  if (progressEl) renderProgress(progressEl);

  // Nutrition
  const nutritionEl = $('screen-nutrition');
  if (nutritionEl) renderNutrition(nutritionEl);

  // Recovery
  const recoveryEl = $('screen-recovery');
  if (recoveryEl) renderRecovery(recoveryEl);

  // Coach
  const coachEl = $('screen-coach');
  if (coachEl) renderCoach(coachEl);

  // Load guide
  const loadEl = $('screen-loadguide');
  if (loadEl) renderLoadGuide(loadEl);
}

/**
 * Main bootstrap
 */
function bootstrap() {
  // Theme — apply immediately so body has data-theme before paint
  try {
    const saved = localStorage.getItem('gymos_theme') || 'dark';
    applyTheme(saved);
  } catch (_) {}

  // Theme toggle — use event delegation so it always works
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#themeBtn')) {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
    }
  });

  // Load persisted state
  load();

  // Router — must run before first render so nav clicks work
  initRouter();

  // Initial render
  render();

  // Re-render on state change
  on('state:changed', () => render());

  // Re-render on screen change
  on('screen:changed', () => render());

  console.log('GymOS v9 — Ready');
}

// Run when DOM is ready (modules are deferred, so this is after DOMContentLoaded)
bootstrap();
