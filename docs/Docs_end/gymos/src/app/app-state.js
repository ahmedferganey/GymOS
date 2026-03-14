/**
 * GymOS v9 — Application State
 * Centralized reactive state; will be wired to persistence in Phase 6
 */

import { deepClone } from '../core/utils/deep-clone.js';
import { emit } from './event-bus.js';

const DEFAULT_STATE = {
  profileName: 'Athlete',
  unit: 'kg',
  week: 1,
  phase: 1,
  activeDayId: 'd1',
  screen: 'today',
  logs: {},
  nutrition: {
    calories: 2000,
    protein: 160,
    carbs: 180,
    fat: 60,
    steps: 8000,
    water: 3,
    meals: 4,
    trainingDayCarbs: 180,
    restDayCarbs: 140,
    notes: '',
  },
  measures: [],
  nutritionLog: {},
  recoveryLog: {},
  prs: {},
  sessionLocks: {},
  customProgram: null,
  trainingFocusDayId: 'd1',
  priorities: {},
};

let state = deepClone(DEFAULT_STATE);

/**
 * Get current state (read-only copy)
 */
export function getState() {
  return deepClone(state);
}

/**
 * Get a specific key from state
 */
export function get(key) {
  return deepClone(state[key]);
}

/**
 * Update state and emit change event
 * @param {Object|((s: Object) => void)} updates - Object to merge, or updater function
 */
export function setState(updates) {
  if (typeof updates === 'function') {
    updates(state);
  } else {
    Object.assign(state, updates);
  }
  emit('state:changed', { state: getState() });
}

/**
 * Reset state to defaults
 */
export function resetState() {
  state = deepClone(DEFAULT_STATE);
  emit('state:changed', { state: getState() });
}

/**
 * Initialize measures array (12 weeks)
 */
export function ensureMeasures() {
  if (!Array.isArray(state.measures) || state.measures.length !== 12) {
    state.measures = Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      weight: '',
      waist: '',
      sleep: '',
      refeed: '',
      weekType: 'auto',
      notes: '',
    }));
  }
}
