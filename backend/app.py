import torch
import torchaudio
from pydub import AudioSegment
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

bundle = torchaudio.pipelines.WAV2VEC2_ASR_BASE_960H
model = bundle.get_model()

class CFCDecoder(torch.nn.Module):
    def __init__(self, labels):
        super().__init__()
        self.labels = labels
        self.blank = 0
    
    def forward(self, emissions: torch.Tensor) -> str:
        indices = torch.argmax(emissions, dim=-1)
        indices = torch.unique_consecutive(indices, dim=-1)
        indices = [i.item() for i in indices if i != self.blank]
        return "".join(' ' if self.labels[i] == '|' else self.labels[i] for i in indices)

decoder = CFCDecoder(labels=bundle.get_labels())

app = Flask(__name__)
CORS(app)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    audio = AudioSegment.from_file(file, format="webm")
    buffer = io.BytesIO()
    audio.export(buffer, format="wav")
    buffer.seek(0)
    
    waveform, sample_rate = torchaudio.load(buffer)
    
    if sample_rate != bundle.sample_rate:
        waveform = torchaudio.functional.resample(waveform, sample_rate, bundle.sample_rate)
    
    with torch.inference_mode():
        emissions, _ = model(waveform)
    
    transcription = decoder(emissions[0]).strip()
    return jsonify({'transcript': transcription})

if __name__ == '__main__':
    app.run(debug=True)
