/**
 * GymOS v9 — Nutrition Screen
 * Shows computed targets and allows editing base nutrition.
 */

import { getState, setState } from '../../app/app-state.js';
import { getProgram, getActiveDay } from '../../services/program.service.js';
import { normalizeWeekType, WEEK_TYPE_LABELS } from '../../core/constants/week-types.js';
import { calorieTarget } from '../../engines/nutrition-engine/calorie-target.js';
import { macroTargets } from '../../engines/nutrition-engine/macro-targets.js';
import { hydrationTarget } from '../../engines/nutrition-engine/hydration-target.js';
import { preWorkoutTiming, postWorkoutTiming } from '../../engines/nutrition-engine/meal-timing.js';

function dayTypeFromGroup(group) {
  if (String(group || '').includes('lower')) return 'lower';
  if (String(group || '').includes('recovery')) return 'recovery';
  return 'training';
}

function macroKcal({ protein = 0, carbs = 0, fat = 0 }) {
  return protein * 4 + carbs * 4 + fat * 9;
}

export function renderNutrition(container) {
  const state = getState();
  const program = getProgram(state);
  const day = getActiveDay(state, program);
  const measure = (state.measures || [])[state.week - 1] || {};
  const weekType = normalizeWeekType(measure.weekType || 'auto');
  const base = state.nutrition || {};

  const dayType = dayTypeFromGroup(day.group);
  const calories = calorieTarget(base.calories, weekType);
  const macros = macroTargets(base, weekType, dayType);
  const water = hydrationTarget(base.water, weekType);
  const pre = preWorkoutTiming(dayType === 'lower' ? 'lower' : 'upper');
  const post = postWorkoutTiming(weekType);

  const kcalFromMacros = macroKcal({ protein: macros.protein, carbs: macros.carbs, fat: macros.fat });
  const diff = calories - kcalFromMacros;

  container.innerHTML = `
    <div class="card">
      <h2>Nutrition</h2>
      <div class="small">Targets are adjusted by week type and training day type.</div>
      <div class="grid2" style="margin-top:12px;">
        <div class="slot"><label>Calories today</label><div class="v">${calories}</div></div>
        <div class="slot"><label>Week type</label><div class="v">${WEEK_TYPE_LABELS[weekType] || 'Auto'}</div></div>
        <div class="slot"><label>Protein</label><div class="v">${macros.protein}g</div></div>
        <div class="slot"><label>Carbs</label><div class="v">${macros.carbs}g</div></div>
        <div class="slot"><label>Fat</label><div class="v">${macros.fat}g</div></div>
        <div class="slot"><label>Water</label><div class="v">${water.toFixed(1)}L</div></div>
      </div>
      <div class="badgeRow">
        <div class="badge blue">Week ${state.week}</div>
        <div class="badge">${dayType}</div>
        <div class="badge">${day.name}</div>
      </div>
    </div>

    <div class="card section">
      <h2>Meal timing</h2>
      <div class="grid2">
        <div class="slot"><label>Pre-workout</label><div class="small">${pre}</div></div>
        <div class="slot"><label>Post-workout</label><div class="small">${post}</div></div>
      </div>
    </div>

    <div class="card section">
      <h2>Base targets (editable)</h2>
      <div class="miniGrid">
        <div class="chipInput"><label>Calories</label><input type="number" id="nutCalories" value="${base.calories ?? 2000}"></div>
        <div class="chipInput"><label>Protein (g)</label><input type="number" id="nutProtein" value="${base.protein ?? 160}"></div>
        <div class="chipInput"><label>Carbs (g)</label><input type="number" id="nutCarbs" value="${base.carbs ?? 180}"></div>
        <div class="chipInput"><label>Fat (g)</label><input type="number" id="nutFat" value="${base.fat ?? 60}"></div>
        <div class="chipInput"><label>Training-day carbs</label><input type="number" id="nutTrainCarbs" value="${base.trainingDayCarbs ?? 180}"></div>
        <div class="chipInput"><label>Rest-day carbs</label><input type="number" id="nutRestCarbs" value="${base.restDayCarbs ?? 140}"></div>
        <div class="chipInput"><label>Water (L)</label><input type="number" step="0.1" id="nutWater" value="${base.water ?? 3}"></div>
        <div class="chipInput"><label>Steps target</label><input type="number" id="nutSteps" value="${base.steps ?? 8000}"></div>
        <div class="chipInput"><label>Meals</label><input type="number" id="nutMeals" value="${base.meals ?? 4}"></div>
        <div class="chipInput" style="grid-column:1 / -1;"><label>Notes</label><textarea id="nutNotes">${base.notes || ''}</textarea></div>
      </div>
      <div class="toolbar" style="margin-top:10px;">
        <button class="btn primary" id="saveNutritionBtn">Save nutrition</button>
      </div>
      <div class="divider"></div>
      <div class="small">Macro kcal from computed targets: ${kcalFromMacros} kcal • Difference vs calories ${diff >= 0 ? '+' : ''}${diff}</div>
    </div>
  `;

  container.querySelector('#saveNutritionBtn')?.addEventListener('click', () => {
    const getNum = (id, fallback) => {
      const v = Number(container.querySelector(id)?.value);
      return Number.isFinite(v) ? v : fallback;
    };
    setState((s) => {
      s.nutrition = {
        calories: getNum('#nutCalories', 2000),
        protein: getNum('#nutProtein', 160),
        carbs: getNum('#nutCarbs', 180),
        fat: getNum('#nutFat', 60),
        trainingDayCarbs: getNum('#nutTrainCarbs', 180),
        restDayCarbs: getNum('#nutRestCarbs', 140),
        water: getNum('#nutWater', 3),
        steps: getNum('#nutSteps', 8000),
        meals: getNum('#nutMeals', 4),
        notes: String(container.querySelector('#nutNotes')?.value || ''),
      };
    });
  });
}

