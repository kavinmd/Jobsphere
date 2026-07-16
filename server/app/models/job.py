from beanie import Document, Link, Indexed
from pydantic import Field
from typing import Optional, Literal, List
from bson import ObjectId
from datetime import datetime

JobType = Literal["full-time", "part-time", "internship", "contract", "remote"]
JobStatus = Literal["open", "closed"]


class Job(Document):
    title: str = Field(..., max_length=150)
    company: str
    location: str
    description: str
    requirements: List[str] = Field(default_factory=list)
    salary: Optional[str] = None
    type: JobType
    posted_by: str = Field(..., alias="postedBy")   # stored as string ObjectId
    source: str = Field(default="internal")
    status: JobStatus = Field(default="open")
    application_count: int = Field(default=0, alias="applicationCount")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "jobs"

    model_config = {"populate_by_name": True}

    def to_dict(self, posted_by_info: Optional[dict] = None) -> dict:
        data = self.model_dump(by_alias=True)
        data["_id"] = str(self.id)
        if posted_by_info:
            data["postedBy"] = posted_by_info
        return data
