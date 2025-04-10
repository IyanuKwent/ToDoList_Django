import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";

function App() {
  const API_URL = "https://todolist-django-backend.onrender.com/";

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "success" | "error"

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authToken) return;

      try {
        const response = await fetch(API_URL + "api/tasks/", {
          headers: {
            Authorization: `Token ${authToken}`,
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

    if (authToken) {
      setLoggedIn(true);
      fetchTasks();
    }
  }, [authToken]);

  const addTask = async () => {
    if (task.trim() === "") {
      setAlertMessage("Task cannot be empty.");
      setAlertType("error");
      return;
    }

    try {
      const response = await fetch("https://todolist-django-backend.onrender.com/api-token-auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {

        const data = await response.json();
        localStorage.setItem("authToken", data.token); // ✅ This is for TokenAuth
        setAuthToken(data.token);
        setLoggedIn(true);

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTask("");
        setAlertMessage("Task added!");
        setAlertType("success");

      } else {
        setAlertMessage("Failed to add task.");
        setAlertType("error");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setAlertMessage("An error occurred while adding task.");
      setAlertType("error");
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setAlertMessage("Logging in...");
    setAlertType("success");

    try {
      const response = await fetch(API_URL + "api-token-auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        setAuthToken(data.token);
        setLoggedIn(true);
        setAlertMessage("Login successful!");
        setAlertType("success");
      } else {
        setAlertMessage("Invalid username or password.");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("Login failed due to a server error.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setLoggedIn(false);
    setAuthToken("");
    setTasks([]);
    setUsername("");
    setPassword("");
    setAlertMessage("Logged out.");
    setAlertType("success");
  };

  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      <div className={`sidebar ${tasks.length === 0 && !loggedIn ? "centered" : "with-tasks"}`}>
        <h1>Olandria's TODO App</h1>

        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}

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
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        ) : (
          <>
            <button onClick={handleLogout}>Logout</button>

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
            <button className="add-task" onClick={addTask}>
              Add Task
            </button>

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
          </>
        )}
      </div>

      {loggedIn && (
        <div className="todo-column" style={{ flexGrow: 1, padding: "30px", overflowY: "auto" }}>
          <TodoList tasks={tasks} setTasks={setTasks} authToken={authToken} />
        </div>
      )}
    </div>
  );
}

export default App;
