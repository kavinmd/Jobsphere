from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import User
from app.middleware.auth import generate_token, protect

router = APIRouter(prefix="/api/auth", tags=["Auth"])


# ── Request schemas ────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    company: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ── Helpers ────────────────────────────────────────────────────────────────────

def _user_public(user: User, include_full: bool = False) -> dict:
    base = {
        "_id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company": user.company,
    }
    if include_full:
        base.update({
            "location": user.location,
            "bio": user.bio,
            "phone": user.phone,
            "resumeUrl": user.resume_url,
            "avatar": user.avatar,
        })
    return base


# ── Routes ─────────────────────────────────────────────────────────────────────

# POST /api/auth/register
@router.post("/register", status_code=201)
async def register(body: RegisterRequest):
    if body.role not in ("student", "hiring_manager"):
        raise HTTPException(400, "Invalid role. Must be student or hiring_manager.")
    if body.role == "hiring_manager" and not body.company:
        raise HTTPException(400, "Company name is required for hiring managers.")

    existing = await User.find_one(User.email == body.email.lower())
    if existing:
        raise HTTPException(400, "User with this email already exists.")

    user = User(
        name=body.name,
        email=body.email,
        password=body.password,
        role=body.role,  # type: ignore[arg-type]
        company=body.company,
    )
    user.hash_password()
    await user.insert()

    token = generate_token(str(user.id), user.role)
    return {
        "success": True,
        "message": "Account created successfully.",
        "data": {"token": token, "user": _user_public(user)},
    }


# POST /api/auth/login
@router.post("/login")
async def login(body: LoginRequest):
    user = await User.find_one(User.email == body.email.lower())
    if not user or not user.verify_password(body.password):
        raise HTTPException(401, "Invalid credentials.")

    token = generate_token(str(user.id), user.role)
    return {
        "success": True,
        "message": "Login successful.",
        "data": {"token": token, "user": _user_public(user, include_full=True)},
    }


# GET /api/auth/me
@router.get("/me")
async def get_me(current_user: User = Depends(protect)):
    return {"success": True, "data": {"user": _user_public(current_user, include_full=True)}}
