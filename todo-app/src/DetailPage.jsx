import {useOutletContext, Link, useParams} from 'react-router-dom';

export function DetailPage() {
    const {handleEditTodo, editingTodoId, setEditingTodoId, handleDeleteTodo} = useOutletContext();
    const {id} = useParams();
    return (
        <>
            <li key={id}>
                {editingTodoId === id && (
                    <input
                        type="text"
                        defaultValue={text}
                        onBlur={(e) => handleEditTodo(id, e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleEditTodo(id, e.target.value);
                            }
                            if (e.key === 'Escape') {
                                setEditingTodoId(null);
                            }
                        }}
                    />
                )}
                {editingTodoId !== id && (
                    <>
                        <span>{text}</span>
                        <button onClick={() => handleDeleteTodo(id)}>
                            수정
                        </button>
                    </>
                )}
                <button onClick={() => handleDeleteTodo(id)}>
                    삭제
                </button>
            </li>
        </>
    )
}
