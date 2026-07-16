from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import re
from bson import ObjectId

from app.models.job import Job
from app.models.application import Application
from app.models.user import User
from app.middleware.auth import protect
from app.middleware.role import authorize

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


# ── Request schemas ────────────────────────────────────────────────────────────

class JobCreateRequest(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: Optional[List[str] | str] = None
    salary: Optional[str] = None
    type: str


class JobUpdateRequest(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str] | str] = None
    salary: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None


# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_requirements(req) -> List[str]:
    if req is None:
        return []
    if isinstance(req, list):
        return req
    return [r for r in req.split("\n") if r]


async def _enrich_job(job: Job) -> dict:
    """Populate postedBy with user name and company."""
    data = job.model_dump(by_alias=True)
    data["_id"] = str(job.id)
    try:
        poster = await User.get(job.posted_by)
        if poster:
            data["postedBy"] = {"_id": str(poster.id), "name": poster.name, "company": poster.company}
    except Exception:
        pass
    return data


# ── Routes ─────────────────────────────────────────────────────────────────────

# GET /api/jobs  — all open jobs (paginated, filterable)
@router.get("/")
async def get_all_jobs(
    keyword: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    _: User = Depends(protect),
):
    query_filter = {"status": "open"}
    if keyword:
        regex = re.compile(keyword, re.IGNORECASE)
        query_filter["$or"] = [
            {"title": regex},
            {"company": regex},
            {"description": regex},
        ]
    if location:
        query_filter["location"] = re.compile(location, re.IGNORECASE)
    if type:
        query_filter["type"] = type

    skip = (page - 1) * limit
    total = await Job.find(query_filter).count()
    jobs_raw = await Job.find(query_filter).skip(skip).limit(limit).sort("-created_at").to_list()
    jobs = [await _enrich_job(j) for j in jobs_raw]

    return {
        "success": True,
        "data": {
            "jobs": jobs,
            "total": total,
            "page": page,
            "totalPages": -(-total // limit),
        },
    }


# GET /api/jobs/my  — manager's own jobs
@router.get("/my")
async def get_my_jobs(current_user: User = Depends(authorize("hiring_manager"))):
    jobs_raw = await Job.find({"posted_by": str(current_user.id)}).sort("-created_at").to_list()

    # Aggregate application counts
    job_ids = [str(j.id) for j in jobs_raw]
    count_map: dict[str, int] = {}
    for jid in job_ids:
        count_map[jid] = await Application.find({"job_id": jid}).count()

    jobs = []
    for j in jobs_raw:
        d = j.model_dump(by_alias=True)
        d["_id"] = str(j.id)
        d["applicationCount"] = count_map.get(str(j.id), 0)
        jobs.append(d)

    return {"success": True, "data": {"jobs": jobs}}


# GET /api/jobs/stats  — manager dashboard stats
@router.get("/stats")
async def get_manager_stats(current_user: User = Depends(authorize("hiring_manager"))):
    manager_id = str(current_user.id)
    total_jobs = await Job.find({"posted_by": manager_id}).count()
    open_jobs = await Job.find({"posted_by": manager_id, "status": "open"}).count()

    my_job_ids = [str(j.id) for j in await Job.find({"posted_by": manager_id}).to_list()]
    total_applicants = await Application.find({"job_id": {"$in": my_job_ids}}).count()
    pending_applicants = await Application.find({"job_id": {"$in": my_job_ids}, "status": "pending"}).count()

    return {
        "success": True,
        "data": {
            "totalJobs": total_jobs,
            "openJobs": open_jobs,
            "totalApplicants": total_applicants,
            "pendingApplicants": pending_applicants,
        },
    }


# GET /api/jobs/:id  — single job
@router.get("/{job_id}")
async def get_job_by_id(job_id: str, _: User = Depends(protect)):
    try:
        job = await Job.get(job_id)
    except Exception:
        raise HTTPException(404, "Job not found.")
    if not job:
        raise HTTPException(404, "Job not found.")

    data = await _enrich_job(job)
    try:
        poster = await User.get(job.posted_by)
        if poster:
            data["postedBy"] = {
                "_id": str(poster.id),
                "name": poster.name,
                "company": poster.company,
                "email": poster.email,
            }
    except Exception:
        pass
    return {"success": True, "data": {"job": data}}


# POST /api/jobs  — create a job
@router.post("/", status_code=201)
async def create_job(
    body: JobCreateRequest,
    current_user: User = Depends(authorize("hiring_manager")),
):
    if not all([body.title, body.company, body.location, body.description, body.type]):
        raise HTTPException(400, "Please provide all required fields.")

    job = Job(
        title=body.title,
        company=body.company,
        location=body.location,
        description=body.description,
        requirements=_parse_requirements(body.requirements),
        salary=body.salary,
        type=body.type,  # type: ignore[arg-type]
        posted_by=str(current_user.id),
        source="internal",
    )
    await job.insert()
    data = job.model_dump(by_alias=True)
    data["_id"] = str(job.id)
    return {"success": True, "message": "Job posted successfully.", "data": {"job": data}}


# PUT /api/jobs/:id  — update a job
@router.put("/{job_id}")
async def update_job(
    job_id: str,
    body: JobUpdateRequest,
    current_user: User = Depends(authorize("hiring_manager")),
):
    try:
        job = await Job.get(job_id)
    except Exception:
        raise HTTPException(404, "Job not found.")
    if not job:
        raise HTTPException(404, "Job not found.")
    if job.posted_by != str(current_user.id):
        raise HTTPException(403, "Not authorized to update this job.")

    update_data: dict = {}
    if body.title is not None:
        update_data["title"] = body.title
    if body.company is not None:
        update_data["company"] = body.company
    if body.location is not None:
        update_data["location"] = body.location
    if body.description is not None:
        update_data["description"] = body.description
    if body.requirements is not None:
        update_data["requirements"] = _parse_requirements(body.requirements)
    if body.salary is not None:
        update_data["salary"] = body.salary
    if body.type is not None:
        update_data["type"] = body.type
    if body.status is not None:
        update_data["status"] = body.status
    update_data["updated_at"] = datetime.utcnow()

    await job.set(update_data)
    data = job.model_dump(by_alias=True)
    data["_id"] = str(job.id)
    return {"success": True, "message": "Job updated successfully.", "data": {"job": data}}


# DELETE /api/jobs/:id  — delete a job
@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    current_user: User = Depends(authorize("hiring_manager")),
):
    try:
        job = await Job.get(job_id)
    except Exception:
        raise HTTPException(404, "Job not found.")
    if not job:
        raise HTTPException(404, "Job not found.")
    if job.posted_by != str(current_user.id):
        raise HTTPException(403, "Not authorized to delete this job.")

    await job.delete()
    await Application.find({"job_id": job_id}).delete()
    return {"success": True, "message": "Job deleted successfully."}
