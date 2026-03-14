# GymOS v9 — Next Steps Build Plan

This document is the **actionable plan** to build GymOS v9, derived from:
- **gym_os_v_9_cursor_readme.md** (architecture, requirements, priority order)
- **GymOS_v8_6_2_day_jump.html** (existing v8.6.2 behavior and data shapes to preserve/migrate)

---

## 1. Reference: What v8.6.2 Already Does

From the HTML prototype, preserve and later reimplement (in modular form):

| Area | v8.6.2 behavior |
|------|------------------|
| **Screens** | Today, Training, Progress, Nutrition, Recovery, Coach, Load Guide (7 tabs) |
| **Program** | 7-day split (Upper Neural Primer, Lat Width, Lower Power, Shoulders+Arms, Upper Chest, Athletic Lower, Mobility+Recovery) with warmup + exercises per day |
| **Exercise shape** | Array: `[name, type, sets, reps, rir, tempo, primary[], secondary[], substitute, id, role]` |
| **State** | profileName, priorities, unit, week, phase, activeDayId, screen, logs, nutrition, measures, nutritionLog, recoveryLog, prs, sessionLocks, customProgram, trainingFocusDayId |
| **Session lock** | Lock/unlock per week+day; snapshot freezes sets/reps/rest/RIR for that session |
| **Week types** | normal, refeed, deload, refeed+deload, auto (effectiveWeekType, smartCoachRecommendation, nextWeekRecommendation) |
| **Phases** | 1–6 from week (phaseFromWeek), phaseExerciseSpec, phaseAwareIncrement, prescribeLoad |
| **Readiness** | readinessScore, localMuscleFatigueMap, fatigueBreakdown, fatigueCost, exerciseTier |
| **Progression** | suggestNext, expectedLoadMap, currentVsExpected, progressionAggressiveness, expectedLoadInsights |
| **Training editor** | Add/remove/reorder warmups & exercises; edit metadata; dayDesignAnalysis guardrails; day jump bar |
| **Persistence** | Single key, load/save, ensureStateSchema, migration from OLD_KEYS, export JSON |

v9 must **preserve** these behaviors while moving to the new folder structure, typed models, and engines.

---

## 2. Implementation Phases (from README, with concrete tasks)

### Phase 1 — Foundation

**Goal:** Project scaffold, routing, app state, constants, utils, models.

| # | Task | Deliverable |
|---|------|-------------|
| 1.1 | Create `gymos/` root with `package.json`, `index.html`, `favicon.ico`, `README.md`, `.gitignore` | Root files |
| 1.2 | Add `assets/styles/`: `tokens.css`, `base.css`, `layout.css`, `components.css`, `utilities.css` (extract/adapt from v8 CSS variables and classes) | CSS layer |
| 1.3 | Implement `src/app/bootstrap.js`, `router.js`, `app-state.js`, `event-bus.js`, `config.js` | App shell |
| 1.4 | Add `src/core/constants/`: `week-types.js`, `day-types.js`, `exercise-methods.js`, `muscle-groups.js`, `storage-keys.js` | Constants |
| 1.5 | Add `src/core/utils/`: `math.js`, `dates.js`, `ids.js`, `deep-clone.js`, `validation.js`, `formatters.js` | Utils |
| 1.6 | Add `src/core/models/`: `athlete.model.js`, `program.model.js`, `training-day.model.js`, `exercise.model.js`, `session.model.js`, `set-entry.model.js`, `recovery.model.js`, `nutrition.model.js`, `progression.model.js` | Models (replace array indices with named fields where applicable) |

**Exit criteria:** App boots, router switches screens, state is centralized; no UI beyond placeholder screens if needed.

---

### Phase 2 — Static Data

**Goal:** Exercise library, muscle map, substitutions, default program, week presets.

| # | Task | Deliverable |
|---|------|-------------|
| 2.1 | `src/data/exercises/`: `exercise-library.js`, `muscle-map.js`, `substitutions.js`, `methodology-presets.js` | Exercise data (derive from v8 PROGRAM + WARMUP_LIBRARY / MAIN_EXERCISE_LIBRARY) |
| 2.2 | `src/data/templates/`: `default-program.js` (7-day split from v8), optionally `swimmer-template.js`, `fighter-template.js`, `hypertrophy-template.js` | Program templates |
| 2.3 | `src/data/presets/`: `week-presets.js`, `recovery-presets.js`, `nutrition-presets.js` (e.g. PHASES, week-type labels) | Presets |

