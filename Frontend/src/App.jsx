import { useEffect, useState } from "react";
import TodoList from "./components/TodoList";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]); // Ensure tasks is an array

  // Effect for setting the className on the body and saving to localStorage
  useEffect(() => {
    // Set the body's class based on darkMode state
    document.body.className = darkMode ? "dark-mode" : "light-mode";

    // Store the current darkMode value in localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]); // Effect runs when darkMode changes

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched tasks:", data);  // Log fetched tasks
          setTasks(data);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []); // Empty dependency array ensures this only runs once when component mounts
  
  // Add a new task to the backend and then update state
  const addTask = async () => {
    if (task.trim() === "") return;
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task, completed: false }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTask(""); // Reset input field
      } else {
        console.error("Failed to add task");
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
          onClick={() => setDarkMode(!darkMode)} // Toggle darkMode
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="add-task" onClick={addTask}>
          Add Task
        </button>
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
