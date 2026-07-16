from beanie import Document, Indexed
from pydantic import EmailStr, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
        self.password = pwd_context.hash(self.password)

    def verify_password(self, plain_password: str) -> bool:
        """Compare plain password against the stored hash."""
        return pwd_context.verify(plain_password, self.password)

    def to_safe_dict(self) -> dict:
        """Return user data without password field."""
        data = self.model_dump(by_alias=True)
        data.pop("password", None)
        data["_id"] = str(self.id)
        return data
