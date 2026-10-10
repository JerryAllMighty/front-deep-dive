import {useState, useEffect} from 'react'
import {Routes, Outlet, Route, useNavigate} from 'react-router-dom'
import {ListPage} from "./ListPage.jsx";
import {AddPage} from "./AddPage.jsx";

function App() {
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [editingTodoId, setEditingTodoId] = useState(null);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    function handleAddTodo() {
        if (inputValue.trim() === '') {
            return;
        }
        setTodos([...todos, {
            id: crypto.randomUUID(),
            text: inputValue
        }]);
        setInputValue('/');
    }

    function handleDeleteTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
        navigate();
    }

    function handleEditTodo(id, newText) {
        if (newText === null || newText.trim() === '') {
            return;
        }

        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return {...todo, text: newText};
            }
            return todo;
        }));

        setEditingTodoId(null);
    }

    return (
        <>
            <Routes>
                <Route element={<Outlet context={{todos, inputValue, setInputValue, handleAddTodo, handleEditTodo, editingTodoId, setEditingTodoId, handleDeleteTodo}}></Outlet>}>
                    <Route index element={<ListPage />}>
                    </Route>
                    <Route path={"/"} element={<ListPage />}>
                    </Route>
                    <Route path={"/new"} element={<AddPage />}>
                    </Route>
                    <Route path={"/todos/:id"} element={<Outlet context={{todos, inputValue, setInputValue, handleAddTodo, handleEditTodo, editingTodoId, setEditingTodoId, handleDeleteTodo}}></Outlet>}>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
