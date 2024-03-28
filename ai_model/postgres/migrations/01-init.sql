CREATE TABLE IF NOT EXISTS user_inputs (
    id INT PRIMARY KEY,
    video_name VARCHAR(50) NOT NULL,
    confidence_input VARCHAR(50) NOT NULL,
    iou_input VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS detections (
    id INT PRIMARY KEY,
    frame VARCHAR(50) NOT NULL,
    box_left VARCHAR(50) NOT NULL,
    box_top VARCHAR(50) NOT NULL,
    box_width VARCHAR(50) NOT NULL,
    box_height VARCHAR(50) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    confidence VARCHAR(50) NOT NULL,
    user_input_id INT,  

    FOREIGN KEY (user_input_id) REFERENCES user_inputs(id) 

);
