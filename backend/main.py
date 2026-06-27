import json
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db, redis_client, engine
from ml_model import get_anomaly_model

app = FastAPI(title="Project Hail Mary - API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Project Hail Mary Backend Operating", "status": "active"}

@app.get("/stars")
def get_stars(db: Session = Depends(get_db)):
    # Try cache first — silently skip if Redis is unavailable
    try:
        cached = redis_client.get("all_stars")
        if cached:
            return json.loads(cached)
    except Exception:
        pass

    result = db.execute(text("SELECT star_id, mission, ra, dec FROM stars")).fetchall()
    stars = [{"star_id": r[0], "mission": r[1], "ra": r[2], "dec": r[3]} for r in result]

    # Try to cache — silently skip if Redis is unavailable
    try:
        redis_client.setex("all_stars", 3600, json.dumps(stars))
    except Exception:
        pass

    return stars

@app.get("/stars/{star_id}/lightcurve")
def get_lightcurve(star_id: str):
    cache_key = f"lightcurve_{star_id}"

    # Try cache first — silently skip if Redis is unavailable
    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception:
        pass

    query = f"SELECT time, flux FROM lightcurves WHERE star_id='{star_id}' ORDER BY time ASC"
    df = pd.read_sql(query, engine)

    # Cap size to 3000 points to ensure instantaneous browser rendering
    if len(df) > 3000:
        df = df.iloc[:3000]

    if df.empty:
        raise HTTPException(status_code=404, detail=f"No lightcurve data for {star_id}")

    data = {"times": df['time'].tolist(), "fluxes": df['flux'].tolist()}

    # Try to cache — silently skip if Redis is unavailable
    try:
        redis_client.setex(cache_key, 3600, json.dumps(data))
    except Exception:
        pass

    return data

@app.post("/stars/{star_id}/anomalies")
def detect_anomalies(star_id: str):
    # 1. Fetch raw data natively from DB
    query = f"SELECT time, flux FROM lightcurves WHERE star_id='{star_id}' ORDER BY time ASC"
    df = pd.read_sql(query, engine)
    
    # Cap size to 3000 points to ensure instant Machine Learning inference execution
    if len(df) > 3000:
        df = df.iloc[:3000]
    if df.empty:
        raise HTTPException(status_code=404, detail="No lightcurve data")

    # 2. Pipeline math mirroring ML sequence logic
    fluxes = df['flux'].values
    times = df['time'].values
    
    window_size = 100
    if len(fluxes) < window_size:
        raise HTTPException(status_code=400, detail="Data payload too small for Neural Network!")

    sequences = []
    center_times = []
    
    for i in range(len(fluxes) - window_size):
        seq = fluxes[i : i + window_size]
        s_min, s_max = np.min(seq), np.max(seq)
        if s_max - s_min > 0:
            seq = (seq - s_min) / (s_max - s_min)
        sequences.append(seq)
        center_times.append(times[i + (window_size//2)])
        
    tensor_seq = torch.tensor(np.array(sequences), dtype=torch.float32).unsqueeze(-1)
    
    # 3. Native PyTorch Inference directly from Web Request!
    model, device = get_anomaly_model()
    tensor_seq = tensor_seq.to(device)
    
    with torch.no_grad():
        reconstruction = model(tensor_seq)
        
    # 4. Statistical Anomaly Tally
    criterion = nn.MSELoss(reduction='none')
    losses = criterion(reconstruction, tensor_seq).squeeze().mean(dim=1).cpu().numpy()
    
    # Dynamic 95th Percentile Thresholding
    threshold = np.percentile(losses, 99)
    
    anomalies = []
    for t, l in zip(center_times, losses):
        if l > threshold:
            anomalies.append({"time": t, "loss": float(l)})
            
    return {
        "star_id": star_id,
        "total_windows_scanned": len(losses),
        "threshold_mse": float(threshold),
        "total_anomalies_detected": len(anomalies),
        "anomalies": anomalies
    }
