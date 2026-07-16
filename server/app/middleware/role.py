from fastapi import HTTPException, status, Depends
from typing import Callable
from app.models.user import User
from app.middleware.auth import protect


def authorize(*roles: str) -> Callable:
    """
    FastAPI dependency factory that checks whether the authenticated user's
    role is in the allowed list, mirroring the Express authorize() middleware.
    """
    async def _check_role(current_user: User = Depends(protect)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. This action requires one of the following roles: {', '.join(roles)}.",
            )
        return current_user
    return _check_role
