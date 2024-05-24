from flask import Flask, jsonify, request, render_template

from model import predict

app = Flask(__name__)

@app.route('/', methods=['POST'])
def index():
    data = request.get_json()
    prediction = predict(data['input'])
    response = {'prediction': prediction}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)