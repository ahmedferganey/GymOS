# GymOS — Cursor AI Build README

## Mission
Build a **complete production-grade web app** called **GymOS** that evolves the previous single-file GymOS HTML prototype into a **scalable, modular, browser-based training operating system**.

The old HTML already had strong functionality, including:
- Today screen for current workout session
- Training screen with editable training days
- Progress screen
- Nutrition screen
- Recovery screen
- Coach screen
- Load guide screen
- Mobile-first layout
- Session lock behavior
- Adaptive coaching ideas
- Load tracking and next-target guidance
- 7-day training split
- Week-type logic such as normal, refeed, deload, and refeed+deload
- Local browser persistence
- Day-jump / fast navigation between training days

The new app must **preserve and improve those capabilities**, but be rebuilt using the new scalable architecture below.

---

## Required Architecture
Use exactly this structure as the implementation baseline:

```text
gymos/
│
├── index.html
├── favicon.ico
├── README.md
├── package.json
├── .gitignore
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── styles/
│       ├── tokens.css
│       ├── base.css
│       ├── layout.css
│       ├── components.css
│       └── utilities.css
│
├── src/
│   ├── app/
│   │   ├── bootstrap.js
│   │   ├── router.js
│   │   ├── app-state.js
│   │   ├── event-bus.js
│   │   └── config.js
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── week-types.js
│   │   │   ├── day-types.js
│   │   │   ├── exercise-methods.js
│   │   │   ├── muscle-groups.js
│   │   │   └── storage-keys.js
│   │   │
│   │   ├── utils/
│   │   │   ├── math.js
│   │   │   ├── dates.js
│   │   │   ├── ids.js
│   │   │   ├── deep-clone.js
│   │   │   ├── validation.js
│   │   │   └── formatters.js
│   │   │
│   │   └── models/
│   │       ├── athlete.model.js
│   │       ├── program.model.js
│   │       ├── training-day.model.js
│   │       ├── exercise.model.js
│   │       ├── session.model.js
│   │       ├── set-entry.model.js
│   │       ├── recovery.model.js
│   │       ├── nutrition.model.js
│   │       └── progression.model.js
│   │
│   ├── engines/
│   │   ├── program-engine/
│   │   │   ├── build-program.js
│   │   │   ├── validate-program.js
│   │   │   ├── substitute-exercise.js
│   │   │   ├── methodology-engine.js
│   │   │   └── fatigue-budget.js
│   │   │
│   │   ├── session-engine/
│   │   │   ├── start-session.js
│   │   │   ├── lock-session.js
│   │   │   ├── log-set.js
│   │   │   ├── finish-exercise.js
│   │   │   ├── finish-session.js
│   │   │   └── session-summary.js
│   │   │
│   │   ├── progression-engine/
│   │   │   ├── expected-load.js
│   │   │   ├── next-target.js
│   │   │   ├── estimate-1rm.js
│   │   │   ├── double-progression.js
│   │   │   ├── rir-progression.js
│   │   │   └── performance-delta.js
│   │   │
│   │   ├── readiness-engine/
│   │   │   ├── readiness-score.js
│   │   │   ├── local-fatigue.js
│   │   │   ├── systemic-fatigue.js
│   │   │   ├── recovery-status.js
│   │   │   └── autoregulation.js
│   │   │
│   │   ├── nutrition-engine/
│   │   │   ├── calorie-target.js
│   │   │   ├── macro-targets.js
│   │   │   ├── hydration-target.js
│   │   │   ├── meal-timing.js
│   │   │   └── refeed-adjustment.js
│   │   │
│   │   ├── recovery-engine/
│   │   │   ├── sleep-target.js
│   │   │   ├── cardio-recommendation.js
│   │   │   ├── mobility-recommendation.js
│   │   │   ├── sauna-steam.js
│   │   │   └── deload-decision.js
│   │   │
│   │   ├── analytics-engine/
│   │   │   ├── muscle-workload.js
│   │   │   ├── weekly-volume.js
│   │   │   ├── intensity-distribution.js
│   │   │   ├── prs.js
│   │   │   ├── adherence.js
│   │   │   └── trend-analysis.js
│   │   │
│   │   └── coach-engine/
│   │       ├── coach-rules.js
│   │       ├── coach-recommendations.js
│   │       ├── next-week-strategy.js
│   │       ├── warnings.js
│   │       └── explanation-builder.js
│   │
│   ├── data/
│   │   ├── templates/
│   │   │   ├── default-program.js
│   │   │   ├── swimmer-template.js
│   │   │   ├── fighter-template.js
│   │   │   └── hypertrophy-template.js
│   │   │
│   │   ├── exercises/
│   │   │   ├── exercise-library.js
│   │   │   ├── substitutions.js
│   │   │   ├── muscle-map.js
│   │   │   └── methodology-presets.js
│   │   │
│   │   └── presets/
│   │       ├── week-presets.js
│   │       ├── recovery-presets.js
│   │       └── nutrition-presets.js
│   │
│   ├── storage/
│   │   ├── local-storage.js
│   │   ├── export-import.js
│   │   ├── schema-version.js
│   │   ├── migrations/
│   │   │   ├── migrate-v8-to-v9.js
│   │   │   ├── migrate-schema-1-to-2.js
│   │   │   └── migrate-schema-2-to-3.js
│   │   └── validators/
│   │       ├── validate-save.js
│   │       └── repair-save.js
│   │
│   ├── services/
│   │   ├── program.service.js
│   │   ├── session.service.js
│   │   ├── progress.service.js
│   │   ├── nutrition.service.js
│   │   ├── recovery.service.js
│   │   └── coach.service.js
│   │
│   ├── ui/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── button.js
│   │   │   │   ├── modal.js
│   │   │   │   ├── card.js
│   │   │   │   ├── badge.js
│   │   │   │   ├── tabs.js
│   │   │   │   ├── progress-bar.js
│   │   │   │   └── toast.js
│   │   │   │
│   │   │   ├── training/
│   │   │   │   ├── exercise-card.js
│   │   │   │   ├── exercise-editor.js
│   │   │   │   ├── set-logger.js
│   │   │   │   ├── methodology-chip.js
│   │   │   │   ├── session-header.js
│   │   │   │   └── day-jump.js
│   │   │   │
│   │   │   ├── progress/
│   │   │   │   ├── pr-card.js
│   │   │   │   ├── volume-chart.js
│   │   │   │   ├── muscle-chart.js
│   │   │   │   └── trend-card.js
│   │   │   │
│   │   │   ├── nutrition/
│   │   │   │   ├── macro-card.js
│   │   │   │   ├── hydration-card.js
│   │   │   │   └── meal-timing-card.js
│   │   │   │
│   │   │   ├── recovery/
│   │   │   │   ├── readiness-card.js
│   │   │   │   ├── sleep-card.js
│   │   │   │   ├── mobility-card.js
│   │   │   │   └── fatigue-card.js
│   │   │   │
│   │   │   └── coach/
│   │   │       ├── recommendation-card.js
│   │   │       ├── warning-card.js
│   │   │       └── week-strategy-card.js
│   │   │
│   │   ├── screens/
│   │   │   ├── today.screen.js
│   │   │   ├── training.screen.js
│   │   │   ├── progress.screen.js
│   │   │   ├── nutrition.screen.js
│   │   │   ├── recovery.screen.js
│   │   │   ├── coach.screen.js
│   │   │   └── load-guide.screen.js
│   │   │
│   │   └── state-bindings/
│   │       ├── today.binding.js
│   │       ├── training.binding.js
│   │       ├── progress.binding.js
│   │       └── coach.binding.js
│   │
│   └── tests/
│       ├── unit/
│       │   ├── progression-engine.test.js
│       │   ├── readiness-engine.test.js
│       │   ├── methodology-engine.test.js
│       │   └── fatigue-budget.test.js
│       │
│       ├── integration/
│       │   ├── session-flow.test.js
│       │   ├── save-load.test.js
│       │   └── migration.test.js
│       │
│       └── fixtures/
│           ├── sample-program.json
│           ├── sample-history.json
│           └── corrupted-save.json
│
└── docs/
    ├── architecture.md
    ├── data-schema.md
    ├── progression-rules.md
    ├── methodology-rules.md
    ├── recovery-logic.md
    └── migration-plan.md
```

