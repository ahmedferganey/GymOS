from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.routes import health, auth, workouts, nutrition, progress, coach

app = FastAPI(title="GymOS AI API", version="0.1.0")

app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
app.include_router(nutrition.router, prefix="/nutrition", tags=["nutrition"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
app.include_router(coach.router, prefix="/coach", tags=["coach"])

Instrumentator().instrument(app).expose(app)

@app.get("/")
def root():
    return {"name": "GymOS AI API", "status": "ok"}
