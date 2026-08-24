import { useState, useEffect } from 'react'

function App() {

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [editingTodoId, setEditingTodoId] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  function handleAddTodo(e) {
    if (inputValue.trim() === '') {
      return;
    }
    setTodos([...todos, {
      id: crypto.randomUUID(),
      text: inputValue
    }]);
    setInputValue('');
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  function handleEditTodo(id, newText) {
    if (newText === null || newText.trim() === '') {
      return;
    }

    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, text: newText };
      }
      return todo;
    }));

    setEditingTodoId(null);
  }


  return (
    <>
      <input
        type="text"
        placeholder="할 일"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleAddTodo}>
        추가
      </button>

      <ul>
        {todos.map(
          todo => (
            <li key={todo.id}>
              {editingTodoId === todo.id && (
                <input
                  type="text"
                  defaultValue={todo.text}
                  onBlur={(e) => handleEditTodo(todo.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditTodo(todo.id, e.target.value);
                    }
                    if (e.key === 'Escape') {
                      setEditingTodoId(null);
                    }
                  }}
                />
              )}
              {editingTodoId !== todo.id && (
                <>
                  <span>{todo.text}</span>
                  <button onClick={() => setEditingTodoId(todo.id)}>
                    수정
                  </button>
                </>
              )}
              <button onClick={() => handleDeleteTodo(todo.id)}>
                삭제
              </button>
            </li>
          )
        )}
      </ul>
    </>
  )
}

export default App
