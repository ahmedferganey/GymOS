/**
 * GymOS v9 — Progression Engine Unit Tests
 */

import { suggestNextTarget } from '../../engines/progression-engine/next-target.js';
import { estimate1RM } from '../../engines/progression-engine/estimate-1rm.js';
import { performanceDelta } from '../../engines/progression-engine/performance-delta.js';

describe('progression-engine', () => {
  describe('suggestNextTarget', () => {
    it('returns empty for invalid load', () => {
      expect(suggestNextTarget('', 'compound', 1)).toBe('');
      expect(suggestNextTarget(0, 'compound', 1)).toBe('');
    });
    it('suggests higher load for valid input', () => {
      const next = suggestNextTarget(100, 'compound', 2, 'normal', 'kg');
      expect(Number(next)).toBeGreaterThan(100);
    });
  });

  describe('estimate1RM', () => {
    it('returns weight for 1 rep', () => {
      expect(estimate1RM(100, 1)).toBe(100);
    });
    it('estimates higher for multiple reps', () => {
      expect(estimate1RM(100, 5)).toBeGreaterThan(100);
    });
  });

  describe('performanceDelta', () => {
    it('returns ahead for ratio >= 1.035', () => {
      const r = performanceDelta(104, 100, 'kg');
      expect(r.status).toBe('ahead');
    });
    it('returns on_track for ratio 0.97-1.035', () => {
      const r = performanceDelta(100, 100, 'kg');
      expect(r.status).toBe('on_track');
    });
    it('returns behind for ratio < 0.97', () => {
      const r = performanceDelta(95, 100, 'kg');
      expect(r.status).toBe('behind');
    });
  });
});
