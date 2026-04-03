import torch
import torch.nn as nn

class LSTMAutoencoder(nn.Module):
    def __init__(self, seq_len=100, n_features=1, embedding_dim=16):
        super(LSTMAutoencoder, self).__init__()
        self.seq_len = seq_len
        self.n_features = n_features
        self.embedding_dim = embedding_dim
        
        # Encoder Module
        # Takes in physical flux waves and compresses them into a tiny logical embedding space
        self.encoder_lstm = nn.LSTM(
            input_size=self.n_features,
            hidden_size=self.embedding_dim,
            batch_first=True
        )
        
        # Decoder Module
        # Takes the tiny frozen "concept" of the wave and unrolls it back across time
        self.decoder_lstm = nn.LSTM(
            input_size=self.embedding_dim,
            hidden_size=self.embedding_dim,
            batch_first=True
        )
        self.decoder_linear = nn.Linear(self.embedding_dim, self.n_features)
        
    def forward(self, x):
        # Encoder pass
        _, (hidden_state, _) = self.encoder_lstm(x)
        
        # The hidden_state output is [1, batch_size, embedding_dim]
        # We need to reshape it and copy it seq_len times to unroll the decoder
        hidden_state = hidden_state.transpose(0, 1) # [batch_size, 1, embedding_dim]
        hidden_state = hidden_state.repeat(1, self.seq_len, 1) # [batch_size, seq_len, embedding_dim]
        
        # Decoder pass
        decoder_out, _ = self.decoder_lstm(hidden_state)
        
        # Translate LSTM features back to original physical flux predictions
        reconstruction = self.decoder_linear(decoder_out)
        return reconstruction
