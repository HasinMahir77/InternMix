#!/usr/bin/env python3
"""
Update profile images to use local uploaded images
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

def update_to_local_images():
    db = SessionLocal()

    try:
        print("Updating to local profile images...")

        # Map emails to image files
        intern_images = {
            'hasinmahir@gmail.com': 'mahir.jpg',
            'abid@gmail.com': 'supto.jpg',
        }

        recruiter_images = {
            'google@google.com': 'google.png',
            'meta@meta.com': 'meta.png',
        }

        # Update interns
        print("\nUpdating intern profiles:")
        for email, image_file in intern_images.items():
            intern = db.query(Intern).filter(Intern.email == email).first()
            if intern:
                intern.profile_image_url = f"/uploads/profile_images/{image_file}"
                intern.profile_image_path = f"uploads/profile_images/{image_file}"
                print(f"  [+] {intern.first_name} {intern.last_name}: {intern.profile_image_url}")
            else:
                print(f"  [-] Intern not found: {email}")

        # Update recruiters
        print("\nUpdating recruiter profiles:")
        for email, image_file in recruiter_images.items():
            recruiter = db.query(Recruiter).filter(Recruiter.email == email).first()
            if recruiter:
                recruiter.profile_image_url = f"/uploads/profile_images/{image_file}"
                recruiter.profile_image_path = f"uploads/profile_images/{image_file}"
                print(f"  [+] {recruiter.first_name} {recruiter.last_name} ({recruiter.organization_name}): {recruiter.profile_image_url}")
            else:
                print(f"  [-] Recruiter not found: {email}")

        db.commit()

        print("\n" + "="*70)
        print("Local profile images updated successfully!")
        print("="*70)

    except Exception as e:
        print(f"Error updating images: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("="*70)
    print("Update Profile Images to Local Files")
    print("="*70)
    print("\nThis will update profile images to use local uploaded files.")
    print("\nImages found:")
    print("  - mahir.jpg")
    print("  - supto.jpg")
    print("  - google.png")
    print("  - meta.png")

    response = input("\nContinue? (yes/no): ")
    if response.lower() != "yes":
        print("Operation cancelled.")
        sys.exit(0)

    update_to_local_images()
    print("\nDone! Restart backend and refresh browser to see the images.")
