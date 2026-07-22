from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.models.application import Application, ExternalJobData
from app.models.job import Job
from app.models.user import User
from app.middleware.auth import protect
from app.middleware.role import authorize

router = APIRouter(prefix="/api/applications", tags=["Applications"])


# ── Request schemas ────────────────────────────────────────────────────────────

class ExternalJobDataRequest(BaseModel):
    title: str
    company: str
    location: str
    applyUrl: str
    source: str
    description: Optional[str] = None
    salary: Optional[str] = None


class ApplyRequest(BaseModel):
    jobId: Optional[str] = None
    jobSource: str
    externalJobData: Optional[ExternalJobDataRequest] = None
    coverLetter: Optional[str] = None


class UpdateStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = None


# ── Helpers ────────────────────────────────────────────────────────────────────

async def _enrich_application_with_job(app: Application) -> dict:
    """Populate jobId with basic job info."""
    data = app.model_dump(by_alias=True)
    data["_id"] = str(app.id)
    if app.job_id:
        try:
            job = await Job.get(app.job_id)
            if job:
                data["jobId"] = {
                    "_id": str(job.id),
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "type": job.type,
                    "status": job.status,
                }
        except Exception:
            pass
    return data


async def _enrich_application_with_student(app: Application) -> dict:
    """Populate studentId with student info."""
    data = app.model_dump(by_alias=True)
    data["_id"] = str(app.id)
    try:
        student = await User.get(app.student_id)
        if student:
            data["studentId"] = {
                "_id": str(student.id),
                "name": student.name,
                "email": student.email,
                "phone": student.phone,
                "location": student.location,
                "bio": student.bio,
                "resumeUrl": student.resume_url,
            }
    except Exception:
        pass
    return data


# ── Routes ─────────────────────────────────────────────────────────────────────

# POST /api/applications  — apply to a job
@router.post("/", status_code=201)
async def apply_to_job(
    body: ApplyRequest,
    current_user: User = Depends(authorize("student")),
):
    student_id = str(current_user.id)

    if not body.jobSource:
        raise HTTPException(400, "jobSource is required.")

    if body.jobSource == "internal":
        if not body.jobId:
            raise HTTPException(400, "jobId is required for internal jobs.")

        try:
            job = await Job.get(body.jobId)
        except Exception:
            raise HTTPException(404, "Job not found or is closed.")
        if not job or job.status == "closed":
            raise HTTPException(404, "Job not found or is closed.")

        existing = await Application.find_one({"studentId": student_id, "jobId": body.jobId})
        if existing:
            raise HTTPException(400, "You have already applied to this job.")

        application = Application(
            student_id=student_id,
            job_id=body.jobId,
            job_source="internal",  # type: ignore[arg-type]
            cover_letter=body.coverLetter,
            status="pending",
        )
        await application.insert()

        # Increment application count
        await job.inc({Job.application_count: 1})

        populated = await _enrich_application_with_job(application)
        return {
            "success": True,
            "message": "Application submitted successfully.",
            "data": {"application": populated},
        }

    else:
        if not body.externalJobData:
            raise HTTPException(400, "externalJobData is required for external jobs.")

        existing = await Application.find_one({
            "studentId": student_id,
            "externalJobData.applyUrl": body.externalJobData.applyUrl,
        })
        if existing:
            raise HTTPException(400, "You have already applied to this job.")

        ext = ExternalJobData(
            title=body.externalJobData.title,
            company=body.externalJobData.company,
            location=body.externalJobData.location,
            apply_url=body.externalJobData.applyUrl,
            source=body.externalJobData.source,  # type: ignore[arg-type]
            description=body.externalJobData.description,
            salary=body.externalJobData.salary,
        )
        application = Application(
            student_id=student_id,
            job_source=body.jobSource,  # type: ignore[arg-type]
            external_job_data=ext,
            cover_letter=body.coverLetter,
            status="pending",
        )
        await application.insert()
        data = application.model_dump(by_alias=True)
        data["_id"] = str(application.id)
        return {
            "success": True,
            "message": "Application recorded successfully.",
            "data": {"application": data},
        }


# GET /api/applications/my  — student's own applications
@router.get("/my")
async def get_my_applications(current_user: User = Depends(authorize("student"))):
    apps_raw = (
        await Application.find({"studentId": str(current_user.id)})
        .sort("-created_at")
        .to_list()
    )
    apps = [await _enrich_application_with_job(a) for a in apps_raw]
    return {"success": True, "data": {"applications": apps}}


# GET /api/applications/stats  — student dashboard stats
@router.get("/stats")
async def get_student_stats(current_user: User = Depends(authorize("student"))):
    sid = str(current_user.id)
    total = await Application.find({"studentId": sid}).count()
    pending = await Application.find({"studentId": sid, "status": "pending"}).count()
    shortlisted = await Application.find({"studentId": sid, "status": "shortlisted"}).count()
    rejected = await Application.find({"studentId": sid, "status": "rejected"}).count()
    return {"success": True, "data": {"total": total, "pending": pending, "shortlisted": shortlisted, "rejected": rejected}}


# GET /api/applications/job/:jobId  — applicants for a job (manager)
@router.get("/job/{job_id}")
async def get_job_applicants(
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
        raise HTTPException(403, "Not authorized to view this job's applicants.")

    apps_raw = await Application.find({"jobId": job_id}).sort("-created_at").to_list()
    apps = [await _enrich_application_with_student(a) for a in apps_raw]

    job_data = job.model_dump(by_alias=True)
    job_data["_id"] = str(job.id)
    return {"success": True, "data": {"applications": apps, "job": job_data}}


# PUT /api/applications/:id/status  — update application status (manager)
@router.put("/{app_id}/status")
async def update_application_status(
    app_id: str,
    body: UpdateStatusRequest,
    current_user: User = Depends(authorize("hiring_manager")),
):
    valid_statuses = {"pending", "reviewed", "shortlisted", "rejected"}
    if body.status not in valid_statuses:
        raise HTTPException(400, "Invalid status.")

    try:
        application = await Application.get(app_id)
    except Exception:
        raise HTTPException(404, "Application not found.")
    if not application:
        raise HTTPException(404, "Application not found.")

    if not application.job_id:
        raise HTTPException(403, "Not authorized.")

    try:
        job = await Job.get(application.job_id)
    except Exception:
        raise HTTPException(403, "Not authorized.")
    if not job or job.posted_by != str(current_user.id):
        raise HTTPException(403, "Not authorized.")

    update: dict = {"status": body.status, "updated_at": datetime.utcnow()}
    if body.notes:
        update["notes"] = body.notes
    await application.set(update)

    data = application.model_dump(by_alias=True)
    data["_id"] = str(application.id)
    return {"success": True, "message": "Application status updated.", "data": {"application": data}}
