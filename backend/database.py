import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import redis
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# PostgreSQL 
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL entirely!")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis Configuration (Cache)
REDIS_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379/0")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
