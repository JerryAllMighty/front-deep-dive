import {useOutletContext, Link} from 'react-router-dom';

export function ListPage() {
   const {todos, handleAddTodo} = useOutletContext();

    return (
        <>
            <Link to="/new">
            <button onClick={handleAddTodo}>
                추가
            </button>
            </Link>
            <ul>
                {todos.map(
                    todo => (
                        <Link to={/todos/`${todo.id}`}>
                            <li key={todo.id}>
                                {todo.text}
                            </li>
                         </Link>
                    )
                )}
            </ul>
        </>
    )
}
