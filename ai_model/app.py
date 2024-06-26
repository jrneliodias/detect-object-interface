from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dataclass import *
from process_video import *
from utils import allowed_file
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins='*')
UPLOAD_FOLDER = 'output-videos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['INPUT_VIDEOS_FOLDER'] = './test-inputs/'
app.config['INPUT_VIDEO_PATH'] = ''
# Ser for usar sem docker
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "SQLALCHEMY_DATABASE_URL")
# app.config['SQLALCHEMY_DATABASE_URL'] = 'postgresql://postgres:postgres2024@localhost/ai-detection'
# com o docker
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:postgres2024@db-container/ai-detection'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)


class UserInputs(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    server_video_name = db.Column(db.String(50), nullable=False)
    confidence_input = db.Column(db.DECIMAL(5, 4), nullable=False)
    iou_input = db.Column(db.DECIMAL(5, 4), nullable=False)


class Detections(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    frame_number = db.Column(db.Integer, nullable=False)
    box_left = db.Column(db.Integer, nullable=False)
    box_top = db.Column(db.Integer, nullable=False)
    box_width = db.Column(db.Integer, nullable=False)
    box_height = db.Column(db.Integer, nullable=False)
    class_name = db.Column(db.String(15), nullable=False)
    confidence = db.Column(db.DECIMAL(10, 9), nullable=False)
    user_input_id = db.Column(db.Integer, db.ForeignKey(
        'user_inputs.id', ondelete='CASCADE'))


def save_user_input_in_db(video_name, confidence_input, iou_input):
    try:
        new_input = UserInputs(
            server_video_name=video_name,
            confidence_input=confidence_input,
            iou_input=iou_input
        )
        db.session.add(new_input)
        db.session.commit()
        return new_input.id

    except Exception as e:
        print("Erro ao inserir dados:", str(e))


def save_detection_to_db(detection: dict, user_input_id):
    try:
        new_detection = Detections(
            frame_number=detection['frame_number'],
            box_left=detection['box']['left'],
            box_top=detection['box']['top'],
            box_width=detection['box']['width'],
            box_height=detection['box']['height'],
            class_name=detection['class_name'],
            confidence=detection['confidence'],
            user_input_id=user_input_id
        )
        db.session.add(new_detection)
        db.session.commit()
        return new_detection
    except Exception as e:
        print("Erro ao inserir detecções no banco de dados:", str(e))
        raise


def save_all_detections_in_db(detections: list[dict], user_input_id: int):
    try:
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        Session = sessionmaker(bind=engine)
        session = Session()

        detection_objects = [Detections(
            frame_number=detection['frame_number'],
            box_left=detection['box']['left'],
            box_top=detection['box']['top'],
            box_width=detection['box']['width'],
            box_height=detection['box']['height'],
            class_name=detection['class_name'],
            confidence=detection['confidence'],
            user_input_id=user_input_id
        ) for detection in detections]

        session.bulk_save_objects(detection_objects)
        session.commit()

    except Exception as e:
        session.rollback()
        print("Erro ao inserir detecções no banco de dados:", str(e))
        raise


@app.route("/upload", methods=['POST'])
def upload_file():
    if 'video' not in request.files:
        return jsonify({'error': 'no video file'}), 404

    video_file = request.files['video']

    if not video_file or not allowed_file(video_file.filename):
        return jsonify({'message': 'Unsupported file provided.'}), 415

    secured_filename = secure_filename(video_file.filename)
    current_directory = os.getcwd()
    video_path = current_directory+"\\test-inputs\\" + secured_filename
    app.config['INPUT_VIDEO_PATH'] = video_path
    video_file.save(video_path)

    return jsonify({'message': 'Video saved successfully'})


@app.route('/detect', methods=['POST'])
def detect():
    try:
        missing_props = [prop for prop in [
            'confidence', 'iou'] if prop not in request.json]
        if missing_props:
            missing_props_str = ' '.join(
                [f'"{prop}"' for prop in missing_props])
            return jsonify({'error': f'Model parameter(s) {missing_props_str} is/are missing.'}), 400

        # relative_video_path = request.json['video_path']
        relative_video_path = app.config['INPUT_VIDEO_PATH']

        if not os.path.exists(relative_video_path):
            return jsonify({'message': 'File not found.'}), 500

        confidence = float(request.json['confidence'])
        iou = float(request.json['iou'])

        detections_list = DetectionsProcess()
        ai_identify_objects = VideoProcessor(detections_list,
                                             relative_video_path,
                                             confidence,
                                             iou)

        processed_video_path = ai_identify_objects.main_process()

        user_input_id = save_user_input_in_db(
            processed_video_path, confidence, iou)

        save_all_detections_in_db(
            detections_list.all_detections, user_input_id)

        return jsonify({'message': 'Video processed successfully',
                        'processed_video_name': processed_video_path})

    except Exception as e:
        return jsonify({'error': 'Erro ao inserir no Banco de Dados', 'message': 'Erro de conexão com Banco de Dados'}), 500


@app.route("/result/<path:name>")
def get_video(name):

    directory = app.config['UPLOAD_FOLDER']
    current_directory = os.getcwd()
    video_path = os.path.join(current_directory, directory)

    if not os.path.exists(os.path.join(video_path, name)):
        return jsonify({'message': 'File not found.'}), 404

    return send_from_directory(video_path, name, as_attachment=True), 200


@app.route("/detections", methods=['GET'])
def get_last_detections():
    try:
        last_10_detections = Detections.query.order_by(
            Detections.id.desc()).limit(10).all()
        json_data = [{
            'id': detection.id,
            'frame_number': detection.frame_number,
            'box_left': detection.box_left,
            'box_top': detection.box_top,
            'box_width': detection.box_width,
            'box_height': detection.box_height,
            'class_name': detection.class_name,
            'confidence': float(detection.confidence),
            'user_input_id': detection.user_input_id
        } for detection in last_10_detections]

        return jsonify(json_data), 200
    except Exception as e:
        return jsonify({'error': 'Erro ao inserir no Banco de Dados', 'message': str(e)}), 500


@app.route('/delete_videos', methods=['DELETE'])
def delete_videos():
    directory = app.config['UPLOAD_FOLDER']
    current_directory = os.getcwd()
    video_path = os.path.join(current_directory, directory)
    files = os.listdir(video_path)
    for file in files:
        file_path = os.path.join(video_path, file)
        os.remove(file_path)

    input_videos_dir = app.config['INPUT_VIDEOS_FOLDER']
    input_video_path = os.path.join(current_directory, input_videos_dir)
    files = os.listdir(input_video_path)
    for file in files:
        file_path = os.path.join(input_video_path, file)
        os.remove(file_path)

    return jsonify({'message': 'Videos deleted successfully'})


@app.route('/health_check', methods=['GET'])
def health_check():
    if model is None:
        return jsonify({'message': "Model is not loaded"})
    return jsonify({'message': f"Model {model.model_name} is loaded"})


@app.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    global model
    model = Model(model_name)
    return jsonify({'message': f"Model {model_name} is loaded"})


if __name__ == "__main__":
    # app.run(debug=True, port=8080)
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8080))