---

## Product Goals
GymOS v9 is a **mobile-first training operating system** for gym coaching, logging, progression, nutrition, recovery, and adaptive decision support.

The product should feel like a polished app, not a rough prototype.

Primary goals:
1. Preserve the practical usefulness of the previous HTML app.
2. Upgrade the system into a scalable modular architecture.
3. Add advanced methodology support such as supersets and dropsets.
4. Make progression smarter by separating expected load from performed load.
5. Improve data integrity, migration safety, and long-term maintainability.
6. Keep everything browser-based first, with local persistence and export/import.
7. Provide a very strong mobile UX because the user may run this app inside the gym.

---

## Core Functional Requirements

### 1. Main Screens
Implement these screens:
- Today
- Training
- Progress
- Nutrition
- Recovery
- Coach
- Load Guide

### 2. Today Screen
The Today screen must include:
- current day information
- active training focus
- readiness summary
- session controls
- warm-up block
- exercise cards
- set logging
- load inputs
- method display chips
- coach notes
- cardio notes
- recovery notes
- session completion summary

### 3. Training Screen
The Training screen must allow:
- browsing the full weekly split
- editing training days
- adding exercises
- removing exercises
- reordering exercises
- editing warm-up movements
- editing exercise metadata
- preserving guardrails for program integrity
- day jump navigation for fast movement between days

