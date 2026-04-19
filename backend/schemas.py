from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    subscription_status: str
    stripe_customer_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    prompt_text: str
    voice_id: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    user_id: int
    prompt_text: str
    status: str
    video_url: Optional[str] = None
    voice_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
