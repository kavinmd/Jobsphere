from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.user import User
from app.middleware.auth import protect

router = APIRouter(prefix="/api/users", tags=["Users"])


# ── Request schemas ────────────────────────────────────────────────────────────

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    resumeUrl: Optional[str] = None
    company: Optional[str] = None
    avatar: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    currentPassword: str
    newPassword: str


class ForceResetPasswordRequest(BaseModel):
    newPassword: str


# ── Routes ─────────────────────────────────────────────────────────────────────

# GET /api/users/profile
@router.get("/profile")
async def get_profile(current_user: User = Depends(protect)):
    return {"success": True, "data": {"user": current_user.to_safe_dict()}}


# PUT /api/users/profile
@router.put("/profile")
async def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(protect),
):
    update_data: dict = {"updated_at": datetime.utcnow()}

    if body.name is not None:
        update_data["name"] = body.name
    if body.phone is not None:
        update_data["phone"] = body.phone
    if body.location is not None:
        update_data["location"] = body.location
    if body.bio is not None:
        update_data["bio"] = body.bio
    if body.resumeUrl is not None:
        update_data["resumeUrl"] = body.resumeUrl
    if body.company is not None and current_user.role == "hiring_manager":
        update_data["company"] = body.company
    if body.avatar is not None:
        update_data["avatar"] = body.avatar

    await current_user.set(update_data)
    # Re-fetch from DB so to_safe_dict() reflects the freshly saved values
    refreshed = await User.get(current_user.id)
    return {
        "success": True,
        "message": "Profile updated successfully.",
        "data": {"user": refreshed.to_safe_dict()},
    }


# PUT /api/users/change-password
@router.put("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(protect),
):
    if not current_user.verify_password(body.currentPassword):
        raise HTTPException(400, "Current password is incorrect.")

    current_user.password = body.newPassword
    current_user.hash_password()
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return {"success": True, "message": "Password changed successfully."}


# PUT /api/users/force-reset-password
# The user is already authenticated via JWT — no current password needed.
@router.put("/force-reset-password")
async def force_reset_password(
    body: ForceResetPasswordRequest,
    current_user: User = Depends(protect),
):
    if len(body.newPassword) < 6:
        raise HTTPException(400, "New password must be at least 6 characters.")

    current_user.password = body.newPassword
    current_user.hash_password()
    current_user.updated_at = datetime.utcnow()
    await current_user.save()

    return {"success": True, "message": "Password reset successfully."}
