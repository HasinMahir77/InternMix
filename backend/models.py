from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()


class Intern(Base):
    __tablename__ = "interns"

    email = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone_num = Column(String, nullable=True)
    address = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    major = Column(String, nullable=True)
    cgpa = Column(Float, nullable=True)
    password_hash = Column(String, nullable=False)
    # Public URL where resume PDF can be accessed (served from static uploads)
    resume_path = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    # Public URL for profile image (served from static uploads)
    profile_image_url = Column(String, nullable=True)
    # Absolute filesystem paths for server-side storage (cross-platform safe via pathlib)
    profile_image_path = Column(String, nullable=True)
    resume_pdf_path = Column(String, nullable=True)
    # Parsed structured data stored as JSON
    resume_parsed = Column(JSON, nullable=True)
    github_parsed = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="intern")


class Recruiter(Base):
    __tablename__ = "recruiters"

    email = Column(String, primary_key=True, index=True)
    organization_name = Column(String, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    profile_image_url = Column(String, nullable=True)
    profile_image_path = Column(String, nullable=True)
    website = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("Listing", back_populates="recruiter")


class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    recruiter_email = Column(String, ForeignKey("recruiters.email"), nullable=False)
    recruiter = relationship("Recruiter", back_populates="listings")
    
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    major = Column(String, nullable=False)
    recommended_cgpa = Column(Float, nullable=True)
    duration_months = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    is_remote = Column(Boolean, default=False)
    required_skills = Column(JSON, nullable=False, default=list)
    optional_skills = Column(JSON, nullable=False, default=list)
    deadline = Column(String, nullable=False)
    archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="listing")


class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    listing = relationship("Listing", back_populates="applications")
    
    intern_email = Column(String, ForeignKey("interns.email"), nullable=False)
    intern = relationship("Intern", back_populates="applications")
    
    status = Column(String, nullable=False, default="pending")  # pending, accepted, waitlisted, rejected
    similarity_score = Column(Float, nullable=True)
    applied_at = Column(DateTime, default=datetime.utcnow)
