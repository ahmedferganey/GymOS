from fastapi import APIRouter
from app.schemas.coach import WorkoutGenerationRequest, NutritionGenerationRequest

router = APIRouter()

@router.post("/generate-workout")
def generate_workout(payload: WorkoutGenerationRequest):
    return {"type": "workout", "goal": payload.goal, "message": "AI workout stub"}

@router.post("/generate-nutrition")
def generate_nutrition(payload: NutritionGenerationRequest):
    return {"type": "nutrition", "goal": payload.goal, "message": "AI nutrition stub"}

@router.post("/ask")
def ask_coach(question: dict):
    return {"message": "RAG assistant stub", "question": question}
