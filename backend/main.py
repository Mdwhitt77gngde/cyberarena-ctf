from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes import auth, challenges, users

# Initialize the FastAPI application
app = FastAPI(
    title="CyberArena CTF Platform",
    description="A Capture The Flag cybersecurity challenge platform",
    version="1.0.0"
)

# CORS Middleware - allows React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler - returns clean JSON errors instead of crashes
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc)
        }
    )

# Health check endpoint - confirms server is running
@app.get("/health")
async def health_check():
    return {"status": "CyberArena API is running"}

# Register route modules
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(challenges.router, prefix="/challenges", tags=["Challenges"])
app.include_router(users.router, prefix="/users", tags=["Users"])