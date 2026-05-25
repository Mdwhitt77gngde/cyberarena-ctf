from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import User
from backend.app.schemas import UserResponse
from backend.app.security import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)) -> User:
    """Return the authenticated user's profile."""
    return current_user


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)) -> list[User]:
    """Return all registered users."""
    return db.query(User).all()


@router.get("/leaderboard", response_model=list[dict])
def leaderboard(db: Session = Depends(get_db)) -> list[dict]:
    """Return users ordered by score for the CTF leaderboard."""
    users = db.query(User).order_by(User.score.desc()).all()
    return [{"username": user.username, "score": user.score} for user in users]
