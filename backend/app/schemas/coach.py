from pydantic import BaseModel

class WorkoutGenerationRequest(BaseModel):
    goal: str
    days_per_week: int
    level: str
    injuries: str | None = None

class NutritionGenerationRequest(BaseModel):
    goal: str
    weight_kg: float
    activity_level: str

class CoachResponse(BaseModel):
    message: str
