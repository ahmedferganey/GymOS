# GymOS v9 — Architecture

## Overview

GymOS v9 is a modular, browser-based training operating system. It uses plain JavaScript (ESM), no framework, with a clear separation between:

- **App shell** — bootstrap, router, state, events
- **Core** — constants, utils, models
- **Engines** — pure logic (program, session, progression, readiness, recovery, nutrition, coach)
- **Data** — templates, exercise library, presets
- **Storage** — local storage, migrations, export/import
- **Services** — domain services that orchestrate engines
- **UI** — screens and components

## Data Flow

1. **State** lives in `app-state.js`; persistence in `local-storage.js`
2. **Program** comes from `customProgram` or `default-program.js`
3. **Engines** are pure functions; they receive state/data and return computed values
4. **Screens** read state, call services/engines, render HTML, bind events

## Key Concepts

- **Session lock**: When a session is locked, the prescription (sets, reps, rest, RIR) is frozen for that week/day
- **Week types**: normal, refeed, deload, refeed_deload, auto — affect nutrition, progression, recovery
- **Phases**: 1–6 derived from week (2 weeks per phase); affect rest, load %, failure policy
