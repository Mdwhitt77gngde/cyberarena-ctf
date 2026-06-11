#!/usr/bin/env python3
"""
Setup script to initialize admin users and test data
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, init_db
from app.models import User, Challenge, Hint
from app.security import hash_password

def setup_database():
    """Initialize database and create admin user."""
    # Initialize DB schema
    init_db()
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "adminuser").first()
        if not admin:
            print("Creating admin user...")
            admin = User(
                username="adminuser",
                email="admin@cyberarena.local",
                hashed_password=hash_password("AdminPassword123!"),
                is_active=True,
                role="admin",
                score=5000
            )
            db.add(admin)
        else:
            # Update existing admin to have admin role
            admin.role = "admin"
            admin.score = 5000
            print("Updating existing admin user...")
        
        db.commit()
        print(f"✓ Admin user configured: {admin.username} (role: {admin.role})")
        
        # Create some sample challenges
        web_challenge = db.query(Challenge).filter(Challenge.title == "Web Challenge 101").first()
        if not web_challenge:
            print("Creating sample challenges...")
            challenges = [
                Challenge(
                    title="Web Challenge 101",
                    description="Find the hidden flag in the web application",
                    category="Web",
                    difficulty="Easy",
                    points=100,
                    flag="FLAG{web_challenge_secret}"
                ),
                Challenge(
                    title="Crypto Challenge 101",
                    description="Decrypt the cipher",
                    category="Crypto",
                    difficulty="Medium",
                    points=200,
                    flag="FLAG{crypto_secret}"
                ),
                Challenge(
                    title="Forensic Analysis",
                    description="Analyze the memory dump",
                    category="Forensic",
                    difficulty="Hard",
                    points=300,
                    flag="FLAG{forensic_flag}"
                ),
            ]
            for challenge in challenges:
                db.add(challenge)
            db.commit()
            print(f"✓ Created {len(challenges)} sample challenges")
            
            # Create hints for challenges
            for challenge in challenges:
                db.refresh(challenge)
                hints = [
                    Hint(
                        challenge_id=challenge.id,
                        content=f"Try looking at the {challenge.category.lower()} aspects of the challenge",
                        point_cost=10
                    ),
                    Hint(
                        challenge_id=challenge.id,
                        content=f"This is a common {challenge.category.lower()} vulnerability pattern",
                        point_cost=20
                    ),
                ]
                for hint in hints:
                    db.add(hint)
            db.commit()
            print("✓ Created sample hints for challenges")
        
        print("\n✓ Database setup complete!")
        
    finally:
        db.close()


if __name__ == "__main__":
    setup_database()
