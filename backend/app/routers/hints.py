from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Hint, HintUnlock, User, Challenge
from ..schemas import HintRequestResponse, HintResponse
from ..security import get_current_user

router = APIRouter()


@router.post("/{hint_id}/request", response_model=HintRequestResponse)
def request_hint(
    hint_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Request a hint for a challenge.
    Validates that the user has enough points to "buy" the hint.
    If successful, deducts points and records the hint unlock.
    """
    # Fetch the hint
    hint = db.query(Hint).filter(Hint.id == hint_id).first()
    if not hint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hint not found",
        )

    # Check if user already unlocked this hint
    existing_unlock = (
        db.query(HintUnlock)
        .filter(
            HintUnlock.user_id == current_user.id,
            HintUnlock.hint_id == hint_id,
        )
        .first()
    )
    if existing_unlock:
        return {
            "success": True,
            "message": "You already unlocked this hint",
            "hint": hint,
            "remaining_points": current_user.score,
        }

    # Validate user has sufficient points
    if current_user.score < hint.point_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient points. Required: {hint.point_cost}, Available: {current_user.score}",
        )

    # Deduct points from user
    current_user.score -= hint.point_cost
    db.add(current_user)

    # Record hint unlock
    hint_unlock = HintUnlock(
        user_id=current_user.id,
        hint_id=hint_id,
    )
    db.add(hint_unlock)
    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "message": "Hint unlocked successfully",
        "hint": hint,
        "remaining_points": current_user.score,
    }


@router.get("/challenge/{challenge_id}", response_model=list[HintResponse])
def get_challenge_hints(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all hints for a specific challenge.
    Authenticated users only. Returns hint metadata (cost, but not content for unlocked hints yet).
    """
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found",
        )

    hints = db.query(Hint).filter(Hint.challenge_id == challenge_id).all()
    return hints
