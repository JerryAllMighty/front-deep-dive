import {useState, useEffect} from 'react'
import {Routes, Outlet, Route} from 'react-router-dom'
import {ListPage} from "./ListPage.jsx";
import {AddPage} from "./AddPage.jsx";
import {DetailPage} from "./DetailPage.jsx";

function App() {
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });


    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    function handleAddTodo(text) {
        if (text.trim() === '') {
            return;
        }
        setTodos([...todos, {
            id: crypto.randomUUID(),
            text: text
        }]);
    }

    function handleDeleteTodo(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    function handleEditTodo(id, text) {
        if (text === null || text.trim() === '') {
            return;
        }

        setTodos(todos.map(todo =>
            todo.id === id ?  {...todo, text: text} : todo));

        return true;
    }

    return (
        <>
            <Routes>
                <Route element={<Outlet context={
                    {
                        todos,
                        handleAddTodo, handleEditTodo, handleDeleteTodo}}></Outlet>}>
                    <Route index element={<ListPage />}>
                    </Route>
                    <Route path={"/"} element={<ListPage />}>
                    </Route>
                    <Route path={"/new"} element={<AddPage />}>
                    </Route>
                    <Route path={"/todos/:id"} element={<DetailPage />}>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
