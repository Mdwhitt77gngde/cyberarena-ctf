from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Challenge, User
from ..schemas import ChallengeCreate, ChallengeResponse, ChallengeDetailResponse, FlagSubmission
from ..security import get_current_user, get_current_admin

router = APIRouter()


@router.get("/", response_model=List[ChallengeResponse])
def get_challenges(
    category: str | None = None,
    difficulty: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get all challenges with optional filtering by category and difficulty.
    Authenticated users only. Flag is never exposed.
    """
    query = db.query(Challenge)
    if category:
        query = query.filter(Challenge.category == category)
    if difficulty:
        query = query.filter(Challenge.difficulty == difficulty)
    return query.all()


@router.get("/{challenge_id}", response_model=ChallengeDetailResponse)
def get_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific challenge by ID.
    Authenticated users only. Flag is never exposed.
    """
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found",
        )
    return challenge


@router.post("/", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
def create_challenge(
    challenge: ChallengeCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Create a new challenge.
    Admin-only. Requires valid admin JWT token.
    """
    new_challenge = Challenge(**challenge.model_dump())
    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)
    return new_challenge


@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    challenge_id: int,
    challenge: ChallengeCreate,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Update an existing challenge.
    Admin-only. Requires valid admin JWT token.
    """
    db_challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not db_challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found",
        )

    for key, value in challenge.model_dump().items():
        setattr(db_challenge, key, value)

    db.commit()
    db.refresh(db_challenge)
    return db_challenge


@router.delete("/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_challenge(
    challenge_id: int,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Delete a challenge.
    Admin-only. Requires valid admin JWT token.
    """
    db_challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not db_challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found",
        )

    db.delete(db_challenge)
    db.commit()
    return None


@router.post("/{challenge_id}/submit")
def submit_flag(
    challenge_id: int,
    submission: FlagSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit a flag for a challenge.
    Authenticated users only. Validates against stored flag.
    """
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found",
        )

    is_correct = submission.flag.strip() == challenge.flag.strip()
    return {
        "correct": is_correct,
        "message": "Correct flag!" if is_correct else "Wrong flag, try again.",
    }

