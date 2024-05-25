import torch
import torchaudio
from pydub import AudioSegment
import io
from flask import Flask, jsonify, request, render_template, send_file
from transformers import AutoProcessor, AutoModelForTextToSpectrogram, SpeechT5HifiGan, WhisperProcessor, WhisperForConditionalGeneration
import numpy as np
import torch
import whisper
from IPython.display import Audio
from flask_cors import CORS, cross_origin
import soundfile as sf

model_name = "openai/whisper-base"
whisper_model = WhisperForConditionalGeneration.from_pretrained(model_name)
whisper_processor = WhisperProcessor.from_pretrained(model_name)

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
    
    if sample_rate != whisper_processor.feature_extractor.sampling_rate:
        waveform = torchaudio.functional.resample(waveform, sample_rate, whisper_processor.feature_extractor.sampling_rate)
        
    waveform = waveform / torch.max(torch.abs(waveform))
    inputs = whisper_processor(waveform.squeeze(0), sampling_rate=whisper_processor.feature_extractor.sampling_rate, return_tensors="pt")
    
    with torch.no_grad():
        predicted_ids = whisper_model.generate(inputs.input_features)
        
    transcription = whisper_processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return jsonify({'transcript': transcription})

processor = AutoProcessor.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
tts_model = AutoModelForTextToSpectrogram.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
speaker_embeddings = torch.tensor(np.load('speaker_embeddings.npy')).unsqueeze(0)
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")

@app.route('/tts', methods=['POST'])
def index():
    text = request.form['text']
    inputs = processor(text=text, return_tensors="pt")
    
    se = speaker_embeddings.to(torch.float32)
    speech = tts_model.generate_speech(inputs["input_ids"], se, vocoder=vocoder)
    
    print(speech)
    Audio(speech.numpy(), rate=16000)
        
    audio_buffer = io.BytesIO()
    sf.write(audio_buffer, speech.squeeze().cpu().numpy(), 16000, format='WAV')
    audio_buffer.seek(0)
    
    return send_file(audio_buffer, mimetype='audio/wav', as_attachment=False, download_name='speech.wav')

if __name__ == '__main__':
    app.run(debug=True)
