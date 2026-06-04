#!/usr/bin/env python3
"""
Seed script for the CyberArena CTF platform.

Populates the database with sample challenges (and their hints) spread across
three distinct categories: Web, Crypto and Forensics. It is safe to run
multiple times: existing challenges are matched by title and skipped instead of
being duplicated.

Run it from the `backend/` directory with:

    python -m scripts.seed
"""

import os
import sys

# Allow running the file directly (python scripts/seed.py) by making the
# `backend/` package root importable.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, init_db
from app.models import Challenge, Hint


# Each entry defines a challenge plus the hints that belong to it.
SEED_CHALLENGES = [
    # --- Category 1: Web ---
    {
        "title": "Inspect the Source",
        "description": "The flag is hidden somewhere in the page's HTML source. Take a closer look.",
        "category": "Web",
        "difficulty": "Easy",
        "points": 100,
        "flag": "FLAG{view_source_is_your_friend}",
        "hints": [
            {"content": "Try pressing Ctrl+U to view the page source.", "point_cost": 10},
            {"content": "Look for HTML comments that the developer forgot to remove.", "point_cost": 20},
        ],
    },
    {
        "title": "Cookie Monster",
        "description": "Authentication is handled by a cookie. Can you become the admin?",
        "category": "Web",
        "difficulty": "Medium",
        "points": 250,
        "flag": "FLAG{cookies_should_never_be_trusted}",
        "hints": [
            {"content": "Open your browser dev tools and inspect the stored cookies.", "point_cost": 15},
            {"content": "What happens if you change the 'role' cookie value to 'admin'?", "point_cost": 30},
        ],
    },
    # --- Category 2: Crypto ---
    {
        "title": "Caesar's Secret",
        "description": "An old message was encrypted by shifting each letter. Decrypt it.",
        "category": "Crypto",
        "difficulty": "Easy",
        "points": 150,
        "flag": "FLAG{rotation_thirteen_classic}",
        "hints": [
            {"content": "This is a substitution cipher with a fixed letter shift.", "point_cost": 10},
            {"content": "Try a shift of 13 (ROT13).", "point_cost": 20},
        ],
    },
    {
        "title": "Base of Operations",
        "description": "The flag has been encoded, not encrypted. Decode the given string.",
        "category": "Crypto",
        "difficulty": "Medium",
        "points": 200,
        "flag": "FLAG{base64_is_encoding_not_encryption}",
        "hints": [
            {"content": "The string ends with '=' padding characters.", "point_cost": 15},
            {"content": "Try decoding it as Base64.", "point_cost": 25},
        ],
    },
    # --- Category 3: Forensics ---
    {
        "title": "Hidden in Plain Sight",
        "description": "A seemingly ordinary image file hides a secret message inside it.",
        "category": "Forensics",
        "difficulty": "Medium",
        "points": 250,
        "flag": "FLAG{steganography_reveals_all}",
        "hints": [
            {"content": "Inspect the file's metadata and embedded strings.", "point_cost": 15},
            {"content": "Steganography tools can extract data hidden inside images.", "point_cost": 30},
        ],
    },
    {
        "title": "Packet Detective",
        "description": "A network capture contains credentials sent in clear text. Find the flag.",
        "category": "Forensics",
        "difficulty": "Hard",
        "points": 350,
        "flag": "FLAG{always_use_https}",
        "hints": [
            {"content": "Open the capture file in a network analyzer like Wireshark.", "point_cost": 20},
            {"content": "Filter for HTTP traffic and read the POST request bodies.", "point_cost": 40},
        ],
    },
]


def seed_database() -> None:
    """Insert sample challenges and hints if they are not already present."""
    # Make sure the tables exist before we try to write to them.
    init_db()

    db = SessionLocal()
    created_challenges = 0
    created_hints = 0
    try:
        for entry in SEED_CHALLENGES:
            existing = (
                db.query(Challenge)
                .filter(Challenge.title == entry["title"])
                .first()
            )
            if existing:
                print(f"- Skipping existing challenge: {entry['title']}")
                continue

            challenge = Challenge(
                title=entry["title"],
                description=entry["description"],
                category=entry["category"],
                difficulty=entry["difficulty"],
                points=entry["points"],
                flag=entry["flag"],
            )
            db.add(challenge)
            db.flush()  # assigns challenge.id without committing yet

            for hint in entry["hints"]:
                db.add(
                    Hint(
                        challenge_id=challenge.id,
                        content=hint["content"],
                        point_cost=hint["point_cost"],
                    )
                )
                created_hints += 1

            created_challenges += 1
            print(f"+ Created challenge: {entry['title']} ({entry['category']})")

        db.commit()
        print(
            f"\nDone. Added {created_challenges} new challenge(s) "
            f"and {created_hints} hint(s)."
        )
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
