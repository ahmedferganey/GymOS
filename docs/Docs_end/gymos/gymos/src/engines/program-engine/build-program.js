/**
 * GymOS v9 — Build Program
 */

import { getDefaultProgram } from '../../data/templates/default-program.js';
import { deepClone } from '../../core/utils/deep-clone.js';

export function buildProgramFromTemplate(templateId = 'default') {
  if (templateId === 'default') {
    return getDefaultProgram();
  }
  return getDefaultProgram();
}

export function buildProgramFromCustom(customProgram) {
  if (!customProgram || !Array.isArray(customProgram)) {
    return getDefaultProgram();
  }
  return deepClone(customProgram);
}
