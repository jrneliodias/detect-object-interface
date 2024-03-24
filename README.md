# Full-stack take-home test for Overview.ai

## Overview
This project is a full-stack application that showcases an AI object detection model's predictions through a user-friendly dashboard. The backend is built with Flask in Python, serving predictions from an ONNX model. The frontend is developed using React and Fabric.js, providing an interactive interface to display the detected objects.

## The Task
The task is to create a frontend that interfaces with the backend and plays a video file, sends each frame to the API for prediction, and then shows the results for that frame on the frontend. The interface should have a video player, a configuration area for model settings to be configured (such as IoU and Confidence Level), a preview area where each bounding box returned by the model is drawn on top of the predicted frame (using Fabric.JS), and a table for the last 10 prediction results. You may use any video and any UI framework you like. 

On the backend, each inference result should be saved to a postgres database. Feel free to add or modify endpoints.

### Prerequisites

- Python 3.8 or higher
- PostgreSQL

### API Endpoints

- **Detect Objects:**
  - Endpoint: `/detect`
  - Method: POST
  - Description: Receives an image path, confidence threshold, and IoU threshold and returns the detection results.
  - Example 1:
    - request:
    ```
    {
      "image_path": "/app/test/bus.jpg",
      "confidence": 0.7,
      "iou": 0.5
    }
    ```
    - response:
    ```
    [
      {
        "box": {"height": 503, "left": 50, "top": 400, "width": 195},
        "class_name": "person",
        "confidence": 0.9132577180862427
      },
      {
        "box": {"height": 489, "left": 668, "top": 391, "width": 140},
        "class_name": "person",
        "confidence": 0.9127665758132935
      },
      {
        "box": {"height": 515,  "left": 3, "top": 228,  "width": 805},
        "class_name": "bus",
        "confidence": 0.9017127752304077
      },
      {
        "box": {"height": 452, "left": 223,  "top": 407, "width": 121},
        "class_name": "person",
        "confidence": 0.8749434351921082
      }
    ]
    ```
  - Example 2:
    - request:
    ```
    {
      "image_path": "https://storage.googleapis.com/sfr-vision-language-research/BLIP/demo.jpg",
      "confidence": 0.7,
      "iou": 0.5
    }
    ```
    - response:
    ```
    [
      {
        "box": {"height": 562, "left": 924, "top": 522, "width": 572},
        "class_name": "person",
        "confidence": 0.925483226776123
      },
      {
        "box": {"height": 623, "left": 456, "top": 585, "width": 733},
        "class_name": "dog",
        "confidence": 0.8675347566604614
      }
    ]
    ```
    
- **Health Check:**
  - Endpoint: `/health_check`
  - Method: GET
  - Description: Checks if the model is loaded and returns the status.

- **Load Model:**
  - Endpoint: `/load_model`
  - Method: POST
  - Description: Loads a specified `model_name` for object detection. One of `yolov8n` (nano, faster, less accurate) or `yolov8s` (small, a bit slower and more accurate). 

## Architecture

- **Backend:** Flask application serving the AI model's predictions.
- **Frontend:** React application with Fabric.js for interactive visualization. Use Typescript. You may use any UI framework you are familiar with.
- **Database:** PostgreSQL is used to store user inputs and model predictions.
