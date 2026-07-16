from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from app.models.user import User

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "secret")
JWT_EXPIRES_IN = os.getenv("JWT_EXPIRES_IN", "7d")
ALGORITHM = "HS256"

bearer_scheme = HTTPBearer()


def _parse_expires_in(expires_in: str) -> int:
    """Convert duration string like '7d', '24h', '60m' to seconds."""
    unit = expires_in[-1]
    value = int(expires_in[:-1])
    return {"d": 86400, "h": 3600, "m": 60, "s": 1}.get(unit, 86400) * value


def generate_token(user_id: str, role: str) -> str:
    """Create a signed JWT for the given user."""
    expire = datetime.utcnow() + timedelta(seconds=_parse_expires_in(JWT_EXPIRES_IN))
    payload = {"id": user_id, "role": role, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


async def protect(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> User:
    """FastAPI dependency — verifies JWT and returns the authenticated User."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token.",
    )
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )
    return user
