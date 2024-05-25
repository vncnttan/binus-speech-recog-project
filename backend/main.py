from flask import Flask, jsonify, request, render_template
import whisper

app = Flask(__name__)
model = whisper.load_model('base')

@app.route('/transcribe', methods=['POST'])
def index():
    data = request.files['audioFile']
    result = model.transcribe(data) # Must test, might be that needs to be save into wav first, then processsed
    result = result['text']
    response = {'result': result}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)