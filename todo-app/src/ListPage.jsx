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
                        <Link to={`/todos/${todo.id}`}>
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
