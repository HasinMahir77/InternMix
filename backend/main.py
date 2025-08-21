from datetime import datetime, timedelta
import os
from typing import Optional
import sys
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import jwt, JWTError

# Ensure project root is on sys.path so `python backend/main.py` works
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.models import Base, Intern, Recruiter, Listing, Application

# Database setup (SQLite)
DATABASE_URL = os.getenv("INTERNMIX_DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base.metadata.create_all(bind=engine)

# Development settings
DEBUG_MODE = os.getenv("INTERNMIX_DEBUG", "true").lower() == "true"


# Security / JWT setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("INTERNMIX_SECRET_KEY", "dev-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("INTERNMIX_TOKEN_EXPIRE_MINUTES", "10080"))  # default 7 days


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {"sub": subject}
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic schemas
class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    user_type: str  # 'student' | 'recruiter'


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    id: str  # Now using email as ID
    email: str
    first_name: str
    last_name: str
    user_type: str


class ListingCreateRequest(BaseModel):
    title: str
    description: str
    degree: str
    subject: str
    recommended_cgpa: Optional[float] = None
    duration_months: int
    location: str
    is_remote: bool
    required_skills: list[str]
    optional_skills: list[str]
    deadline: str


class ListingUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    degree: Optional[str] = None
    subject: Optional[str] = None
    recommended_cgpa: Optional[float] = None
    duration_months: Optional[int] = None
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    required_skills: Optional[list[str]] = None
    optional_skills: Optional[list[str]] = None
    deadline: Optional[str] = None
    archived: Optional[bool] = None


class ListingResponse(BaseModel):
    id: int
    title: str
    description: str
    degree: str
    subject: str
    recommended_cgpa: Optional[float]
    duration_months: int
    location: str
    is_remote: bool
    required_skills: list[str]
    optional_skills: list[str]
    deadline: str
    archived: bool
    created_by: str
    created_by_name: str
    created_at: str
    applications_count: int


app = FastAPI(
    title="InternMix API",
    debug=DEBUG_MODE,
    version="1.0.0",
    description="API for InternMix internship platform"
)

# CORS for Vite dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Alternative dev port
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Development middleware
if DEBUG_MODE:
    @app.middleware("http")
    async def add_debug_headers(request, call_next):
        response = await call_next(request)
        response.headers["X-Debug-Mode"] = "true"
        response.headers["X-Server"] = "InternMix Dev"
        return response


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "time": datetime.utcnow().isoformat()}


