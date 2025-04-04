import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";

function App() {
  const API_URL = "https://todolist-django-backend.onrender.com/api/";

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL + "tasks/");
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (task.trim() === "") {
      console.error("Task cannot be empty");
      return;
    }

    try {
      const response = await fetch(API_URL + 'tasks/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task, completed: false }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTask("");
      } else {
        console.error("Failed to add task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="app-container">
      <div
        className={`sidebar ${tasks.length === 0 ? "centered" : "with-tasks"}`}
      >
        <h1>Olandria's TODO App</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTask();
            }
          }}
        />
        <button
          className="add-task"
          onClick={() => {
            addTask();
          }}
        >
          Add Task
        </button>

        <div className="submenu">
          <button onClick={() => window.open("https://github.com/IyanuKwent/ToDoList_Django", "_blank")}>
            Repository
          </button>
          <button onClick={() => window.open("https://todolist-django-backend.onrender.com/api/tasks/", "_blank")}>
            Backend Deployment
          </button>
        </div>
      </div>

      {tasks.length > 0 ? (
        <TodoList tasks={tasks} setTasks={setTasks} />
      ) : (
        <p style={{ textAlign: "right", width: "0%" }}></p>
      )}
    </div>
  );
}

export default App;
