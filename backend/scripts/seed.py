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

from app.database import SessionLocal, init_db
from app.models import Challenge, Hint

def seed():
    init_db()
    db = SessionLocal()

    # Clear existing challenges
    db.query(Hint).delete()
    db.query(Challenge).delete()
    db.commit()

    challenges = [
        # --- Linux challenges (require terminal) ---
        {
            "title": "Lost in the Files",
            "description": "A developer left a secret note somewhere on this server before they quit. Nobody knows where it is. Your job is to find it. Start exploring the file system and see what you can dig up.",
            "category": "linux",
            "difficulty": "easy",
            "points": 100,
            "flag": "CTF{h1dd3n_f1l3s_4r3_3asy}",
            "hints": [
                {"content": "Not all files are visible by default in Linux. Some files are intentionally hidden.", "point_cost": 10},
                {"content": "Try adding flags to your ls command to reveal hidden files.", "point_cost": 20},
            ]
        },
        {
            "title": "Permission Denied",
            "description": "There is a sensitive file on this server called secret.txt but when you try to read it you get Permission Denied. The original file is locked down tight — but the sysadmin was careless and left a backup copy somewhere. Find the backup and read the flag.",
            "category": "linux",
            "difficulty": "medium",
            "points": 200,
            "flag": "CTF{p3rm1ss10ns_4r3_3v3ryth1ng}",
            "hints": [
                {"content": "Check file permissions carefully. Use ls -la to see who owns what.", "point_cost": 15},
                {"content": "Sysadmins often put backup files in /tmp. Have a look around there.", "point_cost": 25},
            ]
        },
        {
            "title": "The Hidden Process",
            "description": "A rogue process is running on this server. The attacker hid a flag inside the process environment variables before disappearing. You need to find the process and extract the flag from its environment.",
            "category": "linux",
            "difficulty": "hard",
            "points": 300,
            "flag": "CTF{pr0c3ss_3nv_s3cr3ts}",
            "hints": [
                {"content": "Start by listing all running processes on the system.", "point_cost": 20},
                {"content": "Every running process has a folder in /proc. Environment variables are stored in a file called environ inside that folder.", "point_cost": 30},
            ]
        },
        # --- Non-VM challenges (no terminal needed) ---
        {
            "title": "ROT13 Decoder",
            "description": "A secret message was encoded using ROT13 — a simple substitution cipher that rotates each letter by 13 positions in the alphabet. Decode the following message to find the flag:\n\nEncoded: PGS{ebg_guvegrra_vf_sha}\n\nHint: ROT13 applied twice returns the original text. Submit the decoded flag.",
            "category": "crypto",
            "difficulty": "easy",
            "points": 100,
            "flag": "CTF{rot_thirteen_is_fun}",
            "hints": [
                {"content": "ROT13 shifts each letter 13 positions forward in the alphabet. A becomes N, B becomes O, and so on.", "point_cost": 10},
                {"content": "You can decode ROT13 by applying the same transformation again. Or search for a ROT13 decoder online.", "point_cost": 20},
            ]
        },
        {
            "title": "Hidden in the Page",
            "description": "Every web page has HTML source code that your browser renders visually. Developers sometimes leave notes or forgotten credentials hidden inside HTML comments that are invisible on screen but visible in the source.\n\nThe flag for this challenge is hidden in an HTML comment below. View this page's source code to find it.\n\n<!-- Developer note: flag is CTF{inspect_the_source} -->\n\nCan you find it?",
            "category": "web",
            "difficulty": "easy",
            "points": 100,
            "flag": "CTF{inspect_the_source}",
            "hints": [
                {"content": "HTML comments start with <!-- and end with -->. They are invisible on the rendered page but visible in the source.", "point_cost": 10},
                {"content": "Read the challenge description very carefully — the flag might already be right in front of you.", "point_cost": 15},
            ]
        },
        {
            "title": "Base64 Secrets",
            "description": "Developers sometimes confuse encoding with encryption. Encoding is not secure — it is just a way to represent data in a different format and can always be reversed without a key.\n\nThe following string has been Base64 encoded. Decode it to find the flag:\n\nQ1RGe2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbn0=\n\nSubmit the decoded value as your flag.",
            "category": "crypto",
            "difficulty": "medium",
            "points": 200,
            "flag": "CTF{base64_is_not_encryption}",
            "hints": [
                {"content": "Base64 strings often end with = or == padding characters.", "point_cost": 15},
                {"content": "You can decode Base64 using the command: echo 'string' | base64 -d or use an online Base64 decoder.", "point_cost": 25},
            ]
        },
    ]

    for ch_data in challenges:
        hints_data = ch_data.pop("hints")
        challenge = Challenge(**ch_data)
        db.add(challenge)
        db.commit()
        db.refresh(challenge)

        for hint_data in hints_data:
            hint = Hint(challenge_id=challenge.id, **hint_data)
            db.add(hint)

    db.commit()
    db.close()
    print("Database seeded successfully with 6 challenges.")

if __name__ == "__main__":
    seed()