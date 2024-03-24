# Use a base image with the necessary dependencies
FROM python:3.9-slim

# Install ffmpeg and other dependencies
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the required dependencies
RUN pip install --upgrade pip && \
    grep -v -e opencv requirements.txt | pip install --no-cache-dir -r /dev/stdin && \
    pip install  --no-cache-dir onnxruntime-gpu==1.14.0 && \
    pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 5000

# Define the command to run the app
CMD ["python", "app.py"]
