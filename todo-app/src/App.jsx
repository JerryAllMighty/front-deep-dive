import { useState } from 'react'

function App() {
  const listItems = [
    { id: 1, text: '리액트 공부하기' },
    { id: 2, text: '점심 먹기' },
    { id: 3, text: '운동하기' },
  ]
  function handleAddTodo() {

  }


  return (
    <>
      <input type="text" placeholder="할 일" />
      <button onClick={handleAddTodo}>
        추가
      </button>

      <ul>
        {listItems.map(
          item => <li key={item.id}>{item.text}</li>
        )}
      </ul>
    </>
  )
}

export default App
