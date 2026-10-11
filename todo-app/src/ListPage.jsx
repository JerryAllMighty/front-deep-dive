import {useOutletContext, Link} from 'react-router-dom';

export function ListPage() {
   const {todos} = useOutletContext();

    return (
        <>
            <Link to="/new">
            <button>
                추가
            </button>
            </Link>
            <ul>
                {todos.map(
                    todo => (
                        <li key={todo.id}>
                            <Link to={`/todos/${todo.id}`}>
                            </Link>
                            {todo.text}
                        </li>
                    )
                )}
            </ul>
        </>
    )
}
