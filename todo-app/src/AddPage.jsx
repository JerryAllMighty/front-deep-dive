import {useOutletContext, useNavigate} from 'react-router-dom';

export function AddPage() {
    const {handleAddTodo} = useOutletContext();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        // 1. 폼 제출 시 페이지가 새로고침되는 기본 동작을 차단합니다.
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const todo = formData.get('addInput');

        handleAddTodo(todo);

        // 4. 목록 페이지로 이동합니다.
        navigate('/');
    };



    return (
        <>
            <form onSubmit={handleSubmit} style={{ marginTop: '12px' }}>
                <input
                    name="addInput"
                    type="text"
                    placeholder="할 일"
                    defaultValue=''
                />
                <br />
                <button type="submit" style={{ padding: '8px 12px' }}>등록하기</button>
            </form>
        </>
    )
}
