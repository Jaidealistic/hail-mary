import torch
import torch.nn as nn
import os

class LSTMAutoencoder(nn.Module):
    def __init__(self, seq_len=100, n_features=1, embedding_dim=16):
        super(LSTMAutoencoder, self).__init__()
        self.seq_len = seq_len
        self.n_features = n_features
        self.embedding_dim = embedding_dim
        
        self.encoder_lstm = nn.LSTM(input_size=self.n_features, hidden_size=self.embedding_dim, batch_first=True)
        self.decoder_lstm = nn.LSTM(input_size=self.embedding_dim, hidden_size=self.embedding_dim, batch_first=True)
        self.decoder_linear = nn.Linear(self.embedding_dim, self.n_features)
        
    def forward(self, x):
        _, (hidden_state, _) = self.encoder_lstm(x)
        hidden_state = hidden_state.transpose(0, 1).repeat(1, self.seq_len, 1)
        decoder_out, _ = self.decoder_lstm(hidden_state)
        return self.decoder_linear(decoder_out)

# Singleton Model Loader
_model_instance = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def get_anomaly_model():
    global _model_instance
    if _model_instance is None:
        model = LSTMAutoencoder().to(_device)
        path = os.path.join(os.path.dirname(__file__), "..", "ml", "models", "autoencoder_v1.pth")
        
        if os.path.exists(path):
            model.load_state_dict(torch.load(path, map_location=_device))
            model.eval()
            print(f"✅ Autoencoder loaded dynamically from {path}!")
        else:
            print(f"⚠️ WARNING: Model weight file not found at {path}! Using untrained weights.")
        _model_instance = model
        
    return _model_instance, _device
