from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db

app = FastAPI(title="CyberArena CTF API", version="1.0.0")

# Configure CORS so the React frontend can communicate with this API without cross-origin blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Initialize the database schema when the FastAPI application starts."""
    init_db()


@app.get("/")
def read_root() -> dict:
    """Health check endpoint for the CyberArena CTF API."""
    return {
        "status": "healthy",
        "project": "CyberArena CTF Platform",
        "version": "1.0.0",
    }
