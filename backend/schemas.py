from pydantic import BaseModel


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
    is_active: bool
    score: int

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


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

    model_config = {"from_attributes": True}


class FlagSubmission(BaseModel):
    flag: str


class HintCreate(BaseModel):
    content: str
    point_cost: int


class HintResponse(BaseModel):
    id: int
    content: str
    point_cost: int

    model_config = {"from_attributes": True}