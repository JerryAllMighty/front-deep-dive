import { useState } from 'react'

function App() {

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([])

  function handleAddTodo(e) {
    // e.preventDefault();
    setTodos([...todos, {
      id: Crypto.randomUUID(),
      text: inputValue
    }]);
    setInputValue('');
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
          todo => <li key={todo.id}>{todo.text}</li>
        )}
      </ul>
    </>
  )
}

export default App
