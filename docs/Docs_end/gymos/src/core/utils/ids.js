/**
 * GymOS v9 — ID Utilities
 */

/**
 * Slugify string for use in IDs
 */
export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

/**
 * Generate warmup ID
 */
export function warmupId(dayId, name, index) {
  return `${dayId}_wu_${index + 1}_${slugify(name)}`;
}

/**
 * Generate exercise ID
 */
export function exerciseId(dayId, name, index) {
  return `${dayId}_ex_${index + 1}_${slugify(name)}`;
}

/**
 * Generate unique ID with timestamp
 */
export function uniqueId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
