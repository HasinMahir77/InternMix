from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()


class Intern(Base):
    __tablename__ = "interns"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_num = Column(String, nullable=True)
    address = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    institution = Column(String, nullable=True)
    major = Column(String, nullable=True)
    cgpa = Column(Float, nullable=True)
    password_hash = Column(String, nullable=False)
    resume_path = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    internships = relationship("Internship", back_populates="intern")


class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    organization_name = Column(String, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    profile_image_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    internships = relationship("Internship", back_populates="recruiter")

class Internship(Base):
    __tablename__ = "internships"
    id = Column(Integer, primary_key=True, index=True)
    
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"), nullable=False)
    recruiter = relationship("Recruiter", back_populates="internships")

    intern_id = Column(Integer, ForeignKey("interns.id"), nullable=False)
    intern = relationship("Intern", back_populates="internships")

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    skills = Column(JSON, nullable=False, default=list)
    languages = Column(JSON, nullable=False, default=list)
    location = Column(String, nullable=False)
    salary = Column(Float, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
