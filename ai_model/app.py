import cv2
from PIL import Image
from flask import Flask, request, jsonify
from smart_open import open
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from dataclass import *
import datetime
import io
import json
from utils import allowed_file

app = Flask(__name__)
cors = CORS(app, origins='*')
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def video_processor(video_path: str):
    frames_folder = 'frames'

    current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    os.makedirs(frames_folder, exist_ok=True)
    video_filename = f'{current_datetime}.mp4'
    output_video_path = os.path.join(frames_folder, video_filename)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    out = cv2.VideoWriter(output_video_path, fourcc, fps,
                          (frame_width, frame_height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        detections = detect(frame)
        frame_with_detection = draw_box(frame, detections)

        out.write(frame_with_detection)

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    return frames_folder


def detect(image_data: str,
           confidence: float = 0.7,
           iou: float = 0.5,
           output_file: str = 'detection.json'):

    # image_path = os.path.join(current_directory, relative_image_path)
    original_img = Image.fromarray(cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB))
    # original_img = Image.open(io.BytesIO(image_data)).convert('RGB')
    predictions = model(original_img, confidence, iou)
    detections = [p.to_dict() for p in predictions]

    # Write detections to JSON file
    with open(output_file, 'a') as f:
        json.dump(detections, f)
        f.write(',\n')  # Add a newline to separate detections
    return detections


def draw_box(frame: str, detections: list[dict]):
    # Make a copy of the frame to avoid modifying the original
    frame_with_rectangles = frame.copy()

    # Loop through each detection
    for detection in detections:
        class_name = detection['class_name']
        box = detection['box']
        left, top, width, height = box.values()

        # Draw rectangle on the frame
        cv2.rectangle(frame_with_rectangles, (left, top),
                      (left + width, top + height), (0, 255, 0), 2)
        # Add class name text
        cv2.putText(frame_with_rectangles, class_name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    return frame_with_rectangles


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

        frames_folder = video_processor(video_path)
        return jsonify({'message': 'Video saved successfully', 'frame_folder': frames_folder})


model = Model("yolov8s")


@app.route('/detect', methods=['POST'])
# def detect():
#     current_directory = os.path.dirname(__file__)
#     relative_image_path = request.json['image_path']
#     confidence = request.json['confidence']
#     iou = request.json['iou']
#     # image_path = os.path.join(current_directory, relative_image_path)
#     with open(relative_image_path, 'rb') as f:
#         original_img = Image.open(f).convert('RGB')
#     predictions = model(original_img, confidence, iou)
#     detections = [p.to_dict() for p in predictions]
#     return jsonify(detections)
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
    app.run(debug=True, port=8080)
    # app.run(host='0.0.0.0')
