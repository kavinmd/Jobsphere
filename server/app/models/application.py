from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

ApplicationStatus = Literal["pending", "reviewed", "shortlisted", "rejected"]
JobSource = Literal["internal", "linkedin", "naukri", "internshala", "unstop"]


class ExternalJobData(BaseModel):
    title: str
    company: str
    location: str
    apply_url: str = Field(..., alias="applyUrl")
    source: JobSource
    description: Optional[str] = None
    salary: Optional[str] = None

    model_config = {"populate_by_name": True}


class Application(Document):
    student_id: str = Field(..., alias="studentId")
    job_id: Optional[str] = Field(None, alias="jobId")
    job_source: JobSource = Field(..., alias="jobSource")
    external_job_data: Optional[ExternalJobData] = Field(None, alias="externalJobData")
    cover_letter: Optional[str] = Field(None, alias="coverLetter", max_length=2000)
    status: ApplicationStatus = Field(default="pending")
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "applications"

    model_config = {"populate_by_name": True}

    def to_dict(self) -> dict:
        data = self.model_dump(by_alias=True)
        data["_id"] = str(self.id)
        return data
