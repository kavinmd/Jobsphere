from beanie import Document, Indexed
from pydantic import EmailStr, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
import bcrypt

UserRole = Literal["student", "hiring_manager"]


class User(Document):
    name: str = Field(..., max_length=100)
    email: Indexed(EmailStr, unique=True)  # type: ignore[valid-type]
    password: str
    role: UserRole
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    resume_url: Optional[str] = Field(None, alias="resumeUrl")
    company: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        use_enum_values = True

    model_config = {"populate_by_name": True}

    @field_validator("email", mode="before")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower().strip()

    @field_validator("name", mode="before")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()

    def hash_password(self) -> None:
        """Hash the current plain-text password in place."""
        password_bytes = self.password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        self.password = hashed.decode('utf-8')

    def verify_password(self, plain_password: str) -> bool:
        """Compare plain password against the stored hash."""
        try:
            return bcrypt.checkpw(
                plain_password.encode('utf-8'),
                self.password.encode('utf-8')
            )
        except Exception:
            return False

    def to_safe_dict(self) -> dict:
        """Return user data without password field."""
        data = self.model_dump(by_alias=True)
        data.pop("password", None)
        data["_id"] = str(self.id)
        return data
