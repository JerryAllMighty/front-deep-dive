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

    function remove(id) {
        handleDeleteTodo(id);
        navigate('/', {replace: true});
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            if (handleEditTodo(id, e.currentTarget.value)) setIsEditing(false);
        } else if (e.key === 'Escape') {
            setIsEditing(null);
        }
    }

    return (
        <>
            {isEditing ? (
                <input
                    autoFocus
                    defaultValue={todo.text}
                    type="text"
                    //TODO : value를 todo.text로 설정했을 때 콘솔에 에러가 표시된 이유. 가변 설계가 필요해서?
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
            <button onClick={remove(todo.id)}>
                삭제
            </button>
        </>
    );
}
