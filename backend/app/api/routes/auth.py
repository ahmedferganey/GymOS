from fastapi import APIRouter
from app.schemas.user import UserCreate

router = APIRouter()

@router.post("/register")
def register(payload: UserCreate):
    return {"message": "register stub", "email": payload.email}

@router.post("/login")
def login():
    return {"message": "login stub"}
