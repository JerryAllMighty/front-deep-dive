import {useOutletContext, Link} from 'react-router-dom';

export function ListPage() {
   const {todos} = useOutletContext();

    return (
        <>
            <Link to="/new">
                추가
            </Link>
            <ul>
                {todos.map(
                    todo => (
                        <li key={todo.id}>
                            <Link to={`/todos/${todo.id}`}>
                                {todo.text}
                            </Link>
                        </li>
                    )
                )}
            </ul>
        </>
    )
}
