from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv

load_dotenv()

async def connect_db(app_models: list):
    """Connect to MongoDB and initialize Beanie ODM."""
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/job_scraper_platform")
    try:
        client = AsyncIOMotorClient(mongo_uri)
        db = client.get_default_database()
        await init_beanie(database=db, document_models=app_models)
        print("[OK] MongoDB connected successfully")
    except Exception as e:
        print(f"[ERROR] MongoDB connection error: {e}")
        raise
