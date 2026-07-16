from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from datetime import datetime
import os
from dotenv import load_dotenv

from app.config.database import connect_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.routers import auth, jobs, applications, users, scraper

load_dotenv()

CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")
PORT = int(os.getenv("PORT", 5000))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: connect to MongoDB and init Beanie."""
    await connect_db([User, Job, Application])
    yield
    # Shutdown: nothing to clean up for Motor


app = FastAPI(
    title="JobSphere API",
    description="Job Scraper Platform — Python/FastAPI backend",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CLIENT_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(users.router)
app.include_router(scraper.router)


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "success": True,
        "message": "Job Scraper Platform API is running 🚀",
        "timestamp": datetime.utcnow().isoformat(),
    }


# ── Global exception handler ───────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": str(exc) or "Internal server error."},
    )


if __name__ == "__main__":
    import uvicorn
    print(f"[*] Server running on http://localhost:{PORT}")
    print(f"[*] API Docs: http://localhost:{PORT}/docs")
    print(f"[*] API Health: http://localhost:{PORT}/api/health")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
