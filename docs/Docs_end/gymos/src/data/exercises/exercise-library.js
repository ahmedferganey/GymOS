/**
 * GymOS v9 — Exercise Library
 * Built from default program; used for autocomplete and adding exercises
 */

import { getDefaultProgram } from '../templates/default-program.js';
import { deepClone } from '../../core/utils/deep-clone.js';

function defaultExerciseRole(ex, idx = 0) {
  const type = ex[1] || 'compound';
  if (type === 'mobility') return 'mobility';
  if (type === 'isolation') return idx >= 5 ? 'finisher' : 'isolation';
  return idx <= 1 ? 'anchor_compound' : 'hypertrophy_compound';
}

export function buildWarmupLibrary() {
  const map = new Map();
  const program = getDefaultProgram();
  program.forEach((day) => {
    (day.warmup || []).forEach((w) => {
      const name = w[0];
      if (!name || map.has(name.toLowerCase())) return;
      map.set(name.toLowerCase(), {
        name,
        sets: w[1],
        reps: w[2],
        role: w[4] || 'warmup',
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function buildExerciseLibrary() {
  const map = new Map();
  const program = getDefaultProgram();
  program.forEach((day) => {
    (day.exercises || []).forEach((ex, idx) => {
      const name = ex[0];
      if (!name || map.has(name.toLowerCase())) return;
      map.set(name.toLowerCase(), {
        name,
        type: ex[1] || 'compound',
        sets: ex[2],
        reps: ex[3],
        rir: ex[4],
        tempo: ex[5],
        primary: deepClone(ex[6] || []),
        secondary: deepClone(ex[7] || []),
        substitute: ex[8] || '',
        role: ex[10] || defaultExerciseRole(ex, idx),
      });
    });
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

let _warmupLib = null;
let _mainLib = null;

export function getWarmupLibrary() {
  if (!_warmupLib) _warmupLib = buildWarmupLibrary();
  return _warmupLib;
}

export function getExerciseLibrary() {
  if (!_mainLib) _mainLib = buildExerciseLibrary();
  return _mainLib;
}

export function findLibraryItem(name, kind = 'main') {
  const lib = kind === 'warmup' ? getWarmupLibrary() : getExerciseLibrary();
  return lib.find((x) => x.name.toLowerCase() === String(name || '').trim().toLowerCase()) || null;
}
