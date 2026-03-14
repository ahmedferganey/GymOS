/**
 * GymOS v9 — Schema Version
 */

export const CURRENT_SCHEMA_VERSION = 1;

export function getSchemaVersion(data) {
  return data?.schemaVersion ?? 0;
}
