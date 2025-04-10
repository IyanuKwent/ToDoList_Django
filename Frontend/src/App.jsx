import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";

function App() {
  const API_URL = "https://todolist-django-backend.onrender.com/api/";

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authToken) return; // Prevent fetching if no token is available

      try {
        const response = await fetch(API_URL + "tasks/", {
          headers: {
            "Authorization": `Token ${authToken}`,
          },
        });
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

    if (loggedIn) {
      fetchTasks();
    }
  }, [loggedIn, authToken]); // Re-fetch tasks when the user logs in or token changes

  const addTask = async () => {
    if (task.trim() === "") {
      console.error("Task cannot be empty");
      return;
    }

    try {
      const response = await fetch(API_URL + "tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
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

  const handleLogin = async () => {
    try {
      const response = await fetch(API_URL + "auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.access); // Store the access token
        setAuthToken(data.access);
        setLoggedIn(true);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setLoggedIn(false);
    setAuthToken("");
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${tasks.length === 0 ? "centered" : "with-tasks"}`}>
        <h1>Olandria's TODO App</h1>

        {/* Login form when not logged in */}
        {!loggedIn ? (
          <div className="login-form">
            <h3>Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        ) : (
          <>
            <button onClick={handleLogout}>Logout</button>

            {/* Dark Mode Toggle */}
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Add Task Input */}
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
            <button className="add-task" onClick={addTask}>
              Add Task
            </button>

            {/* Submenu for repository and backend */}
            <div className="submenu">
              <button
                onClick={() =>
                  window.open("https://github.com/IyanuKwent/ToDoList_Django", "_blank")
                }
              >
                Repository
              </button>
              <button
                onClick={() =>
                  window.open("https://todolist-django-backend.onrender.com/api/tasks/", "_blank")
                }
              >
                Backend Deployment
              </button>
            </div>

            {/* Todo List */}
            {tasks.length > 0 && <TodoList tasks={tasks} setTasks={setTasks} authToken={authToken} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
