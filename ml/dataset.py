import os
import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset
from sqlalchemy import create_engine
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

class LightCurveDataset(Dataset):
    def __init__(self, star_id, window_size=100):
        self.window_size = window_size
        self.star_id = star_id
        
        # Load directly from PostgreSQL
        DATABASE_URL = os.environ.get("DATABASE_URL")
        engine = create_engine(DATABASE_URL)
        
        print(f"Querying TimescaleDB for {star_id} lightcurves...")
        query = f"SELECT flux FROM lightcurves WHERE star_id='{star_id}' ORDER BY time ASC"
        df = pd.read_sql(query, engine)
        
        fluxes = df['flux'].values
        
        # Generate sequentially sliding windows (overlap factor of 1 for heavy data)
        self.sequences = []
        for i in range(len(fluxes) - window_size):
            seq = fluxes[i : i + window_size]
            
            # Sequence-level Min-Max Normalization -> Maps patterns between 0.0 and 1.0 continuously
            seq_min = np.min(seq)
            seq_max = np.max(seq)
            if seq_max - seq_min > 0:
                seq = (seq - seq_min) / (seq_max - seq_min)
                
            self.sequences.append(seq)
            
        # Add feature dimension: shape becomes [num_windows, window_size, 1]
        self.sequences = torch.tensor(np.array(self.sequences), dtype=torch.float32).unsqueeze(-1)
        print(f"Generated {len(self.sequences)} sliding windows of size {window_size}!")

    def __len__(self):
        return len(self.sequences)

    def __getitem__(self, idx):
        # Autoencoders predict the target identically to the input!
        return self.sequences[idx], self.sequences[idx]