@app.post("/api/auth/signup", response_model=UserResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    normalized_type = payload.user_type.lower()
    if normalized_type not in ("student", "recruiter"):
        raise HTTPException(status_code=400, detail="user_type must be 'student' or 'recruiter'")

    if normalized_type == "student":
        user = Intern(
            email=str(payload.email).lower(),
            password_hash=hash_password(payload.password),
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
        )
    else:
        user = Recruiter(
            email=str(payload.email).lower(),
            password_hash=hash_password(payload.password),
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
        )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already registered")
    db.refresh(user)
    user_type = "student" if isinstance(user, Intern) else "recruiter"
    return UserResponse(
        id=user.email,  # Using email as ID now
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        user_type=user_type,
    )


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Try intern first
    stmt_intern = select(Intern).where(Intern.email == str(payload.email).lower())
    intern = db.execute(stmt_intern).scalar_one_or_none()
    user_obj = intern
    user_type = "student"
    if intern is None:
        stmt_recruiter = select(Recruiter).where(Recruiter.email == str(payload.email).lower())
        recruiter = db.execute(stmt_recruiter).scalar_one_or_none()
        user_obj = recruiter
        user_type = "recruiter" if recruiter is not None else None
    if user_obj is None or not verify_password(payload.password, user_obj.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=f"{user_type}:{user_obj.email}")
    return TokenResponse(
        access_token=token,
        user={
            "id": user_obj.email,  # Using email as ID now
            "email": user_obj.email,
            "first_name": user_obj.first_name,
            "last_name": user_obj.last_name,
            "user_type": user_type,
        },
    )


def get_current_user(db: Session = Depends(get_db), authorization: Optional[str] = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    try:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() != "bearer" or not token:
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        user_type, _, email = str(sub).partition(":")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    if user_type == "student":
        user = db.get(Intern, email)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user, user_type
    elif user_type == "recruiter":
        user = db.get(Recruiter, email)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user, user_type
    raise HTTPException(status_code=401, detail="Invalid token subject")


@app.get("/api/auth/me", response_model=UserResponse)
def me(dep=Depends(get_current_user)):
    user_obj, user_type = dep
    return UserResponse(
        id=user_obj.email,  # Using email as ID now
        email=user_obj.email,
        first_name=user_obj.first_name,
        last_name=user_obj.last_name,
        user_type=user_type,
    )


# Listing endpoints
@app.post("/api/listings", response_model=ListingResponse, status_code=201)
def create_listing(
    listing_data: ListingCreateRequest,
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_obj, user_type = dep
    
    if user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can create listings")
    
    # Create new listing
    listing = Listing(
        recruiter_email=user_obj.email,
        title=listing_data.title,
        description=listing_data.description,
        degree=listing_data.degree,
        subject=listing_data.subject,
        recommended_cgpa=listing_data.recommended_cgpa,
        duration_months=listing_data.duration_months,
        location=listing_data.location,
        is_remote=listing_data.is_remote,
        required_skills=listing_data.required_skills,
        optional_skills=listing_data.optional_skills,
        deadline=listing_data.deadline,
        archived=False,
    )
    
    db.add(listing)
    db.commit()
    db.refresh(listing)
    
    return ListingResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        degree=listing.degree,
        subject=listing.subject,
        recommended_cgpa=listing.recommended_cgpa,
        duration_months=listing.duration_months,
        location=listing.location,
        is_remote=listing.is_remote,
        required_skills=listing.required_skills,
        optional_skills=listing.optional_skills,
        deadline=listing.deadline,
        archived=listing.archived,
        created_by=listing.recruiter_email,
        created_by_name=f"{user_obj.first_name} {user_obj.last_name}",
        created_at=listing.created_at.isoformat(),
        applications_count=0,
    )


@app.get("/api/listings", response_model=list[ListingResponse])
def get_listings(
    archived: bool = False,
    db: Session = Depends(get_db)
):
    """Get all listings, optionally filtered by archived status"""
    query = db.query(Listing).filter(Listing.archived == archived)
    listings = query.all()
    
    result = []
    for listing in listings:
        # Get recruiter info
        recruiter = db.get(Recruiter, listing.recruiter_email)
        recruiter_name = f"{recruiter.first_name} {recruiter.last_name}" if recruiter else "Unknown"
        
        # Count applications
        applications_count = db.query(Application).filter(Application.listing_id == listing.id).count()
        
        result.append(ListingResponse(
            id=listing.id,
            title=listing.title,
            description=listing.description,
            degree=listing.degree,
            subject=listing.subject,
            recommended_cgpa=listing.recommended_cgpa,
            duration_months=listing.duration_months,
            location=listing.location,
            is_remote=listing.is_remote,
            required_skills=listing.required_skills,
            optional_skills=listing.optional_skills,
            deadline=listing.deadline,
            archived=listing.archived,
            created_by=listing.recruiter_email,
            created_by_name=recruiter_name,
            created_at=listing.created_at.isoformat(),
            applications_count=applications_count,
        ))
    
    return result


@app.get("/api/listings/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific listing by ID"""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Get recruiter info
    recruiter = db.get(Recruiter, listing.recruiter_email)
    recruiter_name = f"{recruiter.first_name} {recruiter.last_name}" if recruiter else "Unknown"
    
    # Count applications
    applications_count = db.query(Application).filter(Application.listing_id == listing.id).count()
    
    return ListingResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        degree=listing.degree,
        subject=listing.subject,
        recommended_cgpa=listing.recommended_cgpa,
        duration_months=listing.duration_months,
        location=listing.location,
        is_remote=listing.is_remote,
        required_skills=listing.required_skills,
        optional_skills=listing.optional_skills,
        deadline=listing.deadline,
        archived=listing.archived,
        created_by=listing.recruiter_email,
        created_by_name=recruiter_name,
        created_at=listing.created_at.isoformat(),
        applications_count=applications_count,
    )


@app.put("/api/listings/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdateRequest,
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a listing (only the creator can update)"""
    user_obj, user_type = dep
    
    if user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can update listings")
    
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if user owns this listing
    if listing.recruiter_email != user_obj.email:
        raise HTTPException(status_code=403, detail="Can only update your own listings")
    
    # Update fields if provided
    update_data = listing_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)
    
    db.commit()
    db.refresh(listing)
    
    # Get recruiter info
    recruiter = db.get(Recruiter, listing.recruiter_email)
    recruiter_name = f"{recruiter.first_name} {recruiter.last_name}" if recruiter else "Unknown"
    
    # Count applications
    applications_count = db.query(Application).filter(Application.listing_id == listing.id).count()
    
    return ListingResponse(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        degree=listing.degree,
        subject=listing.subject,
        recommended_cgpa=listing.recommended_cgpa,
        duration_months=listing.duration_months,
        location=listing.location,
        is_remote=listing.is_remote,
        required_skills=listing.required_skills,
        optional_skills=listing.optional_skills,
        deadline=listing.deadline,
        archived=listing.archived,
        created_by=listing.recruiter_email,
        created_by_name=recruiter_name,
        created_at=listing.created_at.isoformat(),
        applications_count=applications_count,
    )


@app.delete("/api/listings/{listing_id}")
def delete_listing(
    listing_id: int,
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a listing (only the creator can delete)"""
    user_obj, user_type = dep
    
    if user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can delete listings")
    
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if user owns this listing
    if listing.recruiter_email != user_obj.email:
        raise HTTPException(status_code=403, detail="Can only delete your own listings")
    
    # Delete related applications first
    db.query(Application).filter(Application.listing_id == listing_id).delete()
    
    # Delete the listing
    db.delete(listing)
    db.commit()
    
    return {"message": "Listing deleted successfully"}


@app.patch("/api/listings/{listing_id}/archive")
def toggle_archive_listing(
    listing_id: int,
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle archived status of a listing"""
    user_obj, user_type = dep
    
    if user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can archive listings")
    
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if user owns this listing
    if listing.recruiter_email != user_obj.email:
        raise HTTPException(status_code=403, detail="Can only archive your own listings")
    
    listing.archived = not listing.archived
    db.commit()
    
    return {"message": f"Listing {'archived' if listing.archived else 'unarchived'} successfully"}


# Dashboard endpoints
@app.get("/api/dashboard/recruiter")
def get_recruiter_dashboard(
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recruiter dashboard statistics"""
    user_obj, user_type = dep
    
    if user_type != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can access this endpoint")
    
    # Get active listings count
    active_listings = db.query(Listing).filter(
        Listing.recruiter_email == user_obj.email,
        Listing.archived == False
    ).count()
    
    # Get total applications count for all recruiter's listings
    total_applications = db.query(Application).join(Listing).filter(
        Listing.recruiter_email == user_obj.email
    ).count()
    
    # Get new applications count (applications from last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.utcnow() - timedelta(days=7)
    new_applications = db.query(Application).join(Listing).filter(
        Listing.recruiter_email == user_obj.email,
        Application.applied_at >= week_ago
    ).count()
    
    # Get upcoming interviews (placeholder - can be expanded later)
    upcoming_interviews = 0  # This would come from a separate interviews table
    
    return {
        "active_postings": active_listings,
        "total_applications": total_applications,
        "new_applications": new_applications,
        "upcoming_interviews": upcoming_interviews,
        "organization_name": user_obj.organization_name or "Your Company"
    }


@app.get("/api/dashboard/student")
def get_student_dashboard(
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student dashboard statistics"""
    user_obj, user_type = dep
    
    if user_type != "student":
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    # Get applications count for this student
    applications_count = db.query(Application).filter(
        Application.intern_email == user_obj.email
    ).count()
    
    # Get active applications (not rejected)
    active_applications = db.query(Application).filter(
        Application.intern_email == user_obj.email,
        Application.status != "rejected"
    ).count()
    
    # Get upcoming interviews (placeholder)
    upcoming_interviews = 0
    
    # Get profile views (placeholder - would come from analytics table)
    profile_views = 0
    
    return {
        "total_applications": applications_count,
        "active_applications": active_applications,
        "upcoming_interviews": upcoming_interviews,
        "profile_views": profile_views
    }


@app.get("/api/dashboard/stats")
def get_dashboard_stats(
    dep=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get general dashboard statistics"""
    user_obj, user_type = dep
    
    if user_type == "recruiter":
        # Recruiter-specific stats
        total_listings = db.query(Listing).filter(
            Listing.recruiter_email == user_obj.email
        ).count()
        
        archived_listings = db.query(Listing).filter(
            Listing.recruiter_email == user_obj.email,
            Listing.archived == True
        ).count()
        
        return {
            "total_listings": total_listings,
            "archived_listings": archived_listings,
            "user_type": "recruiter"
        }
    else:
        # Student-specific stats
        total_applications = db.query(Application).filter(
            Application.intern_email == user_obj.email
        ).count()
        
        accepted_applications = db.query(Application).filter(
            Application.intern_email == user_obj.email,
            Application.status == "accepted"
        ).count()
        
        return {
            "total_applications": total_applications,
            "accepted_applications": accepted_applications,
            "user_type": "student"
        }


if __name__ == "__main__":
    # Allow running as: python backend/main.py
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,  # Enable auto-reload
        reload_dirs=["backend"] if DEBUG_MODE else None,  # Watch backend directory for changes
        log_level="debug" if DEBUG_MODE else "info"
    )
