# GymOS v9 — Data Schema

## State Shape

```json
{
  "profileName": "Athlete",
  "unit": "kg",
  "week": 1,
  "phase": 1,
  "activeDayId": "d1",
  "screen": "today",
  "logs": { "1": { "d1": { "0": { "startLoad": "", "todayLoad": "", "nextTarget": "", "done": false, "note": "" } } } },
  "nutrition": { "calories": 2000, "protein": 160, "carbs": 180, "fat": 60, "water": 3, "meals": 4, "trainingDayCarbs": 180, "restDayCarbs": 140 },
  "measures": [{ "week": 1, "weight": "", "waist": "", "sleep": "", "weekType": "auto", "notes": "" }, ...],
  "recoveryLog": {},
  "sessionLocks": { "w1_d1": { "key": "w1_d1", "week": 1, "dayId": "d1", "exercises": [...] } },
  "customProgram": null,
  "trainingFocusDayId": "d1",
  "priorities": {},
  "schemaVersion": 1
}
```

## Exercise Format (v8-style in program)

`[name, type, sets, reps, rir, tempo, primaryMuscles[], secondaryMuscles[], substitute, id, role]`

## Log Slot

`{ startLoad, todayLoad, nextTarget, done, note }`