**Exit criteria:** Default program and exercise library load; can be consumed by engines and UI.

---

### Phase 3 — Core Engines

**Goal:** Program, session, and progression logic (pure functions, testable).

| # | Task | Deliverable |
|---|------|-------------|
| 3.1 | **Program engine:** `build-program.js`, `validate-program.js`, `substitute-exercise.js`, `methodology-engine.js`, `fatigue-budget.js` | Program build/validate, methodology, fatigue |
| 3.2 | **Session engine:** `start-session.js`, `lock-session.js`, `log-set.js`, `finish-exercise.js`, `finish-session.js`, `session-summary.js` | Session lifecycle (mirror v8 lock/snapshot/sessionSpec) |
| 3.3 | **Progression engine:** `expected-load.js`, `next-target.js`, `estimate-1rm.js`, `double-progression.js`, `rir-progression.js`, `performance-delta.js` | expected_load, performed_load, next_target, performance_delta (mirror v8 expectedLoadMap, suggestNext, currentVsExpected, progressionAggressiveness) |

**Exit criteria:** Engines can be unit-tested; session lock and progression behavior match v8 semantics.

---

### Phase 4 — Recovery Intelligence

**Goal:** Readiness, recovery, nutrition, and coach decision layer.

| # | Task | Deliverable |
|---|------|-------------|
| 4.1 | **Readiness engine:** `readiness-score.js`, `local-fatigue.js`, `systemic-fatigue.js`, `recovery-status.js`, `autoregulation.js` | Readiness + fatigue (mirror v8 readinessScore, localMuscleFatigueMap, fatigueBreakdown) |
| 4.2 | **Recovery engine:** `sleep-target.js`, `cardio-recommendation.js`, `mobility-recommendation.js`, `sauna-steam.js`, `deload-decision.js` | Recovery prescription (mirror v8 recoveryPrescription, getCardio) |
| 4.3 | **Nutrition engine:** `calorie-target.js`, `macro-targets.js`, `hydration-target.js`, `meal-timing.js`, `refeed-adjustment.js` | Nutrition (mirror v8 nutritionPrescription, week-type adjustments) |
| 4.4 | **Coach engine:** `coach-rules.js`, `coach-recommendations.js`, `next-week-strategy.js`, `warnings.js`, `explanation-builder.js` | Coach (mirror v8 smartCoachRecommendation, nextWeekRecommendation, weeklyCoachReport, expectedLoadInsights) |

**Exit criteria:** Readiness, recovery, nutrition, and next-week type can be computed from state; coach actions and explanations available.

---

### Phase 5 — UI Screens

**Goal:** All 7 screens working end-to-end with real state and engines.

| # | Task | Deliverable |
|---|------|-------------|
| 5.1 | **UI components (common):** `button.js`, `modal.js`, `card.js`, `badge.js`, `tabs.js`, `progress-bar.js`, `toast.js` | Reusable components |
| 5.2 | **UI components (training):** `exercise-card.js`, `exercise-editor.js`, `set-logger.js`, `methodology-chip.js`, `session-header.js`, `day-jump.js` | Training-specific components (day-jump = v8 day jump bar) |
| 5.3 | **UI components (progress, nutrition, recovery, coach):** As per README component list | Remaining component sets |
| 5.4 | **Screens:** `today.screen.js`, `training.screen.js`, `progress.screen.js`, `nutrition.screen.js`, `recovery.screen.js`, `coach.screen.js`, `load-guide.screen.js` | Each screen renders and wires to state + engines |
| 5.5 | **State bindings:** `today.binding.js`, `training.binding.js`, `progress.binding.js`, `coach.binding.js` | Connect UI events to app-state and persistence |

**Exit criteria:** User can navigate all screens, see real data, lock/unlock session, log sets/loads, edit program (with guardrails), and see coach/recovery/nutrition/load-guide content.

---

### Phase 6 — Persistence

**Goal:** Robust local storage, schema versioning, migration, export/import.

| # | Task | Deliverable |
|---|------|-------------|
| 6.1 | `src/storage/local-storage.js`, `schema-version.js` | Load/save with version |
| 6.2 | `src/storage/validators/`: `validate-save.js`, `repair-save.js` | Validate and repair before use |
| 6.3 | `src/storage/migrations/`: `migrate-v8-to-v9.js` (v8 single-blob → v9 schema), `migrate-schema-1-to-2.js`, `migrate-schema-2-to-3.js` (placeholders or real if schema evolves) | Migrations |
| 6.4 | `src/storage/export-import.js` | Export/import JSON (mirror v8 exportState); optional domain separation (program, history, preferences) |

