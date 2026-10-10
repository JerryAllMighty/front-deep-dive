import {useOutletContext} from 'react-router-dom';

export function AddPage() {
    const {todos, inputValue, setInputValue, handleAddTodo, handleEditTodo, editingTodoId, setEditingTodoId, handleDeleteTodo} = useOutletContext();

    const handleSubmit = (e) => {
        // 1. 폼 제출 시 페이지가 새로고침되는 기본 동작을 차단합니다.
        e.preventDefault();
        if (!title.trim()) return;

        const newPostData = { id: Date.now(), title };

        // 2. [로컬 스토리지 저장 로직]
        // 기존에 로컬 스토리지에 저장되어 있던 목록을 가져옵니다. (없으면 빈 배열)
        const existingPosts = JSON.parse(localStorage.getItem('my_posts')) || [];

        // 새 글을 기존 목록 배열에 추가합니다.
        const updatedPosts = [...existingPosts, newPostData];

        // 다시 문자열로 변환하여 로컬 스토리지에 저장합니다.
        localStorage.setItem('my_posts', JSON.stringify(updatedPosts));

        // 3. 부모 레이아웃의 상태도 함께 업데이트하여 화면에 즉시 반영되게 합니다.
        addPost(title);

        // 4. 목록 페이지로 이동합니다.
        navigate('/posts');
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ marginTop: '12px' }}>
                <input
                    type="text"
                    placeholder="할 일"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" style={{ padding: '8px 12px' }}>등록하기</button>
            </form>
        </>
    )
}
