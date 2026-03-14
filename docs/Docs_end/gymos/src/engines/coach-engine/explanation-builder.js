/**
 * GymOS v9 — Explanation Builder
 */

export function buildCoachExplanation(reasonText, actions) {
  return {
    reason: reasonText || 'Fatigue is in a normal range and recovery inputs look acceptable.',
    actions: actions || ['Keep the plan as written.'],
  };
}