### 4. Progress Screen
Must include:
- PR tracking
- body metric tracking
- workout completion history
- weekly volume summaries
- muscle workload summaries
- performance trends
- adherence insights

### 5. Nutrition Screen
Must include:
- calorie targets
- protein, carbs, fats
- hydration target
- sodium guidance if useful
- pre-workout meal timing
- post-workout meal timing
- week-type adjustments for refeed/deload

### 6. Recovery Screen
Must include:
- readiness interpretation
- sleep target
- walking/cardio recommendation
- mobility recommendation
- sauna/steam suggestions if enabled
- local fatigue and systemic fatigue summaries

### 7. Coach Screen
Must include:
- coach recommendations
- warnings
- suggested next-week strategy
- explanation of why the recommendation was generated
- adaptive decision summary from performance + readiness + recovery state

### 8. Load Guide Screen
Must explain:
- start load
- expected load
- performed load
- next target
- progression rules
- how RIR affects decisions
- how double progression works
- how fatigue affects future recommendations

---

## Training System Requirements
The app must support a full **7-day split**, based on the prior GymOS concept.

Recommended baseline split:
- Day 1: Upper Neural Primer
- Day 2: Lat Width Specialization
- Day 3: Lower Power
- Day 4: Shoulders + Arms
- Day 5: Upper Chest Specialization
- Day 6: Athletic Lower + Glutes
- Day 7: Mobility + Recovery

Each day should support:
- day name
- day focus
- notes
- warm-up block
- exercise list
- cardio instructions
- recovery instructions
- optional substitutions

Each exercise should support:
- id
- name
- category
- type: compound or isolation
- primary and secondary muscles
- sets
- reps or rep range
- target RIR
- tempo
- rest time
- methodology type
- pair or group linkage for supersets/giant sets
- expected load
- performed load
- next target
- fatigue cost
- notes
- substitutions

---

## Advanced Methodology Requirements
The old HTML was mostly row-based. The new system must support methodology-aware programming.

Implement support for:
- normal sets
- superset
- giant set
- dropset
- rest-pause
- cluster sets

Expected behavior:
- Superset exercises can be linked by pair/group id.
- Dropsets can define drop count and drop percentage.
- Cluster sets can define mini-rest between clusters.
- The UI should clearly display methodology with chips or labels.
- Session logging must still work correctly for methodology-based exercises.
- Fatigue and progression logic must understand methodology type.

---

## Progression Requirements
The new system must improve the previous load logic.

Implement these concepts:
- start_load
- expected_load
- performed_load
- next_target
- performance_delta

Support at least these progression models:
1. Double progression
2. RIR-based progression
3. Estimated 1RM support

Rules:
- A bad day should not permanently destroy expected progression.
- Expected load should represent what the system thinks the athlete should do.
- Performed load should represent what actually happened.
- Performance delta should measure the gap.
- Next target should consider trend, not only one session.

---

## Readiness and Recovery Requirements
Implement a readiness system with:
- readiness score
- local fatigue
- systemic fatigue
- recovery status
- autoregulation recommendations

Inputs may include:
- recent performance
- previous session stress
- soreness/fatigue score
- manual readiness inputs
- sleep input if available

Outputs may include:
- normal day
- slightly reduce intensity
- reduce total sets
- maintain plan
- suggest recovery focus
- recommend deload direction

---

## Week Type Requirements
Support these week types:
- normal
- refeed
- deload
- refeed_deload
- auto

Week type should affect:
- calories
- carbs
- fatigue management
- progression aggressiveness
- coach recommendations
- recovery targets
- volume targets if needed

---

## Analytics Requirements
Implement analytics for:
- weekly volume
- muscle workload distribution
- intensity distribution
- PRs
- adherence
- performance trend analysis

Muscle workload analytics must help answer questions like:
- Are lats under-trained?
- Are rear delts low versus side delts?
- Are glutes too dominant relative to quads?
- Is upper chest volume sufficient?

---

## Program Integrity Guardrails
The app must not be a free-form spreadsheet only. It should remain a coach-aware system.

