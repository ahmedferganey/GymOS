def build_workout_prompt(goal: str, days_per_week: int, level: str, injuries: str | None = None) -> str:
    return (
        f"Create a safe {days_per_week}-day workout plan for a {level} user. "
        f"Goal: {goal}. Injuries: {injuries or 'none'}."
    )
