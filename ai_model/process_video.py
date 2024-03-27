import cv2
from PIL import Image
from smart_open import open
import os
from dataclass import *
import datetime
import json


model = Model("yolov8s")


def video_processor(video_path: str,
                    confidence: float = 0.7,
                    iou: float = 0.5):
    video_filename, out, cap = get_video_config(video_path)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        detections = detect_object(frame, confidence, iou)
        frame_with_detection = draw_box(frame, detections)
        out.write(frame_with_detection)

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    return video_filename


def get_video_config(video_path: str):
    frames_folder = 'output-videos'

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
    return video_filename, out, cap


def detect_object(image_data: str,
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
