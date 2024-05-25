from flask import Flask, jsonify, request, render_template
from transformers import AutoProcessor, AutoModelForTextToSpectrogram
import numpy as np
import torch
import whisper
from transformers import SpeechT5HifiGan
from IPython.display import Audio
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
asr_model = whisper.load_model('base')

processor = AutoProcessor.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
tts_model = AutoModelForTextToSpectrogram.from_pretrained("vncnttan/speecht5_finetuned_sr_proj")
speaker_embeddings = torch.tensor(np.load('speaker_embeddings.npy')).unsqueeze(0)
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")

@app.route('/transcribe', methods=['POST'])
def index():
    data = request.files['audioFile']
    result = asr_model.transcribe(data) # Must test, might be that needs to be save into wav first, then processsed
    result = result['text']
    response = {'result': result}
    return jsonify(response)

@app.route('/tts', methods=['POST'])
def index():
    text = request.form['text']
    inputs = processor(text, return_tensors="pt", padding="longest")
    speech = tts_model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=vocoder)
    Audio(speech.numpy(), rate=16000) # Nah ini harusnya dia udah kasih audionya, sekarang tinggal cari cara untuk passing ke depan

if __name__ == '__main__':
    app.run(debug=True)