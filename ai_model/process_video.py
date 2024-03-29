import cv2
from PIL import Image
from smart_open import open
import os
from dataclass import *
import datetime
import json


model = Model("yolov8s")


class DetectionsProcess:
    def __init__(self) -> None:
        self.all_detections = []

    def add_frame_to_detections(self, new_detection_array: list[dict], frame_number: int):
        if not new_detection_array:
            return
        for detection in new_detection_array:
            detection["frame_number"] = frame_number
        self.insert_detections_to_all_detections(new_detection_array)

    def insert_detections_to_all_detections(self, new_detection_array: list[dict]):
        for detection in new_detection_array:
            self.all_detections.append(detection)

    def save_detections_in_json(self,
                                output_file: str = 'detection.json'):

        with open(output_file, 'a') as f:
            json.dump(self.all_detections, f, indent=4)


class VideoProcessor:
    def __init__(self,
                 all_detections: DetectionsProcess,
                 video_path: str,
                 confidence: float = 0.7,
                 iou: float = 0.5,
                 ) -> None:

        self.input_video_path = video_path
        self.output_video_path = ''
        self.output_video_filename = ''
        self.confidence = confidence
        self.iou = iou
        self.frames_folder = 'output-videos'
        self.video_props = {}
        self.cap = ''
        self.out = ''
        self.frame_number = 1
        self.all_detections = all_detections

    def main_process(self):

        self.create_frames_folder()
        self.generate_video_filename()
        self.generate_output_video_path()
        self.get_video_parameters()
        self.initialize_video_writer()

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            detections = self.detect_object(frame)
            self.all_detections.add_frame_to_detections(
                detections, self.frame_number)

            frame_with_detection = self.draw_box_and_text(frame, detections)

            self.out.write(frame_with_detection)
            self.frame_number += 1

        self.cap.release()
        self.out.release()
        cv2.destroyAllWindows()
        # self.all_detections.save_detections_in_json()
        return self.output_video_filename

    def initialize_video_writer(self):
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        self.out = cv2.VideoWriter(self.output_video_path,
                                   fourcc,
                                   self.video_props['fps'],
                                   (self.video_props['frame_width'],
                                    self.video_props['frame_height']))

    def get_video_parameters(self):
        cap = cv2.VideoCapture(self.input_video_path)
        self.video_props['fps'] = cap.get(cv2.CAP_PROP_FPS)
        self.video_props['frame_width'] = int(
            cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.video_props['frame_height'] = int(
            cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.cap = cap

    def create_frames_folder(self):
        os.makedirs(self.frames_folder, exist_ok=True)

    def generate_video_filename(self):
        current_datetime = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        self.output_video_filename = f'{current_datetime}.mp4'
        return self.output_video_filename

    def generate_output_video_path(self):
        self.output_video_path = os.path.join(self.frames_folder,
                                              self.output_video_filename)

    def detect_object(self, image_data: str):

        original_img = Image.fromarray(
            cv2.cvtColor(image_data, cv2.COLOR_BGR2RGB))
        predictions = model(original_img, self.confidence, self.iou)
        detections = [p.to_dict() for p in predictions]
        return detections

    def draw_box_and_text(self, frame: str, detections: list[dict]):
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
