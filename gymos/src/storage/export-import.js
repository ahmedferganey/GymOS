/**
 * GymOS v9 — Export / Import
 */

import { getState } from '../app/app-state.js';
import { saveState } from './local-storage.js';
import { CURRENT_SCHEMA_VERSION } from './schema-version.js';

export function exportState() {
  const state = getState();
  const blob = JSON.stringify({ ...state, schemaVersion: CURRENT_SCHEMA_VERSION }, null, 2);
  return blob;
}

export function exportDownload(filename = 'gymos_v9_state.json') {
  const blob = new Blob([exportState()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importState(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return { success: false, error: 'Invalid JSON' };
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
