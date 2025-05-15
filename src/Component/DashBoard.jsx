import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function DashBoard() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:7000/List")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todo list:", error);
      });
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = { text: task, completed: false };

    axios
      .post("http://localhost:7000/List", newTask)
      .then((response) => {
        setTodos([...todos, response.data]);
        setTask("");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  const toggleComplete = (index) => {
    const updated = { ...todos[index], completed: !todos[index].completed };
    axios
      .put(`http://localhost:7000/List/${updated.id}`, updated)
      .then(() => {
        const updatedTodos = [...todos];
        updatedTodos[index] = updated;
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:7000/List/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const saveEdit = (index) => {
    const updated = { ...todos[index], text: editText };

    axios
      .put(`http://localhost:7000/List/${updated.id}`, updated)
      .then(() => {
        const updatedTodos = [...todos];
        updatedTodos[index] = updated;
        setTodos(updatedTodos);
        setEditIndex(null);
        setEditText("");
      })
      .catch((error) => {
        console.error("Error editing task:", error);
      });
  };

  return (
    <div className="dashboard">
      <h1>📝 Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button className="add-button" onClick={addTask}>Add</button>
      </div>
      <ul className="todo-list">
      {todos.map((todo, index) => (
        <li key={todo.id} className={`todo-item ${todo.completed ? "completed" : ""}`}>

          {editIndex === index ? (
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                type="text"
              />
              <div className="edit-actions">
                <button onClick={() => saveEdit(index)}>Save</button>
                <button onClick={() => setEditIndex(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <span onClick={() => toggleComplete(index)}>{todo.text}</span>
              <div className="actions">
                {!todo.completed && (
                  <>
                    <button onClick={() => startEdit(index)}>Edit</button>
                    <button onClick={() => deleteTask(todo.id)}>Delete</button>
                  </>
                )}
              </div>
            </>
          )}
        </li>
      ))}
      </ul>
    </div>
  );
}

export default DashBoard;
