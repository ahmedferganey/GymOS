/**
 * GymOS v9 — Default 7-Day Program
 * v8-style format for compatibility; program engine converts to models
 * Structure: day.warmup = [[name, sets, reps, id?, role?], ...]
 *           day.exercises = [[name, type, sets, reps, rir, tempo, primary[], secondary[], substitute, id?, role?], ...]
 */

import { warmupId, exerciseId } from '../../core/utils/ids.js';
import { deepClone } from '../../core/utils/deep-clone.js';

function defaultExerciseRole(ex, idx = 0) {
  const type = ex[1] || 'compound';
  if (type === 'mobility') return 'mobility';
  if (type === 'isolation') return idx >= 5 ? 'finisher' : 'isolation';
  return idx <= 1 ? 'anchor_compound' : 'hypertrophy_compound';
}

function stampDay(day) {
  day.warmup = (day.warmup || []).map((w, idx) => {
    const item = [...w];
    item[3] = item[3] || warmupId(day.id, item[0], idx);
    item[4] = item[4] || 'warmup';
    return item;
  });
  day.exercises = (day.exercises || []).map((ex, idx) => {
    const item = [...ex];
    item[9] = item[9] || exerciseId(day.id, item[0], idx);
    item[10] = item[10] || defaultExerciseRole(item, idx);
    return item;
  });
  return day;
}

