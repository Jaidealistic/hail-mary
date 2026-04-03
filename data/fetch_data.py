import os
import lightkurve as lk
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv, find_dotenv

import urllib.request

# Sometimes MAST throws SSL errors on some machines, we will fix urllib SSL verification conditionally
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

# Load database configuration
load_dotenv(find_dotenv())
DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Famous stars to pull! (Including Kepler, TESS, and K2 targets!)
TARGETS = [
    "Kepler-10", "Kepler-22", "Kepler-186", 
    "Kepler-452", "TRAPPIST-1", "TOI-700", 
    "Kepler-62", "Kepler-11", "Kepler-90", 
    "WASP-12", "WASP-39", "K2-18"
]

def fetch_and_ingest(target):
    print(f"\\n--- Fetching Data for {target} ---")
    
    # We search the MAST API for any available telescope data (Kepler, K2, or TESS)
    search_result = lk.search_lightcurve(target)
    if not search_result:
        print(f"No Kepler lightcurves found for {target}.")
        return

    print(f"Found {len(search_result)} datasets for {target}. Downloading the first one for demonstration...")
    # Download the leading quarter
    lc = search_result[0].download()
    
    if lc is None:
        print(f"Failed to download lightcurve for {target}.")
        return

    # Extract metadata properties
    star_id = target # Or lc.targetid
    ra = lc.ra
    dec = lc.dec
    mission = lc.mission
    
    # We perform some basic detrending 
    print(f"[{target}] Preprocessing: Removing NaNs, Outliers, and Flattening (Detrending)...")
    clean_lc = lc.remove_nans().remove_outliers().flatten(window_length=401)
    
    # Store metadata into Stars table
    with Session() as session:
        # Simple UPSERT essentially 
        session.execute(
            text("INSERT INTO stars (star_id, mission, ra, dec) VALUES (:id, :m, :r, :d) ON CONFLICT (star_id) DO NOTHING"),
            {"id": star_id, "m": mission, "r": ra, "d": dec}
        )
        session.commit()
    
    # Extract timeseries to DataFrame
    df = pd.DataFrame({
        "time": clean_lc.time.value,
        "star_id": star_id,
        "flux": clean_lc.flux.value,
        "flux_err": clean_lc.flux_err.value
    })

    print(f"[{target}] Attempting to ingest {len(df)} rows into Hypertable...")
    
    # Write to TimescaleDB
    # Using pandas to_sql directly on the connection
    df.to_sql('lightcurves', engine, if_exists='append', index=False)
    
    print(f"[{target}] Ingestion Complete.")


if __name__ == "__main__":
    for target in TARGETS:
        fetch_and_ingest(target)
    
    print("\\nAll target ingestion finished.")
