import numpy as np
import cv2
from PIL import Image
import onnxruntime as ort
from typing import List
from dataclasses import dataclass
from flask import Flask, request, jsonify
from smart_open import open
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')


@dataclass
class BBOX:
    left: int
    top: int
    width: int
    height: int


@dataclass
class Prediction:
    class_name: int
    confidence: float
    box: BBOX

    def to_dict(self):
        return {
            "class_name": str(self.class_name),
            "confidence": float(self.confidence),
            "box": {
                "left": int(self.box.left),
                "top": int(self.box.top),
                "width": int(self.box.width),
                "height": int(self.box.height)
            }
        }


class Model:
    def __init__(self, model_name: str):
        self.model_name = model_name
        providers = ort.get_available_providers()
        print(f"Available providers: {providers}")
        self.model = ort.InferenceSession(
            f"models/{model_name}.onnx", providers=providers)
        self.input_name = self.model.get_inputs()[0].name
        self.output_name = self.model.get_outputs()[0].name
        self.input_width = self.model.get_inputs()[0].shape[2]
        self.input_height = self.model.get_inputs()[0].shape[3]
        self.idx2class = eval(
            self.model.get_modelmeta().custom_metadata_map['names'])

    def preprocess(
        self,
        img: Image.Image
    ) -> np.ndarray:
        img = img.resize((self.input_width, self.input_height))
        img = np.array(img).transpose(2, 0, 1)
        img = np.expand_dims(img, axis=0)
        img = img / 255.0
        img = img.astype(np.float32)
        return img

    def postprocess(
        self,
        output: np.ndarray,
        confidence_thresh: float,
        iou_thresh: float,
        img_width: int,
        img_height: int
    ) -> List[Prediction]:

        outputs = np.transpose(np.squeeze(output[0]))
        rows = outputs.shape[0]
        boxes = []
        scores = []
        class_ids = []
        x_factor = img_width / self.input_width
        y_factor = img_height / self.input_height
        for i in range(rows):
            classes_scores = outputs[i][4:]
            max_score = np.amax(classes_scores)
            if max_score >= confidence_thresh:
                class_id = np.argmax(classes_scores)
                x, y, w, h = outputs[i][0], outputs[i][1], outputs[i][2], outputs[i][3]
                left = int((x - w / 2) * x_factor)
                top = int((y - h / 2) * y_factor)
                width = int(w * x_factor)
                height = int(h * y_factor)
                class_ids.append(class_id)
                scores.append(max_score)
                boxes.append([left, top, width, height])
        indices = cv2.dnn.NMSBoxes(
            boxes, scores, confidence_thresh, iou_thresh)
        detections = []
        if len(indices) > 0:
            for i in indices.flatten():
                left, top, width, height = boxes[i]
                class_id = class_ids[i]
                score = scores[i]
                detection = Prediction(
                    class_name=self.idx2class[class_id],
                    confidence=score,
                    box=BBOX(left, top, width, height)
                )
                detections.append(detection)
        return detections

    def __call__(
        self,
        img: Image.Image,
        confidence_thresh: float,
        iou_thresh: float
    ) -> List[Prediction]:
        img_input = self.preprocess(img)
        outputs = self.model.run(None, {self.input_name: img_input})
        predictions = self.postprocess(
            outputs, confidence_thresh, iou_thresh, img.width, img.height)
        return predictions


@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jessie'
            ]
        }
    )


model = Model("yolov8s")


@app.route('/detect', methods=['POST'])
def detect():
    image_path = request.json['image_path']
    confidence = request.json['confidence']
    iou = request.json['iou']
    with open(image_path, 'rb') as f:
        original_img = Image.open(f).convert('RGB')
    predictions = model(original_img, confidence, iou)
    detections = [p.to_dict() for p in predictions]

    return jsonify(detections)


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
