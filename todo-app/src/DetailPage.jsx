import {useOutletContext, useParams, useNavigate, Link} from 'react-router-dom';
import {useState} from "react";

export function DetailPage() {
    const {todos, handleEditTodo, handleDeleteTodo} = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();

    const todo = todos.find((x) => x.id === id);
    if (!todo) {
        return (
            <>
                <p>찾을 수 없음</p>
                <Link to={"/"}>목록으로</Link>
            </>
        )
    }

    function remove() {
        handleDeleteTodo(id);
        navigate('/', {replace: true});
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            if (handleEditTodo(id, e.currentTarget.value)) setIsEditing(false);
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    }

    return (
        <>
            {isEditing ? (
                <input
                    autoFocus
                    defaultValue={todo.text}
                    type="text"
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <>
                    <span>{todo.text}</span>
                    <button onClick={() => setIsEditing(true)}>
                        수정
                    </button>
                </>
            )}
            <button onClick={remove}>
                삭제
            </button>
        </>
    );
}
