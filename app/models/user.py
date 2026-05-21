from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Role(SQLModel, table=True):
    """Represents a user role within the CTF platform."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None

    users: List["User"] = Relationship(back_populates="role")


class User(SQLModel, table=True):
    """Represents a platform user with a role and submissions."""

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    role_id: int = Field(foreign_key="role.id")

    role: Optional[Role] = Relationship(back_populates="users")
    submissions: List["Submission"] = Relationship(back_populates="user")