const RAW_DAYS = [
  {
    id: 'd1',
    name: 'Day 1 — Upper Neural Primer',
    focus: 'Heavy-but-clean upper pressing and pulling with tighter CNS control.',
    group: 'upperHeavy',
    cardio: { type: 'Incline Walk (Zone 2)', minutes: 15 },
    warmup: [
      ['Hip Thrust (bodyweight)', 2, '12–15'],
      ['Dead Bug', 2, '8–10 / side'],
      ['Band Pull-Apart', 2, '15–20'],
      ['Scap Push-Up', 2, '10–12'],
      ['Arm Circles', 2, '20s each way'],
    ],
    notes: 'Use Day 1 as neural work: no missed reps, long compound rests.',
    exercises: [
      ['Incline Barbell Press', 'compound', '5', '5', 'RIR 2', '2-1-1', ['Upper chest'], ['Front delts', 'Triceps'], 'Smith Incline Press • Incline DB Press'],
      ['Pull-Up Progression (Assisted/Band)', 'compound', '5', '5', 'RIR 2', '2-1-1', ['Lats'], ['Biceps', 'Upper back'], 'Wide-Grip Lat Pulldown • Negative Pull-Ups'],
      ['Barbell Bent-Over Row', 'compound', '4', '6', 'RIR 1–2', '2-1-1', ['Upper back'], ['Lats', 'Biceps'], 'Chest-Supported Row • T-Bar Row'],
      ['Flat Dumbbell Press', 'compound', '3', '6', 'RIR 1–2', '2-1-1', ['Chest'], ['Triceps'], 'Smith Flat Press • Machine Chest Press'],
      ['Weighted Chest Dips', 'compound', '3', '6–10', 'RIR 1–2', '2-1-1', ['Lower chest'], ['Triceps', 'Front delts'], 'Assisted chest dip • Decline press'],
      ['Machine Chest Press (Flat)', 'compound', '3', '8–10', 'RIR 1–2', '2-1-1', ['Mid chest'], ['Triceps'], 'Smith Flat Press'],
      ['Chest-Supported Row (upper-back bias)', 'compound', '3', '8–10', 'RIR 1–2', '2-1-1', ['Upper back'], ['Rear delts', 'Biceps'], 'Seal row • Machine high row'],
      ['Neutral-Grip Lat Pulldown', 'compound', '3', '8–12', 'RIR 1–2', '2-1-1', ['Lats'], ['Biceps', 'Upper back'], 'Neutral-grip pull-up • MAG pulldown'],
    ],
  },
  {
    id: 'd2',
    name: 'Day 2 — Lat Width Specialization',
    focus: 'V-taper width plus lat/upper-back row balance, then direct triceps hypertrophy.',
    group: 'upperHypertrophy',
    cardio: { type: 'Row Machine (steady)', minutes: 15 },
    warmup: [
      ['Glute Bridge', 2, '15'],
      ['90/90 Hip Rotation', 2, '8 / side'],
      ['Cat-Cow', 2, '8–10'],
      ['Band Straight-Arm Pulldown', 2, '12–15'],
      ['Scap Pull-Up / Hang', 2, '6–8'],
    ],
    notes: 'Controlled eccentrics and moderate rests.',
    exercises: [
      ['Wide-Grip Lat Pulldown', 'compound', '4', '8–12', 'RIR 1–2', '2-1-1', ['Lats'], ['Upper back'], 'Pull-Up Progression'],
      ['EZ-Bar Seated Cable Row', 'compound', '4', '10–12', 'RIR 1–2', '2-1-1', ['Lower lats'], ['Lats'], 'One-arm cable row (lat bias)'],
      ['Cable Lat Prayer (Kneeling Lat Pulldown)', 'isolation', '3', '12–15', 'RIR 0–1', '2-1-2', ['Lower lats'], ['Lats', 'Serratus'], 'Rope straight-arm pulldown • DB pullover'],
      ['Chest-Supported Row', 'compound', '3', '8–12', 'RIR 1–2', '2-1-1', ['Upper back'], ['Lats'], 'T-Bar Row (chest supported)'],
      ['T-Bar Row (lat bias)', 'compound', '4', '8–12', 'RIR 1–2', '2-1-1', ['Upper back'], ['Lats'], 'Chest-supported T-bar • Machine high row'],
      ['T-Bar Row (Narrow Grip – upper back bias)', 'compound', '3', '8–12', 'RIR 1–2', '2-1-1', ['Upper back'], ['Lats', 'Biceps'], 'Chest-supported T-bar • Machine low row'],
      ['Single Flat-Bench Dumbbell Triceps Extension', 'isolation', '4', '12', 'RIR 1–2', '2-1-2', ['Triceps'], [], 'Single-arm cable extension • DB skullcrusher'],
      ['EZ-Bar Skullcrusher (Flat Bench)', 'isolation', '3', '10', 'RIR 1–2', '2-1-2', ['Triceps'], [], 'Flat-bar skullcrusher • Machine extension'],
      ['Rope Pushdown', 'isolation', '3', '15', 'RIR 0–1', '2-1-2', ['Triceps'], [], 'V-bar pushdown • Straight-bar pushdown'],
      ['Single-Arm Cable Pushdown', 'isolation', '3', '10', 'RIR 1', '2-1-2', ['Triceps'], [], 'Reverse-grip pushdown • Cable kickback'],
    ],
  },
  {
    id: 'd3',
    name: 'Day 3 — Lower Power',
    focus: 'Quads strength with posterior chain support.',
    group: 'lowerHeavy',
    cardio: { type: 'Bike (steady)', minutes: 15 },
    warmup: [
      ['Hip Thrust (bodyweight)', 3, '12'],
      ['Frog Stretch', 2, '30–40s'],
      ['Banded Lateral Walk', 2, '12–15 / side'],
      ['Bodyweight Squat', 2, '10–12'],
      ['Plank', 2, '25–35s'],
    ],
    notes: 'Open the groin, wake glute med, then groove squat mechanics.',
    exercises: [
      ['Smith Squat', 'compound', '5', '5', 'RIR 2', '3-1-1', ['Quads'], ['Glutes', 'Core'], 'High-bar squat (if barbell)'],
      ['Romanian Deadlift', 'compound', '4', '6', 'RIR 1–2', '3-1-1', ['Hamstrings'], ['Glutes', 'Lower back'], 'Stiff-leg deadlift'],
      ['Leg Press (quad bias: low & narrow)', 'compound', '3', '6–10', 'RIR 1–2', '2-1-1', ['Quads'], ['Glutes'], 'Smith front-foot-elevated split squat'],
      ['Lying Leg Curl', 'isolation', '3', '10–15', 'RIR 0–1', '2-1-2', ['Hamstrings'], [], 'Seated leg curl'],
      ['Leg Extension', 'isolation', '3', '12–15', 'RIR 1–2', '2-1-2', ['Quads'], ['Knee stability'], 'Machine quad extension'],
      ['Adductor Machine', 'isolation', '3', '12–15', 'RIR 1–2', '2-1-2', ['Adductors'], ['Groin'], 'Cable adduction'],
      ['Standing Calf Raise', 'isolation', '4', '10–15', 'RIR 0–1', '2-1-2', ['Calves'], [], 'Smith calf raise'],
      ['Cable Crunch', 'isolation', '4', '12–20', 'RIR 0–1', '2-1-2', ['Abs'], [], 'Machine crunch'],
    ],
  },
  {
    id: 'd4',
    name: 'Day 4 — Shoulders + Arms',
    focus: 'Shoulder width, rear-delts, and direct arm hypertrophy with low CNS cost.',
    group: 'upperPump',
    cardio: { type: 'Incline Walk (easy)', minutes: 10 },
    warmup: [
      ['Glute Bridge', 2, '12'],
      ['Dead Bug', 2, '8 / side'],
      ['Band Pull-Apart', 2, '15–20'],
      ['Cable / Band External Rotation', 2, '12–15'],
      ['Light Pushdown + Curl', 2, '12 each'],
    ],
    notes: 'Minimal CNS cost. Chase blood flow, joint position, and shoulder quality.',
    exercises: [
      ['Seated Dumbbell Shoulder Press', 'compound', '4', '6–10', 'RIR 1–2', '2-1-1', ['Shoulders'], ['Triceps'], 'Smith Shoulder Press'],
      ['Dumbbell Lateral Raise', 'isolation', '5', '12–20', 'RIR 0–1', '2-1-2', ['Side delts'], [], 'Cable lateral raise'],
      ['Cable Lateral Raise', 'isolation', '4', '12–20', 'RIR 0–1', '2-1-2', ['Side delts'], [], 'Lean-away lateral raise'],
      ['Rear Delt Fly (machine or cables)', 'isolation', '4', '12–20', 'RIR 0–1', '2-1-2', ['Rear delts'], ['Upper back'], 'Face pull'],
      ['Face Pull', 'isolation', '3', '12–15', 'RIR 0–1', '2-1-2', ['Rear delts'], ['Lower traps'], 'Rear-delt row'],
      ['Hammer Curl', 'isolation', '3', '10–12', 'RIR 0–1', '2-1-2', ['Biceps'], ['Forearms'], 'Incline DB curl'],
      ['Incline Dumbbell Curl', 'isolation', '3', '10–12', 'RIR 1', '2-1-2', ['Biceps'], [], 'Cable curl • EZ-bar curl'],
      ['EZ Bar Preacher Curl', 'isolation', '3', '10–12', 'RIR 1', '2-1-2', ['Biceps'], [], 'Machine preacher curl'],
      ['Cable Curl (Pump Finisher)', 'isolation', '3', '12–15', 'RIR 0–1', '2-1-2', ['Biceps'], ['Forearms'], 'Machine cable curl'],
    ],
  },
  {
    id: 'd5',
    name: 'Day 5 — Upper Chest Specialization',
    focus: 'Upper chest priority with minimal lat maintenance and hypertrophy bias.',
    group: 'upperHypertrophy',
    cardio: { type: 'Jog (easy)', minutes: 15 },
    warmup: [
      ['Hip Thrust (bodyweight)', 2, '12'],
      ['Dead Bug', 2, '8–10 / side'],
      ['Band Pull-Apart', 2, '15–20'],
      ['Scap Push-Up', 2, '10–12'],
      ['Incline Push-Up', 2, '8–10'],
    ],
    notes: 'Strong setup, long range, controlled lowering.',
    exercises: [
      ['Incline Barbell Press', 'compound', '4', '8–10', 'RIR 1–2', '2-1-1', ['Upper chest'], ['Front delts', 'Triceps'], 'Smith Incline Press • Incline DB Press'],
      ['Seated Incline Machine Press', 'compound', '4', '10–12', 'RIR 1–2', '2-1-1', ['Upper chest'], ['Triceps'], 'Incline DB Press'],
      ['Low-to-High Cable Fly', 'isolation', '3', '12–15', 'RIR 0–1', '2-1-2', ['Upper chest'], [], 'Incline cable fly'],
      ['Wide-Grip Lat Pulldown', 'compound', '3', '10–12', 'RIR 1–2', '2-1-1', ['Lats'], ['Upper back'], 'Pull-Ups'],
      ['Pull-Up Progression', 'compound', '3', 'AMRAP', 'Stop @RIR1', '2-1-1', ['Lats'], ['Biceps'], 'Assisted pull-ups'],
      ['Machine Chest Press (Flat)', 'compound', '3', '8–12', 'RIR 1–2', '2-1-1', ['Mid chest'], ['Triceps'], 'Smith Flat Press'],
      ['Incline Dumbbell Fly', 'isolation', '3', '10–12', 'RIR 1', '2-1-2', ['Upper chest'], [], 'Pec deck'],
    ],
  },
  {
    id: 'd6',
    name: 'Day 6 — Athletic Lower + Glutes',
    focus: 'Posterior chain, glutes, work capacity, and athletic lower quality.',
    group: 'lowerAthletic',
    cardio: { type: 'Bike / easy jog', minutes: 20 },
    warmup: [
      ['Hip Thrust (bodyweight)', 2, '15'],
      ['Cossack Squat', 2, '6–8 / side'],
      ['Hip Airplane', 2, '5–6 / side'],
      ['Walking Lunge', 2, '10 / side'],
      ['Bird Dog', 2, '8 / side'],
    ],
    notes: 'Athletic lower day should feel springy, not crushed.',
    exercises: [
      ['Barbell Hip Thrust', 'compound', '4', '6–10', 'RIR 1–2', '2-1-1', ['Glutes'], ['Hamstrings'], 'Smith Hip Thrust'],
      ['Romanian Deadlift', 'compound', '3', '6–10', 'RIR 1–2', '3-1-1', ['Hamstrings'], ['Glutes', 'Lower back'], 'Good morning (light)'],
      ['Leg Press (glute bias: high & wide)', 'compound', '3', '8–12', 'RIR 1–2', '2-1-1', ['Glutes'], ['Quads'], 'Smith reverse lunge'],
      ['Leg Extension (controlled)', 'isolation', '3', '12–15', 'RIR 0–1', '2-1-2', ['Quads'], [], 'Sissy squat (assisted)'],
      ['Lying Leg Curl', 'isolation', '3', '10–15', 'RIR 0–1', '2-1-2', ['Hamstrings'], [], 'Nordic curl (assisted)'],
      ['45° Back Extension (glute bias)', 'compound', '3', '10–15', 'RIR 1–2', '2-1-2', ['Glutes'], ['Lower back'], 'Hip extension machine'],
      ['Standing Calf Raise', 'isolation', '4', '10–15', 'RIR 0–1', '2-1-2', ['Calves'], [], 'Smith calf raise'],
      ['Hanging Leg Raise', 'isolation', '3', '8–15', 'RIR 0–1', '2-1-2', ['Abs'], [], 'Cable knee raise'],
    ],
  },
  {
    id: 'd7',
    name: 'Day 7 — Mobility + Recovery',
    focus: 'Mobility, tissue quality, easy aerobic recovery, pelvic / thoracic / shoulder reset.',
    group: 'recovery',
    cardio: { type: 'Recovery Walk / Bike', minutes: 25 },
    warmup: [
      ['90/90 Hip Flow', 2, '60s / side'],
      ['Frog Stretch', 2, '40s'],
      ['Cat-Cow + T-Spine Reach', 2, '8 / side'],
      ['Band Pull-Apart + ER', 2, '15'],
      ['Breathing Reset', 2, '5 breaths'],
    ],
    notes: 'Finish feeling better than you started.',
    exercises: [
      ['90/90 Hip Flow', 'mobility', '2', '60s / side', 'N/A', 'controlled', ['Hips', 'Pelvis'], [], 'seated 90/90 switches'],
      ['Frog Stretch', 'mobility', '2', '40s', 'N/A', 'controlled', ['Adductors', 'Pelvis'], [], 'sumo rock-back'],
      ['Cat-Cow + T-Spine Reach', 'mobility', '2', '8 / side', 'N/A', 'controlled', ['Spine', 'Upper back'], [], 'thread-the-needle'],
      ['Band Pull-Apart + External Rotation', 'mobility', '2', '15', 'N/A', 'controlled', ['Rear delts', 'Rotator cuff'], [], 'cable external rotation'],
      ['Crocodile Breathing / Dead Bug Reset', 'mobility', '2', '5 breaths + 8 reps', 'N/A', 'controlled', ['Core', 'Pelvis'], [], '90/90 breathing'],
    ],
  },
];

export function getDefaultProgram() {
  return RAW_DAYS.map((d) => stampDay(deepClone(d)));
}
