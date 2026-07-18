from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # "mentee" | "mentor"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str


# ---------- Profiles ----------
class MenteeProfileUpdate(BaseModel):
    profile_picture: Optional[str] = None
    education: Optional[str] = None
    current_role: Optional[str] = None
    skills: Optional[str] = None
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None


class MentorProfileUpdate(BaseModel):
    profession: Optional[str] = None
    company: Optional[str] = None
    experience_years: Optional[int] = None
    expertise: Optional[str] = None
    achievements: Optional[str] = None
    availability: Optional[str] = None


class MentorOut(BaseModel):
    user_id: int
    name: str
    profession: Optional[str]
    company: Optional[str]
    expertise: Optional[str]
    experience_years: Optional[int]
    rating: float
    match_score: Optional[float] = None

    class Config:
        from_attributes = True


# ---------- Matching ----------
class MatchRequest(BaseModel):
    career_goal: str
    skills: str
    experience_level: str


class MatchResult(BaseModel):
    mentor_id: int
    name: str
    match_score: float
    reasons: List[str]


# ---------- Goals ----------
class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None


class GoalOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    progress: int
    status: str

    class Config:
        from_attributes = True


# ---------- Sessions ----------
class SessionCreate(BaseModel):
    mentor_id: int
    date: datetime


class SessionOut(BaseModel):
    id: int
    mentor_id: int
    mentee_id: int
    date: datetime
    status: str
    meeting_link: Optional[str]

    class Config:
        from_attributes = True


# ---------- AI Assistant ----------
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = None  # [{"role": "user"|"assistant", "content": "..."}]


class ChatResponse(BaseModel):
    reply: str


class RoadmapRequest(BaseModel):
    goal: str
    experience_level: str = "beginner"
