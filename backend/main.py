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

from backend.models import Base, Intern, Recruiter

# Database setup (SQLite)
DATABASE_URL = os.getenv("INTERNMIX_DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base.metadata.create_all(bind=engine)


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
    id: int
    email: str
    first_name: str
    last_name: str
    user_type: str


app = FastAPI(title="InternMix API")

# CORS for Vite dev server
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        id=user.id,
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
    token = create_access_token(subject=f"{user_type}:{user_obj.id}")
    return TokenResponse(
        access_token=token,
        user={
            "id": user_obj.id,
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
        user_type, _, id_str = str(sub).partition(":")
        user_id = int(id_str)
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    if user_type == "student":
        user = db.get(Intern, user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user, user_type
    elif user_type == "recruiter":
        user = db.get(Recruiter, user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user, user_type
    raise HTTPException(status_code=401, detail="Invalid token subject")


@app.get("/api/auth/me", response_model=UserResponse)
def me(dep=Depends(get_current_user)):
    user_obj, user_type = dep
    return UserResponse(
        id=user_obj.id,
        email=user_obj.email,
        first_name=user_obj.first_name,
        last_name=user_obj.last_name,
        user_type=user_type,
    )



if __name__ == "__main__":
    # Allow running as: python backend/main.py
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
