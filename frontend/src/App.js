import './App.css'
import { useRef } from 'react'
import { initClient } from './client'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import toast from 'react-hot-toast'

function App() {
    const clientControllerRef = useRef(null)

    clientControllerRef.current = initClient()

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home clientControllerRef={clientControllerRef} />}></Route>
                    <Route
                        path='/editor'
                        element={<EditorPage clientControllerRef={clientControllerRef} />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
