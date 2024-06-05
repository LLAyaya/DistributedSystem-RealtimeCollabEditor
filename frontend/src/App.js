import './App.css'
import { useRef } from 'react'
import { initClient } from './client'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
        // <div>

            /* <h1>The Editor</h1>
            <Editor
                clientControllerRef={clientControllerRef}
                roomId={123}
                userName={'Quan'}
            /> */
        // </div>
    );
}

export default App;
