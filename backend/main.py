import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import init_db
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.challenges import router as challenges_router
from app.routers.hints import router as hints_router

app = FastAPI(
    title="CyberArena CTF Platform",
    description="A Capture The Flag cybersecurity challenge platform",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    init_db()
    # Auto-seed challenges if database is empty
    from app.database import SessionLocal
    from app.models import Challenge
    db = SessionLocal()
    if db.query(Challenge).count() == 0:
        db.close()
        from scripts.seed import seed
        seed()
    else:
        db.close()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


@app.get("/health")
async def health_check():
    return {"status": "CyberArena API is running"}


app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(challenges_router, prefix="/challenges", tags=["Challenges"])
app.include_router(hints_router, prefix="/hints", tags=["Hints"])
