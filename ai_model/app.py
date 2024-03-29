from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dataclass import *
from process_video import *
from utils import allowed_file
# from postgres.db.insert_user import insert_user_input
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
cors = CORS(app, origins='*')
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres2024@localhost/ai-detection'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)


class UserInputs(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    serve_video_name = db.Column(db.String(50), nullable=False)
    confidence_input = db.Column(db.DECIMAL(5, 4), nullable=False)
    iou_input = db.Column(db.DECIMAL(5, 4), nullable=False)


def save_user_input(video_name, confidence_input, iou_input):
    try:
        new_input = UserInputs(
            serve_video_name=video_name,
            confidence_input=confidence_input,
            iou_input=iou_input
        )
        db.session.add(new_input)
        db.session.commit()
        return new_input
    except Exception as e:
        print("Erro ao inserir dados:", str(e))


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

    if 'confidence' not in request.json or 'iou' not in request.json:
        return jsonify({'status': 400, 'error': 'model parameter is missing.'})

    relative_video_path = request.json['video_path']
    confidence = float(request.json['confidence'])
    iou = float(request.json['iou'])

    ai_identify_objects = VideoProcessor(relative_video_path,
                                         confidence,
                                         iou)
    processed_video_path = ai_identify_objects.main_process()

    # save_user_input(processed_video_path, confidence, iou)

    return jsonify({'message': 'Video processed successfully',
                    'processed_video_path': processed_video_path})


@app.route("/get-video/<path:name>")
def get_video(name):

    directory = 'output-videos'
    current_directory = os.getcwd()
    video_path = os.path.join(current_directory, directory)

    if not video_path:
        abort(404)

    return send_from_directory(video_path, name, as_attachment=True)


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
