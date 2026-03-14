/**
 * GymOS v9 — Local Storage
 */

import { STORAGE_KEY, OLD_KEYS } from '../core/constants/storage-keys.js';
import { migrateV8ToV9 } from './migrations/migrate-v8-to-v9.js';

const memStore = {};

export function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return memStore[key] ?? null;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (_) {
    memStore[key] = value;
    return false;
  }
}

export function loadState() {
  const raw = storageGet(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (data?.schemaVersion >= 1) return data;
      return migrateV8ToV9(data);
    } catch (_) {
      return null;
    }
  }
  for (const key of OLD_KEYS) {
    const oldRaw = storageGet(key);
    if (!oldRaw) continue;
    try {
      const v8 = JSON.parse(oldRaw);
      const migrated = migrateV8ToV9(v8);
      if (migrated) return migrated;
    } catch (_) {}
  }
  return null;
}

export function saveState(state) {
  return storageSet(STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: 1 }));
}
