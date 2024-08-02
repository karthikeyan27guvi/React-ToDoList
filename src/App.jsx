import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

 function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodoName.trim() !== "" && newTodoDescription.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        name: newTodoName,
        description: newTodoDescription,
        status: "Not Completed",
      };
      setTodos([...todos, newTodo]);
      setNewTodoName("");
      setNewTodoDescription("");
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (id) => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    const todoToEdit = todos[todoIndex];
    setNewTodoName(todoToEdit.name);
    setNewTodoDescription(todoToEdit.description);
    setIsEditing(true);
    setEditingTodoId(id);
  };

  const handleUpdateTodo = () => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === editingTodoId) {
        return {
          ...todo,
          name: newTodoName,
          description: newTodoDescription,
        };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
    setIsEditing(false);
    setEditingTodoId(null);
    setNewTodoName("");
    setNewTodoDescription("");
  };

  const handleStatusChange = (id, newStatus) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            status: newStatus,
          };
        } else {
          return todo;
        }
      });
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "all") {
      return true;
    } else {
      return todo.status === filterStatus;
    }
  });

  return <>
    <div className="container">
  <h1>My Todos</h1>
  <div className="input-group">
    <input
      type="text"
      placeholder="Todo Name"
      value={newTodoName}
      onChange={(e) => setNewTodoName(e.target.value)}
    />
    <input
      type="text"
      placeholder="Todo Description"
      value={newTodoDescription}
      onChange={(e) => setNewTodoDescription(e.target.value)}
    />
    {isEditing ? (
      <button onClick={handleUpdateTodo}>Update Todo</button>
    ) : (
      <button onClick={handleAddTodo}>Add Todo</button>
    )}
  </div>

  <div className="filter">
    <label htmlFor="status-filter">Status Filter:</label>
    <select
      id="status-filter"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="all">All</option>
      <option value="Completed">Completed</option>
      <option value="Not Completed">Not Completed</option>
    </select>
  </div>

  <div className="todos">
    {filteredTodos.map((todo) => (
      <div key={todo.id} className="todo-card">
        <div className="card">
          <div className="card-header">
            <p>Name:{todo.name}</p>
            <p>Description:{todo.description}</p>
          </div>
          <div className="card-body">
            
            <div className="status-dropdown">
              <button
                onClick={() =>
                  handleStatusChange(todo.id, todo.status === "Not Completed" ? "Completed" : "Not Completed")
                }
              >
                {todo.status}
              </button>
            </div>
          </div>
          <div className="card-footer">
            <div className="todo-actions">
              <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </>
}

export default App
