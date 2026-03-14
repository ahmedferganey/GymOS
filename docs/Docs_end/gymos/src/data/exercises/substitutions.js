/**
 * GymOS v9 — Exercise Substitutions
 * Common substitution patterns; full list comes from exercise library
 */

export const SUBSTITUTION_PATTERNS = {
  'Incline Barbell Press': ['Smith Incline Press', 'Incline DB Press'],
  'Pull-Up Progression': ['Wide-Grip Lat Pulldown', 'Negative Pull-Ups', 'Assisted pull-ups'],
  'Barbell Bent-Over Row': ['Chest-Supported Row', 'T-Bar Row'],
  'Smith Squat': ['High-bar squat', 'Leg press'],
  'Romanian Deadlift': ['Stiff-leg deadlift', 'Good morning'],
  'Seated Dumbbell Shoulder Press': ['Smith Shoulder Press', 'Machine shoulder press'],
  'Dumbbell Lateral Raise': ['Cable lateral raise', 'Lean-away lateral raise'],
  'Barbell Hip Thrust': ['Smith Hip Thrust', 'Glute bridge'],
};

export function getSubstitutionsForExercise(exerciseName) {
  return SUBSTITUTION_PATTERNS[exerciseName] || [];
}
