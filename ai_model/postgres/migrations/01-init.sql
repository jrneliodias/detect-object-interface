CREATE TABLE IF NOT EXISTS user_inputs (
    id SERIAL PRIMARY KEY,
    server_video_name VARCHAR(50) NOT NULL,
    confidence_input DECIMAL(5, 4) NOT NULL,
    iou_input DECIMAL(5, 4) NOT NULL
);

CREATE TABLE IF NOT EXISTS detections (
    id INT PRIMARY KEY,
    frame VARCHAR(15) NOT NULL,
    box_left INT NOT NULL,
    box_top INT NOT NULL,
    box_width INT NOT NULL,
    box_height INT NOT NULL,
    class_name VARCHAR(15) NOT NULL,
    confidence DECIMAL(15, 14) NOT NULL,
    user_input_id INT,  

    FOREIGN KEY (user_input_id) REFERENCES user_inputs(id) ON DELETE CASCADE

);
