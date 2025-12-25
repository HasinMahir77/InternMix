#!/usr/bin/env python3
"""
Update profile images with placeholder avatars
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Intern, Recruiter

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def update_profile_images():
    db = SessionLocal()

    try:
        # Update interns
        interns = db.query(Intern).all()
        print("Updating intern profile images...")

        for intern in interns:
            # Create avatar URL with initials and background color
            name = f"{intern.first_name}+{intern.last_name}"
            # Use different colors for variety
            colors = ['3B82F6', '8B5CF6', 'EC4899', '10B981', 'F59E0B', '6366F1']
            color_idx = hash(intern.email) % len(colors)
            color = colors[color_idx]

            intern.profile_image_url = f"https://ui-avatars.com/api/?name={name}&background={color}&color=fff&size=200&bold=true"
            print(f"  [+] {intern.first_name} {intern.last_name}: {intern.profile_image_url}")

        # Update recruiters
        recruiters = db.query(Recruiter).all()
        print("\nUpdating recruiter profile images...")

        for recruiter in recruiters:
            # Create avatar URL with initials
            name = f"{recruiter.first_name}+{recruiter.last_name}"
            # Use darker colors for recruiters
            colors = ['1E40AF', '6B21A8', 'BE185D', '065F46', 'B45309', '4338CA']
            color_idx = hash(recruiter.email) % len(colors)
            color = colors[color_idx]

            recruiter.profile_image_url = f"https://ui-avatars.com/api/?name={name}&background={color}&color=fff&size=200&bold=true"
            print(f"  [+] {recruiter.first_name} {recruiter.last_name} ({recruiter.organization_name}): {recruiter.profile_image_url}")

        db.commit()

        print("\n" + "="*70)
        print("Profile images updated successfully!")
        print("="*70)
        print(f"\nUpdated {len(interns)} intern profiles")
        print(f"Updated {len(recruiters)} recruiter profiles")

    except Exception as e:
        print(f"Error updating profile images: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("="*70)
    print("Update Profile Images with Placeholder Avatars")
    print("="*70)
    print("\nThis will update all profile images to use placeholder avatars.")

    response = input("\nContinue? (yes/no): ")
    if response.lower() != "yes":
        print("Operation cancelled.")
        sys.exit(0)

    update_profile_images()
    print("\nDone! Refresh your browser to see the new profile images.")
