from typing import Optional, List
from pydantic import BaseModel, EmailStr, HttpUrl, Field

class Intern(BaseModel):
    first_name: str
    last_name: str
    phone_num: str
    address: str
    email: str
    institution: str
    major: str
    cgpa: float
    password_hash: str
    resume_path: str
    github_url: str

    profile_image_url: Optional[HttpUrl] = None


class Recruiter(BaseModel):
    organization_name: str
    first_name: str
    last_name: str
    designation: str
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str  # Don't return in API responses!
    profile_image_url: Optional[HttpUrl] = None
    website: Optional[HttpUrl] = None
    active: bool = True
    created_at: str  # ISO datetime as string or datetime object

    listings: List[int] = Field(default_factory=list)  # List of listing IDs this recruiter posted


class Listing(BaseModel):
    id: Optional[int] = None
    recruiter_id: int  # FK to a Recruiter (one recruiter -> many listings)
    title: str
    address: str
    description: str
    skills: List[str] = Field(default_factory=list)
