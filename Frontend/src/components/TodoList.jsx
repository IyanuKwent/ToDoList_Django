import { useState, useEffect } from "react";

export default function TodoList() {
  const API_URL = "http://127.0.0.1:8000/api/tasks/";  // For production




  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch tasks from the Render backend API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
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
  }, []); // Runs once when component mounts
  
  

  // Update a task
  const updateTask = async (index, updatedText) => {
    try {
      const task = tasks[index];
      const response = await fetch(API_URL + `update/${task.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: updatedText,
          completed: task.completed,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t, i) => (i === index ? updatedTask : t))
        );
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const removeTask = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(API_URL + `delete/${task.id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const toggleComplete = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(API_URL + `update/${task.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task.text,
          completed: !task.completed,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t, i) => (i === index ? updatedTask : t))
        );
      } else {
        console.error("Failed to toggle task completion");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Start editing a task
  const startEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  // Save edited task
  const saveEdit = async () => {
    await updateTask(editIndex, editText);
    setEditIndex(null);
  };

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="task-container">
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul>
        {filteredTasks.map((t, index) => (
          <li
            key={t.id}
            className={t.completed ? "completed" : ""}
            onClick={() => toggleComplete(index)}
          >
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span>{t.text}</span>
            )}

            <div className="task-buttons">
              {editIndex === index ? (
                <button
                  onClick={(e) => {
                    stopPropagation(e);
                    saveEdit();
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    stopPropagation(e);
                    startEdit(index, t.text);
                  }}
                >
                  Edit
                </button>
              )}

              <button
                onClick={(e) => {
                  stopPropagation(e);
                  removeTask(index);
                }}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
