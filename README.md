The system is divided into three distinct areas: Frontend, Backend, and Database, each playing a fundamental role in the project's functionality. Let’s take a look at the technologies we used in each:

## Frontend
For the frontend, I chose:

- **React** with **Vite** for an agile development experience.
- **TypeScript** for more robust and secure code.
- **Shadcn UI** for consistent and modern visual components.
- **Tailwind CSS** to streamline styling and responsive design.
- **ViTest** for automated tests and quality assurance.

## Backend
For the backend, I selected:

- **Python** as the main language due to its versatility and power.
- **Flask** as a web framework, offering a lightweight and flexible structure.
- **Pytest** for unit and integration testing, ensuring system stability.
- **OpenCV** to handle video frames and draw object detection.
- **SQLAlchemy** for efficient database communication and data handling.
- And, of course, **YOLOv8** for fast and accurate object detection.

## Database
For the database, we used:

- **Docker** to create isolated environments and simplify deployment.
- **PostgreSQL** to efficiently and reliably store and manage data.

## Considerations
This project was a real challenge for me, as I had to work with different technologies and architectures, as well as learn how to integrate them cohesively. From structuring the frontend and backend to communicating with the database, each step was an opportunity to enhance my knowledge in software architecture and **Clean Code** practices.

Additionally, the experience of working with **Flask** to build a robust and efficient API, alongside integrating an AI model as a tool in the process, was extremely enriching. I learned a lot about error management, route planning, and ensuring effective communication between server and client.

I also can’t forget to mention my journey with **Docker**, where I gained skills in creating custom images and efficiently managing development environments using **docker-compose**.

## How to run the system

### **Installing dependencies**

### Frontend (optional since it's in docker-compose)

```bash
cd front-end
npm install
```

To start the server, run the migration

```bash
cd ai_model
python postgres\db\client.py
python app.py
```

###  Proeject Presentation
[Video de apresentação](https://youtu.be/caQDQw47jpM)

