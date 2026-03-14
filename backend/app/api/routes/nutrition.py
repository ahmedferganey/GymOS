from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_nutrition_logs():
    return {"items": []}
