from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    total_points: int
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

# Challenge schemas
class ChallengeCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    points: int
    flag: str

class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    difficulty: str
    points: int
    class Config:
        from_attributes = True

# Flag submission schema
class FlagSubmission(BaseModel):
    flag: str

# Hint schemas
class HintCreate(BaseModel):
    content: str
    point_cost: int

class HintResponse(BaseModel):
    id: int
    content: str
    point_cost: int
    class Config:
        from_attributes = True