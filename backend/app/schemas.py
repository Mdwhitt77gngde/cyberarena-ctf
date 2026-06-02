from pydantic import BaseModel


class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    score: int

    model_config = {"from_attributes": True}


class UserMeResponse(UserResponse):
    pass


class ChallengeCreate(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    points: int
    flag: str


class ChallengeResponse(BaseModel):
    """Response schema for challenge endpoints - excludes flag."""
    id: int
    title: str
    description: str
    category: str
    difficulty: str
    points: int

    model_config = {"from_attributes": True}


class ChallengeDetailResponse(BaseModel):
    """Detailed response schema for a single challenge - excludes flag."""
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


class HintRequestResponse(BaseModel):
    """Response when user requests a hint."""
    success: bool
    message: str
    hint: HintResponse = None
    remaining_points: int = None

    model_config = {"from_attributes": True}
