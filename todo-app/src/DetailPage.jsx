import {useOutletContext, useParams, useNavigate} from 'react-router-dom';

export function DetailPage() {
    const {todos,
        handleEditTodo, handleDeleteTodo,
        editingTodoId, setEditingTodoId} = useOutletContext();

    const {id} = useParams();
    const navigate = useNavigate();

    const todo = todos.find((x) => x.id === id);

    function remove(id){
        handleDeleteTodo(id);
        navigate('/');
    }

    return (
        <>
            {/*TODO : undefined나 null로만 비교하면 될까? 실제 값 없으면 어떻게 나올까? */}
            {todo === undefined || todo === null && (
                <span>찾을 수 없음</span>
            )}
            {editingTodoId !== todo.id && (
                <>
                    <span>{todo.text}</span>
                    <button onClick={() => setEditingTodoId(id)}>
                        수정
                    </button>
                </>
            )}
            {editingTodoId === todo.id && (
                <input
                    type="text"
                    //TODO : value를 todo.text로 설정했을 때 콘솔에 에러가 표시된 이유. 가변 설계가 필요해서?
                    defaultValue={todo.text}
                    onBlur={() => setEditingTodoId(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleEditTodo(id, e.target.value);
                        }
                        else if (e.key === 'Escape') {
                            setEditingTodoId(null);
                        }
                    }}
                />
            )}
            <button onClick={() => remove(todo.id)}>
                삭제
            </button>
        </>
    )
}
