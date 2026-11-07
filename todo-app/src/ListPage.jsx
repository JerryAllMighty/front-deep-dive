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
                        //TODO: 이렇게 키를 안 주고 했을 때 문제는 없을지?
                        // <li key={todo.id}>
                            <Link to={`/todos/${todo.id}`}>
                                {todo.text}
                            </Link>
                        // </li>
                    )
                )}
            </ul>
        </>
    )
}
