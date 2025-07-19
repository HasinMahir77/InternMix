from typing import Optional, List
from pydantic import BaseModel, EmailStr, HttpUrl

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
    resume: str

    profile_image_url: Optional[HttpUrl] = None


class Recruiter(BaseModel):
    id: int
    organization_name: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    password_hash: str  # Don't return in API responses!
    profile_image_url: Optional[HttpUrl] = None
    website: Optional[HttpUrl] = None
    active: bool = True
    created_at: str  # ISO datetime as string or datetime object

    listings: Optional[List[int]] = []  # List of listing IDs this recruiter posted