When users edit the program, validate for:
- too many high-fatigue compounds in one day
- too little volume for key muscles
- broken methodology links
- invalid progression settings
- missing anchor lifts if template requires them
- dangerous recovery mismatch between days

Surface warnings in the Coach screen and Training screen.

---

## Persistence and Migration Requirements
Use browser local storage first, but build it properly.

Requirements:
- schema versioning
- save validation
- corrupted save repair where possible
- import/export JSON
- migration support from old schema shapes
- migration support from v8-style saved data if available

Data domains should be separated where sensible:
- program definition
- session history
- preferences
- analytics cache

Do not store everything as one fragile blob.

---

## UX / UI Requirements
The UI must be:
- mobile-first
- responsive
- fast inside the gym
- readable with large tap targets
- dark-theme friendly
- clean and modern
- card-based
- optimized for one-hand usage where possible

Important UX requirements:
- sticky top area where useful
- bottom navigation tabs
- fast day-jump behavior
- smooth scrolling
- exercise cards easy to scan
- clear progression info
- editable inputs without visual clutter
- safe interaction flows to prevent accidental session corruption

Do not make the interface feel like an enterprise admin panel. It should feel like a focused athlete tool.

---

## Engineering Constraints
- Use plain JavaScript modules unless there is a strong reason to introduce a framework.
- Keep architecture clean and modular.
- Avoid coupling UI rendering with progression math.
- Avoid giant files.
- Prefer pure functions for engine logic.
- Create testable units, especially for progression, methodology, fatigue, and migration.
- Use comments where they add real value.
- Use robust naming and predictable folder responsibilities.

---

## Suggested Data Model Direction
At minimum define strong models for:
- Athlete
- Program
- TrainingDay
- Exercise
- Session
- SetEntry
- Recovery
- Nutrition
- Progression

Example exercise model should support structured data instead of flat rows.

Include fields such as:
- id
- name
- category
- movement pattern
- primary muscles
- secondary muscles
- methodology settings
- progression settings
- fatigue cost
- substitutions
- notes

---

## Required Deliverables from Cursor AI
Build the project as a real implementation, not only a plan.

Deliver:
1. Working project scaffold using the provided architecture.
2. Fully implemented index.html wired to the JS modules.
3. Styled app with reusable components and mobile-first CSS.
4. Core screens working end-to-end.
5. Sample data templates and exercise library.
6. Session flow with lock behavior.
7. Progression engine and methodology engine.
8. Readiness, recovery, coach, and analytics basics working.
9. Local storage persistence with schema versioning.
10. Import/export support.
11. At least baseline automated tests for critical engines.
12. Documentation files under /docs.

---

## Implementation Priority Order
Build in this order:

### Phase 1 — Foundation
- package.json
- index.html
- assets/styles
- app bootstrap
- router
- app-state
- constants
- utils
- models

### Phase 2 — Static Data
- exercise library
- muscle map
- substitutions
- default program template
- week presets

### Phase 3 — Core Engines
- program engine
- session engine
- progression engine

### Phase 4 — Recovery Intelligence
- readiness engine
- recovery engine
- nutrition engine
- coach engine

### Phase 5 — UI Screens
- Today
- Training
- Progress
- Nutrition
- Recovery
- Coach
- Load Guide

### Phase 6 — Persistence
- local storage
- validation
- repair
- export/import
- schema migration

### Phase 7 — Tests and Docs
- unit tests
- integration tests
- architecture docs
- data schema docs
- migration docs

---

## Quality Bar
The finished result should feel like:
- a serious coaching app
- internally consistent
- modular and future-proof
- easy to extend toward v9+ features

It should be clearly superior to the old single-file HTML in:
- maintainability
- data integrity
- extensibility
- progression quality
- training methodology support
- code organization

---

## Important Notes for Cursor AI
- Do not collapse everything into a few huge files.
- Do not replace the modular architecture with a simpler but messy version.
- Do not remove critical old GymOS ideas such as adaptive coaching, session lock, week types, and mobile-first flow.
- Keep the app usable as a real gym companion.
- Prefer complete end-to-end implementation over shallow placeholders.
- Where exact old HTML behavior is unknown, implement the strongest reasonable version consistent with GymOS goals.

---

## Final Build Instruction
Build **GymOS v9** as a complete, polished, mobile-first web application using the architecture above, preserving the spirit and practical features of the previous GymOS prototype while upgrading it into a scalable coaching platform with modular engines, robust persistence, advanced progression logic, methodology-aware training, recovery intelligence, and editable but guarded program design.


