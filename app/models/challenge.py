from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Challenge(SQLModel, table=True):
    """Represents a CTF challenge with hints and submissions."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: str
    category: str = Field(index=True)
    difficulty: str
    points: int
    flag: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    hints: List["Hint"] = Relationship(back_populates="challenge")
    submissions: List["Submission"] = Relationship(back_populates="challenge")


class Hint(SQLModel, table=True):
    """Represents a hint for a specific CTF challenge."""

    id: Optional[int] = Field(default=None, primary_key=True)
    challenge_id: int = Field(foreign_key="challenge.id")
    hint_text: str
    cost_points: int = Field(default=0)

    challenge: Optional[Challenge] = Relationship(back_populates="hints")


class Submission(SQLModel, table=True):
    """Represents a user's flag submission for a challenge."""

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    challenge_id: int = Field(foreign_key="challenge.id")
    submitted_flag: str
    is_correct: bool
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional["User"] = Relationship(back_populates="submissions")
    challenge: Optional[Challenge] = Relationship(back_populates="submissions")
