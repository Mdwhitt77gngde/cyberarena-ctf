# cyberarena-ctf

A web-based Capture The Flag (CTF) platform where users can register,
browse cybersecurity challenges, submit flags, track progress,
and compete on a live leaderboard.

## Purpose

CyberArena was built to make ethical hacking and cybersecurity
education accessible to everyone. Players can work through challenges
across multiple categories and difficulty levels while competing
for top spots on the leaderboard.

## Features

- User registration and login with Admin and Player roles
- Admin panel to create, edit, and delete CTF challenges
- Challenge categories: Web Security, Cryptography, Linux/Command Line
- Flag submission with instant feedback and automatic point awarding
- Live leaderboard ranked by total points
- Hint system that costs points to reveal
- Player progress tracker showing solved vs unsolved challenges
- Admin dashboard with platform statistics

## Technology Stack

| Layer           | Technology       |
| --------------- | ---------------- |
| Frontend        | React            |
| Backend         | Python / FastAPI |
| Database        | SQLite           |
| Authentication  | JWT Tokens       |
| Version Control | GitHub           |

## Project Structure

cyberarena-ctf/
├── frontend/ ← React app
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.js
│ └── package.json
├── backend/ ← FastAPI app
│ ├── main.py
│ ├── models.py
│ ├── database.py
│ ├── routes/
│ └── requirements.txt
├── README.md
└── .gitignore

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Team

- David Whitten
- Rommel Ariel Juarez
- Jose Manuel Mendoza Torrico
- Emmanuel okyere

## Course

CSE 499 — Senior Project

## Favorite Quotes

- **Jose Manuel Mendoza Torrico:** "The quieter you become, the more you are able to hear." — Kali Linux Proverb

**Emmanuel Okyere:** "Two heads are better than one" - African Proverb

