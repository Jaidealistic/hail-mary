import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import wandb
from dotenv import load_dotenv, find_dotenv

from dataset import LightCurveDataset
from model import LSTMAutoencoder

def train():
    # Environment Loading Configuration
    load_dotenv(find_dotenv())
    
    # Automatically logs in and tracks performance dynamically using the API key in .env
    wandb.init(project="hail-mary", name="LSTM-Kepler-10-Baseline")
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Firing up PyTorch. Backend Target Device: {device}")
    
    # Mathematical Config
    WINDOW_SIZE = 100
    BATCH_SIZE = 32
    EPOCHS = 15
    LR = 0.001
    
    wandb.config.update({
        "window_size": WINDOW_SIZE,
        "batch_size": BATCH_SIZE,
        "epochs": EPOCHS,
        "learning_rate": LR
    })
    
    # Establish Data Tunnel
    dataset = LightCurveDataset(star_id="Kepler-10", window_size=WINDOW_SIZE)
    if len(dataset) == 0:
        print("Dataset failed generation. Execution Terminated.")
        return
        
    dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)
    
    # Load Model To GPU directly
    model = LSTMAutoencoder(seq_len=WINDOW_SIZE).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)
    
    print("\\n🚀 Initiating Deep Learning Trace...")
    for epoch in range(EPOCHS):
        model.train()
        total_loss = 0
        
        for batch_idx, (data, targets) in enumerate(dataloader):
            data, targets = data.to(device), targets.to(device)
            
            optimizer.zero_grad()
            output = model(data)
            
            # The heart of our Anomaly Detection system. 
            loss = criterion(output, targets)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch [{epoch+1:02d}/{EPOCHS}] -> Reconstruction MSE Loss: {avg_loss:.6f}")
        wandb.log({"reconstruction_loss": avg_loss, "epoch": epoch+1})
        
    # Serialize the trained artifact to disk
    os.makedirs("models", exist_ok=True)
    model_path = "models/autoencoder_v1.pth"
    torch.save(model.state_dict(), model_path)
    print(f"\\n✅ Training Fully Complete. Serialization successful: {model_path}")
    
    wandb.finish()

if __name__ == "__main__":
    train()
