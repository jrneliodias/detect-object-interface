from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dataclass import *
from process_video import *
from utils import allowed_file

app = Flask(__name__)
cors = CORS(app, origins='*')
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/upload", methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'no file part'})

    video_file = request.files['video']
    allowed_file(video_file.filename)

    if video_file.filename == '':
        return jsonify({'error': 'No selected file'})
    if video_file:
        secured_filename = secure_filename(video_file.filename)
        video_path = './test/' + secured_filename
        video_file.save(video_path)

        return jsonify({'message': 'Video saved successfully', 'video_path': video_path})


@app.route('/detect', methods=['POST'])
def detect():

    relative_video_path = request.json['video_path']
    # confidence = request.json['confidence']
    # iou = request.json['iou']

    processed_video_path = video_processor(relative_video_path)
    return jsonify({'message': 'Video processed successfully', 'processed_video_path': processed_video_path})


@app.route("/get-video/<path:name>")
def get_video(name):
    # relative_video_path = request.args.get('video_path')
    relative_video_path = 'C:/Users/jrnel/Downloads/full-stack-take-home-main/full-stack-take-home-main/ai_model/output-videos'
    directory = 'output-videos'

    if not relative_video_path:
        abort(404)

    return send_from_directory(relative_video_path, name, as_attachment=True)


@app.route('/health_check', methods=['GET'])
def health_check():
    if model is None:
        return "Model is not loaded"
    return f"Model {model.model_name} is loaded"


@app.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    global model
    model = Model(model_name)
    return f"Model {model_name} is loaded"


if __name__ == "__main__":
    # app.run(debug=True, port=8080)
    app.run(host='0.0.0.0', port=8080)
