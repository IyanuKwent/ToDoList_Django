import { useState, useEffect } from "react";

// This component now handles fetching, adding, editing, and deleting tasks
export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch tasks from the Django backend API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/");
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

  // Add a new task to the database through a POST request
  const addTask = async (taskText) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: taskText, completed: false }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update a task's completion status or text
  const updateTask = async (index, updatedText) => {
    try {
      const task = tasks[index];
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/update/${task.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: updatedText,
            completed: task.completed,
          }),
        }
      );

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

  // Delete a task from the backend
  const removeTask = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/delete/${task.id}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (index) => {
    const task = tasks[index];
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/update/${task.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: task.text,
            completed: !task.completed,
          }),
        }
      );

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
    await updateTask(editIndex, editText);
    setEditIndex(null);
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