**Exit criteria:** App loads v9 saves; can migrate from v8-style data; export/import works; corrupted saves are repaired where possible.

---

### Phase 7 — Tests and Docs

**Goal:** Automated tests for critical paths and documentation.

| # | Task | Deliverable |
|---|------|-------------|
| 7.1 | `src/tests/unit/`: `progression-engine.test.js`, `readiness-engine.test.js`, `methodology-engine.test.js`, `fatigue-budget.test.js` | Unit tests |
| 7.2 | `src/tests/integration/`: `session-flow.test.js`, `save-load.test.js`, `migration.test.js` | Integration tests |
| 7.3 | `src/tests/fixtures/`: `sample-program.json`, `sample-history.json`, `corrupted-save.json` | Fixtures |
| 7.4 | `docs/`: `architecture.md`, `data-schema.md`, `progression-rules.md`, `methodology-rules.md`, `recovery-logic.md`, `migration-plan.md` | Documentation |

**Exit criteria:** Key engines and flows covered by tests; docs describe architecture, schema, and migration.

---

## 3. Cross-Cutting Requirements (from README)

- **Methodology:** Support normal, superset, giant set, dropset, rest-pause, cluster sets; link by pair/group id; UI chips; session logging and progression respect methodology.
- **Progression:** start_load, expected_load, performed_load, next_target, performance_delta; double progression, RIR-based, 1RM; bad days don’t permanently break expected progression.
- **Week types:** normal, refeed, deload, refeed_deload, auto; affect calories, carbs, fatigue, progression aggressiveness, coach, recovery.
- **Program guardrails:** Validate anchor coverage, fatigue budget, priority coverage, methodology links; surface warnings on Coach and Training screens.
- **UX:** Mobile-first, sticky top, bottom nav, fast day-jump, dark theme, card-based, one-hand friendly, no enterprise-admin feel.

---

## 4. Suggested Order of Execution (single stream)

1. **Phase 1** — Do in order 1.1 → 1.6 so the app has a runnable skeleton and state.
2. **Phase 2** — Then 2.1 → 2.3 so engines and UI have data to work with.
3. **Phase 3** — Implement program and session engines first (3.1, 3.2), then progression (3.3); run unit tests as you add them.
4. **Phase 4** — Implement readiness and recovery (4.1, 4.2), then nutrition (4.3), then coach (4.4).
5. **Phase 5** — Build components and screens in dependency order: common components → today/training (session + day-jump) → progress, nutrition, recovery, coach, load-guide.
6. **Phase 6** — Add storage layer and v8→v9 migration; wire load/save/export/import.
7. **Phase 7** — Add tests and docs; refine from README quality bar.

---

## 5. Migration Notes (v8 → v9)

- **Program/exercises:** v8 uses array indices for exercise fields; v9 models should use named properties (id, name, type, sets, reps, rir, tempo, primaryMuscles, secondaryMuscles, substitute, role, methodology, etc.). Migration must map v8 arrays into v9 model shape.
- **State keys:** v8 uses one key (`gymos_v8_adaptive_coaching_intelligence`); v9 can keep a single key initially or split by domain (program, sessionHistory, preferences) with a schema version.
- **Session lock:** v8 stores `sessionLocks[sessionKey(week, dayId)]` = snapshot object; v9 should preserve this shape or an equivalent in session.model / session engine so “session locked” behavior is identical.
- **Old keys:** v8 migrates from OLD_KEYS; v9 migration should accept v8 blob and run migrate-v8-to-v9 then save in v9 format.

---

## 6. Definition of Done for “Build GymOS”

The README “Required Deliverables” are satisfied when:

1. Working project scaffold per the specified architecture.
2. `index.html` wired to JS modules and styled (mobile-first).
3. Core screens working end-to-end (Today, Training, Progress, Nutrition, Recovery, Coach, Load Guide).
4. Sample data templates and exercise library in place.
5. Session flow with lock behavior matching v8.
6. Progression engine and methodology engine implemented and used.
7. Readiness, recovery, coach, and analytics basics working.
8. Local storage with schema versioning.
9. Import/export support.
10. Baseline automated tests for critical engines.
11. Documentation under `/docs`.

This plan is the **next-steps roadmap** to achieve that. Proceed phase by phase, completing each phase’s exit criteria before treating the next as started.
