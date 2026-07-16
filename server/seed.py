"""
seed.py ? Populate MongoDB with test data.
Mirrors the original seed.ts behavior.

Usage:
    cd server
    python seed.py
"""

import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.models.user import User
from app.models.job import Job
from app.models.application import Application


async def seed():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/job_scraper_platform")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.get_default_database()
    await init_beanie(database=db, document_models=[User, Job, Application])
    print("? Connected to MongoDB for seeding...")

    # Clear existing data
    await User.delete_all()
    await Job.delete_all()
    print("??  Cleared existing data")

    # Create Hiring Manager
    manager = User(
        name="Ankit Kumar",
        email="manager@kalpana.com",
        password="Manager@123",
        role="hiring_manager",
        company="Kalpana Software Solution Pvt. Ltd.",
        location="Bengaluru, Karnataka",
        bio="Experienced hiring manager with 8+ years in tech recruitment.",
        phone="+91 98765 43210",
    )
    manager.hash_password()
    await manager.insert()

    # Create Student
    student = User(
        name="Rahul Sharma",
        email="student@kalpana.com",
        password="Student@123",
        role="student",
        location="Delhi, India",
        bio="Final year CSE student passionate about full-stack development.",
        phone="+91 87654 32109",
    )
    student.hash_password()
    await student.insert()

    # Create sample jobs
    jobs_data = [
        {
            "title": "Full Stack Developer",
            "company": "Kalpana Software Solution Pvt. Ltd.",
            "location": "Bengaluru, Karnataka",
            "description": (
                "We are looking for a talented Full Stack Developer to join our growing engineering team.\n\n"
                "Key Responsibilities:\n"
                "- Build and maintain web applications using React and Node.js\n"
                "- Design and implement RESTful APIs\n"
                "- Collaborate with the design team to implement UI/UX\n"
                "- Write clean, maintainable, and well-documented code\n"
                "- Participate in code reviews and agile sprints\n\n"
                "What We Offer:\n"
                "- Competitive salary\n"
                "- Health insurance\n"
                "- Work from home 2 days/week\n"
                "- Learning & development budget"
            ),
            "requirements": ["React.js / Next.js", "Node.js / Express.js", "MongoDB / PostgreSQL",
                             "TypeScript", "Git & GitHub", "2+ years experience"],
            "salary": "?8L - ?15L per annum",
            "type": "full-time",
            "posted_by": str(manager.id),
            "source": "internal",
            "status": "open",
        },
        {
            "title": "Frontend React Developer",
            "company": "Kalpana Software Solution Pvt. Ltd.",
            "location": "Remote",
            "description": (
                "Join our frontend team to build beautiful and performant user interfaces.\n\n"
                "You will work on:\n"
                "- Building reusable React components\n"
                "- Implementing responsive designs\n"
                "- Performance optimization\n"
                "- Integration with backend APIs"
            ),
            "requirements": ["React.js", "TypeScript", "Tailwind CSS", "REST API integration", "Responsive design"],
            "salary": "?6L - ?10L per annum",
            "type": "remote",
            "posted_by": str(manager.id),
            "source": "internal",
            "status": "open",
        },
        {
            "title": "Backend Python Developer",
            "company": "Kalpana Software Solution Pvt. Ltd.",
            "location": "Hyderabad, Telangana",
            "description": (
                "We need a backend developer to build robust APIs and microservices.\n\n"
                "Responsibilities:\n"
                "- Design and develop RESTful APIs with FastAPI\n"
                "- Database design and optimization\n"
                "- Authentication and security implementation\n"
                "- API documentation"
            ),
            "requirements": ["Python", "FastAPI", "MongoDB", "JWT Authentication", "Docker (nice to have)"],
            "salary": "?7L - ?12L per annum",
            "type": "full-time",
            "posted_by": str(manager.id),
            "source": "internal",
            "status": "open",
        },
        {
            "title": "SDE-1 Internship (6 months)",
            "company": "Kalpana Software Solution Pvt. Ltd.",
            "location": "Bengaluru, Karnataka",
            "description": (
                "Exciting 6-month internship for final year students and fresh graduates.\n\n"
                "What you'll do:\n"
                "- Work on real production projects\n"
                "- Learn from experienced engineers\n"
                "- Get hands-on with modern tech stack\n"
                "- Possibility of full-time conversion"
            ),
            "requirements": ["JavaScript / TypeScript", "React basics", "Any backend language",
                             "Final year student or fresher"],
            "salary": "?20,000 - ?30,000/month",
            "type": "internship",
            "posted_by": str(manager.id),
            "source": "internal",
            "status": "open",
        },
    ]

    for jd in jobs_data:
        job = Job(
            title=jd["title"],
            company=jd["company"],
            location=jd["location"],
            description=jd["description"],
            requirements=jd["requirements"],
            salary=jd["salary"],
            type=jd["type"],  # type: ignore[arg-type]
            posted_by=jd["posted_by"],
            source=jd["source"],
            status=jd["status"],  # type: ignore[arg-type]
        )
        await job.insert()

    print("? Sample jobs created")
    print("\n? Database seeded successfully!\n")
    print("Test Credentials:")
    print("?" * 38)
    print("? Hiring Manager:")
    print("   Email: manager@kalpana.com")
    print("   Password: Manager@123")
    print("")
    print("? Student:")
    print("   Email: student@kalpana.com")
    print("   Password: Student@123")
    print("?" * 38 + "\n")


if __name__ == "__main__":
    asyncio.run(seed())
