from sqlalchemy import String, ForeignKey, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base

class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    goal: Mapped[str] = mapped_column(String(100))
    days_per_week: Mapped[int] = mapped_column(Integer)

class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    performed_on: Mapped[Date]
