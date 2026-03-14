# GymOS v9

Mobile-first training operating system for gym coaching, logging, progression, nutrition, and recovery.

## Quick Start

```bash
npm run dev
```

Open **http://localhost:3000**

> **Important:** You must serve the app over HTTP (e.g. `npm run dev`). Opening `index.html` directly via `file://` will fail because ES modules require a proper origin.

## Debugging

If tabs or theme toggle don't work:

1. **Open DevTools** (F12) → Console tab
2. Check for red errors (e.g. "Failed to load module", CORS)
3. Confirm you see `GymOS v9 — Ready` in the console
4. Ensure you're using `http://localhost:3000` (not `file://`)

## Architecture

- **Plain JavaScript modules** (ESM) — no framework
- **7 screens:** Today, Training, Progress, Nutrition, Recovery, Coach, Load Guide
- **Modular engines:** program, session, progression, readiness, recovery, nutrition, coach
- **Local storage** with schema versioning and v8 migration

## Structure

```
gymos/
├── index.html
├── assets/styles/
├── src/
│   ├── app/        # bootstrap, router, state, event-bus
│   ├── core/       # constants, utils, models
│   ├── engines/    # program, session, progression, etc.
│   ├── data/       # templates, exercises, presets
│   ├── storage/    # local storage, migrations
│   ├── services/   # domain services
│   └── ui/         # components, screens
└── docs/
```

## License

MIT
