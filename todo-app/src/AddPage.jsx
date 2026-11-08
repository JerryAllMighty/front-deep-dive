import {useOutletContext, useNavigate} from 'react-router-dom';

export function AddPage() {
    const {handleAddTodo} = useOutletContext();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const todo = formData.get('addInput');

        if (!handleAddTodo(todo)) return;     // 실패하면 폼에 머무름
        navigate('/', { replace: true });
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
