from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import init_db
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.challenges import router as challenges_router

app = FastAPI(
    title="CyberArena CTF Platform",
    description="A Capture The Flag cybersecurity challenge platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    """Create and verify the database schema at startup."""
    init_db()


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
