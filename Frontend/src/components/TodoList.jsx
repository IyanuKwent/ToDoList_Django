import { useState } from "react";

export default function TodoList({ tasks, setTasks, authToken }) {
  const API_URL = "https://todolist-django-backend.onrender.com/api/";

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  const updateTask = async (index, updatedText) => {
    const task = tasks[index];
    try {
      const response = await fetch(API_URL + `tasks/${task.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
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

  const removeTask = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(API_URL + `tasks/${task.id}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Token ${authToken}`,
        },
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

  const toggleComplete = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(API_URL + `tasks/${task.id}/toggle/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${authToken}`,
        },
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

  const startEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = async () => {
    if (typeof editText === "string") {
      await updateTask(editIndex, editText);
      setEditIndex(null);
    } else {
      console.error("Edit text is not a valid string");
    }
  };

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
