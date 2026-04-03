import os
from sqlalchemy import create_engine, Column, String, Float, ForeignKey, text
from sqlalchemy.orm import declarative_base

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()

class Star(Base):
    __tablename__ = 'stars'
    star_id = Column(String, primary_key=True)
    mission = Column(String)
    ra = Column(Float)
    dec = Column(Float)
    magnitude = Column(Float)

def initialize_database():
    # Attempt to create TimescaleDB extension (Forgiving for Supabase)
    with engine.connect() as conn:
        try:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))
            conn.commit()
        except Exception as e:
            print("TimescaleDB not supported on this cloud host, defaulting to standard PostgreSQL. Error:", e)

    # Drop tables if they exist to start fresh
    Base.metadata.drop_all(engine)
    
    # Create the explicit stars table
    Base.metadata.create_all(engine)

    # Create the lightcurves table manually for TimescaleDB tuning
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS lightcurves (
                time DOUBLE PRECISION NOT NULL,
                star_id VARCHAR NOT NULL REFERENCES stars(star_id),
                flux DOUBLE PRECISION,
                flux_err DOUBLE PRECISION
            );
        """))
        # Make lightcurves a hypertable
        try:
            conn.execute(text("SELECT create_hypertable('lightcurves', 'time', if_not_exists => TRUE);"))
        except Exception as e:
            print("Hypertable may already exist or error occurred:", e)
        
        # Create an index to quickly lookup star lightcurves
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_star_id ON lightcurves(star_id, time DESC);"))
        conn.commit()

if __name__ == "__main__":
    print("Initializing Database...")
    initialize_database()
    print("Database Initialized!")
