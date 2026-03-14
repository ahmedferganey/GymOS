/**
 * GymOS v9 — Coach Recommendations
 */

export function getCoachActions(nextWeekType, readiness, loadIntel) {
  const actions = [];
  if (nextWeekType?.includes('deload')) {
    actions.push('Reduce Tier C accessories first, then trim one set from non-priority isolations.');
  }
  if (nextWeekType?.includes('refeed')) {
    actions.push('Raise carbs around lower or heavy upper days and keep sodium / water steady.');
  }
  if (readiness < 60) {
    actions.push('Use conservative top sets, add 15–30s rest, and avoid grinding reps.');
  }
  if (loadIntel?.behind?.length >= 3) {
    actions.push('Multiple lifts are behind expected load. Hold progression jumps and protect technical quality next week.');
  }
  if (loadIntel?.ahead?.length >= 3) {
    actions.push('Several lifts are ahead of forecast. You can push top sets slightly harder on priority compounds.');
  }
  if (!actions.length) {
    actions.push('Keep the plan as written and chase clean rep quality on Tier A lifts.');
  }
  return actions;
}
