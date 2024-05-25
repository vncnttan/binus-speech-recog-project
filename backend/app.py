import torch
import torchaudio
from pydub import AudioSegment
import io
from flask import Flask, jsonify, request, render_template
from transformers import AutoProcessor, AutoModelForTextToSpectrogram, SpeechT5HifiGan
import numpy as np
import torch
import whisper
from IPython.display import Audio
from flask_cors import CORS


# TODO: Load Model For Automatic Speech Recognition 🎤
bundle = torchaudio.pipelines.WAV2VEC2_ASR_BASE_960H
asr_model = bundle.get_model()

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
        emissions, _ = asr_model(waveform)
    
    transcription = decoder(emissions[0]).strip()
    return jsonify({'transcript': transcription})

# Load Model for Text To Speech 🔊
processor = AutoProcessor.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
tts_model = AutoModelForTextToSpectrogram.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
speaker_embeddings = torch.tensor(np.load('my_array.npy')).unsqueeze(0)
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")

@app.route('/tts', methods=['POST'])
def index():
    text = request.form['text']
    inputs = processor(text, return_tensors="pt", padding="longest")
    speech = tts_model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=vocoder)
    Audio(speech.numpy(), rate=16000) # Nah ini harusnya dia udah kasih audionya, sekarang tinggal cari cara untuk passing ke depan



if __name__ == '__main__':
    app.run(debug=True)
