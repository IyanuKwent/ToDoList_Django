TODO App - README

Overview


This project is a To-Do List Application that allows users to manage tasks. It features task management functionalities, including:

Add a new task

Update an existing task

Delete a task

Toggle task completion

Filter tasks based on their completion status

The project uses Django for the backend and React for the frontend.

Frontend
The frontend is a React.js application that allows users to interact with the backend API. It includes the following features:

Dark mode toggle: Switch between light and dark themes.

Add task input: Add new tasks to the to-do list.

Edit task: Edit the text of an existing task.

Delete task: Remove a task from the to-do list.

Toggle task completion: Mark a task as completed or pending.

Filter tasks: Filter tasks based on their completion status (All, Completed, Pending).

TODO App - README
Overview
This project is a To-Do List Application that allows users to manage tasks. It features task management functionalities, including:

Add a new task

Update an existing task

Delete a task

Toggle task completion

Filter tasks based on their completion status

The project uses Django for the backend and React for the frontend.

Backend
The backend is a Django application that serves the API for task management. It exposes RESTful endpoints for CRUD operations (Create, Read, Update, Delete) on tasks.


API Endpoints
1. Get All Tasks
Endpoint: GET /api/tasks/

Description: Fetches all tasks from the database.

Response Example:

json
Copy
Edit
[
  {
    "id": 1,
    "text": "Buy groceries",
    "completed": false
  },
  {
    "id": 2,
    "text": "Complete homework",
    "completed": true
  }
]
2. Add a New Task
Endpoint: POST /api/tasks/add/

Description: Adds a new task to the to-do list.

Request Body:

json
Copy
Edit
{
  "text": "New task",
  "completed": false
}
Response Example:

json
Copy
Edit
{
  "id": 3,
  "text": "New task",
  "completed": false
}
3. Update an Existing Task
Endpoint: PUT /api/tasks/{id}/

Description: Updates the text or completion status of an existing task.

Request Body:

json
Copy
Edit
{
  "text": "Updated task text",
  "completed": true
}
Response Example:

json
Copy
Edit
{
  "id": 3,
  "text": "Updated task text",
  "completed": true
}
4. Delete a Task
Endpoint: DELETE /api/tasks/{id}/

Description: Deletes the task with the specified ID.

Response Example:

json
Copy
Edit
{
  "message": "Task deleted successfully"
}
5. Toggle Task Completion
Endpoint: PUT /api/tasks/{id}/toggle/

Description: Toggles the completion status of a task.

Response Example:

json
Copy
Edit
{
  "id": 3,
  "text": "Task text",
  "completed": true
}
Installation Guide
1. Backend Setup (Django)
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-repository/todolist-django-backend.git
cd todolist-django-backend
Create and activate a virtual environment:

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Run migrations:

bash
Copy
Edit
python manage.py migrate
Start the Django development server:

bash
Copy
Edit
python manage.py runserver
The backend will be running at http://127.0.0.1:8000/.

2. Frontend Setup (React)
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-repository/todolist-react-frontend.git
cd todolist-react-frontend
Install dependencies:

bash
Copy
Edit
npm install
Run the React development server:

bash
Copy
Edit
npm start
The frontend will be running at http://localhost:3000/.

Environment Variables
Make sure to set the following environment variables in your project.

Backend (.env file):
DJANGO_SECRET_KEY: Your Django secret key.

DATABASE_URL: Your PostgreSQL database URL.

Testing the API
You can test the API endpoints using tools like Postman or cURL. Below are examples of using cURL for each endpoint:

1. Get All Tasks:
bash
Copy
Edit
curl -X GET http://127.0.0.1:8000/api/tasks/

3. Add a New Task:
bash
Copy
Edit
curl -X POST http://127.0.0.1:8000/api/tasks/ -H "Content-Type: application/json" -d '{"text": "New task", "completed": false}'

5. Update a Task:
bash
Copy
Edit
curl -X PUT http://127.0.0.1:8000/api/tasks/1/ -H "Content-Type: application/json" -d '{"text": "Updated task", "completed": true}'

7. Delete a Task:
bash
Copy
Edit
curl -X DELETE http://127.0.0.1:8000/api/tasks/1/

9. Toggle Task Completion:
bash
Copy
Edit
curl -X PUT http://127.0.0.1:8000/api/tasks/1/toggle/
