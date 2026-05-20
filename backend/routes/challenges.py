from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Challenge, Submission, User
from schemas import ChallengeCreate, ChallengeResponse, FlagSubmission
from typing import List

router = APIRouter()

@router.get("/", response_model=List[ChallengeResponse])
def get_challenges(
    category: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Challenge)
    if category:
        query = query.filter(Challenge.category == category)
    if difficulty:
        query = query.filter(Challenge.difficulty == difficulty)
    return query.all()

@router.post("/", response_model=ChallengeResponse)
def create_challenge(challenge: ChallengeCreate, db: Session = Depends(get_db)):
    new_challenge = Challenge(**challenge.dict())
    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)
    return new_challenge

@router.put("/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(challenge_id: int, challenge: ChallengeCreate, db: Session = Depends(get_db)):
    db_challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not db_challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    for key, value in challenge.dict().items():
        setattr(db_challenge, key, value)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

@router.delete("/{challenge_id}")
def delete_challenge(challenge_id: int, db: Session = Depends(get_db)):
    db_challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not db_challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(db_challenge)
    db.commit()
    return {"message": "Challenge deleted successfully"}

@router.post("/{challenge_id}/submit")
def submit_flag(challenge_id: int, submission: FlagSubmission, db: Session = Depends(get_db)):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    is_correct = submission.flag.strip() == challenge.flag.strip()
    return {"correct": is_correct, "message": "Correct flag!" if is_correct else "Wrong flag, try again."}