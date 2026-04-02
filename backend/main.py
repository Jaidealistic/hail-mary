from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Hail Mary API",
    description="Backend API for the Hail Mary stellar anomaly detection system.",
    version="0.1.0"
)

# Allow React frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hail Mary API. Systems nominal."}

@app.get("/hail-mary")
def hail_mary():
    return {"status": "Awaiting data...", "signal": "Clear"}
