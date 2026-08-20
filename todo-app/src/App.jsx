import { useState } from 'react'
import { useRef } from 'react'

function App() {

  const inputValue = useRef(null);
  const [todos, setTodos] = useState([])

  function handleAddTodo(e) {
    // e.preventDefault();
    setTodos([...todos, {
      id: todos.length + 1,
      text: inputValue.current.value
    }]);
  }


  return (
    <>
      <input type="text" placeholder="할 일" ref={inputValue} />
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
