from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.models.user import User
from app.middleware.role import authorize
import random

router = APIRouter(prefix="/api/scraper", tags=["Scraper"])


# ── Mock job data (mirrors scraper.controller.ts) ─────────────────────────────

def _mock_linkedin(keyword: str, location: str) -> List[dict]:
    loc = location or "Bengaluru, Karnataka"
    base = "https://www.linkedin.com/jobs/search/?keywords="
    return [
        {"id": "li-001", "title": f"{keyword} Developer", "company": "Infosys Ltd",
         "location": loc, "applyUrl": base + keyword, "source": "linkedin",
         "description": f"Looking for an experienced {keyword} Developer to join our growing team.",
         "salary": "₹8L - ₹15L per annum", "type": "full-time", "postedDate": "2 days ago"},
        {"id": "li-002", "title": f"Senior {keyword} Engineer", "company": "Wipro Technologies",
         "location": location or "Hyderabad, Telangana", "applyUrl": base + keyword, "source": "linkedin",
         "description": f"We are seeking a Senior {keyword} Engineer with 3+ years of experience.",
         "salary": "₹15L - ₹25L per annum", "type": "full-time", "postedDate": "1 day ago"},
        {"id": "li-003", "title": f"{keyword} Intern", "company": "TCS Digital",
         "location": location or "Mumbai, Maharashtra", "applyUrl": base + keyword, "source": "linkedin",
         "description": f"Exciting internship opportunity for final year students.",
         "salary": "₹15,000 - ₹25,000/month", "type": "internship", "postedDate": "3 days ago"},
        {"id": "li-004", "title": f"{keyword} Lead", "company": "HCL Technologies",
         "location": location or "Noida, Uttar Pradesh", "applyUrl": base + keyword, "source": "linkedin",
         "description": f"Lead a team of {keyword} developers in building enterprise-grade solutions.",
         "salary": "₹20L - ₹35L per annum", "type": "full-time", "postedDate": "5 days ago"},
    ]


def _mock_naukri(keyword: str, location: str) -> List[dict]:
    base = "https://www.naukri.com/jobs-in-india?k="
    return [
        {"id": "nk-001", "title": f"{keyword} Developer - 2-5 Yrs", "company": "Accenture India",
         "location": location or "Pune, Maharashtra", "applyUrl": base + keyword, "source": "naukri",
         "description": f"Naukri.com: {keyword} Developer required with strong hands-on experience.",
         "salary": "₹6L - ₹12L", "type": "full-time", "postedDate": "1 day ago"},
        {"id": "nk-002", "title": f"Jr. {keyword} Developer", "company": "Cognizant Technology Solutions",
         "location": location or "Chennai, Tamil Nadu", "applyUrl": base + keyword, "source": "naukri",
         "description": f"Freshers and 1-2 year experience candidates for {keyword} role.",
         "salary": "₹3.5L - ₹6L", "type": "full-time", "postedDate": "2 days ago"},
        {"id": "nk-003", "title": f"{keyword} Consultant", "company": "Capgemini India",
         "location": location or "Kolkata, West Bengal", "applyUrl": base + keyword, "source": "naukri",
         "description": f"Join as a {keyword} Consultant and work with global clients.",
         "salary": "₹10L - ₹18L", "type": "contract", "postedDate": "4 days ago"},
    ]


def _mock_internshala(keyword: str, location: str) -> List[dict]:
    base = f"https://internshala.com/internships/{keyword.lower()}-internship/"
    return [
        {"id": "ins-001", "title": f"{keyword} Development Internship", "company": "StartupXYZ",
         "location": location or "Remote", "applyUrl": base, "source": "internshala",
         "description": f"Work from home internship. Learn {keyword} in a fast-paced startup.",
         "salary": "₹5,000 - ₹10,000/month", "type": "internship", "postedDate": "Today"},
        {"id": "ins-002", "title": f"{keyword} Engineering Intern", "company": "TechVentures India",
         "location": location or "Delhi", "applyUrl": base, "source": "internshala",
         "description": "3-month internship with real-world projects and expert mentors.",
         "salary": "₹8,000 - ₹12,000/month", "type": "internship", "postedDate": "Yesterday"},
    ]


def _mock_unstop(keyword: str, location: str) -> List[dict]:
    base = f"https://unstop.com/jobs?q={keyword}"
    return [
        {"id": "us-001", "title": f"{keyword} Developer Challenge 2024", "company": "Google India",
         "location": location or "Remote", "applyUrl": base, "source": "unstop",
         "description": f"Compete and get hired! Join our {keyword} developer challenge.",
         "salary": "₹18L - ₹30L (full-time offer)", "type": "full-time", "postedDate": "2 days ago"},
        {"id": "us-002", "title": f"Campus {keyword} Engineer", "company": "Microsoft India",
         "location": location or "Hyderabad, Telangana", "applyUrl": base, "source": "unstop",
         "description": f"Microsoft campus hiring for {keyword} roles — all engineering backgrounds welcome.",
         "salary": "₹25L - ₹40L", "type": "full-time", "postedDate": "3 days ago"},
    ]


# ── Routes ─────────────────────────────────────────────────────────────────────

# GET /api/scraper/search
@router.get("/search")
async def search_jobs(
    keyword: Optional[str] = Query(None),
    location: str = Query(""),
    _: User = Depends(authorize("student")),
):
    if not keyword:
        raise HTTPException(400, "Keyword is required for job search.")

    jobs = (
        _mock_linkedin(keyword, location)
        + _mock_naukri(keyword, location)
        + _mock_internshala(keyword, location)
        + _mock_unstop(keyword, location)
    )
    random.shuffle(jobs)

    return {
        "success": True,
        "message": f'Found {len(jobs)} jobs for "{keyword}"',
        "data": {"jobs": jobs, "total": len(jobs)},
    }
