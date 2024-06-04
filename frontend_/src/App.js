import './App.css'
import { useRef, useEffect } from 'react'
import Editor from './components/Editor'
import { initClient } from './client'

function App() {
    const clientControllerRef = useRef(null)

    useEffect(() => {
        const init = async () => {
            clientControllerRef.current = await initClient()

            clientControllerRef.current.createRoom(123)
            clientControllerRef.current.joinRoom(123, 'Quan')
        }
        init()

        return () => {
            // Terminate the clientController instance in ref
        }
    }, [])
    

    return (
        <div>
            <h1>The Editor</h1>
            <Editor
                clientControllerRef={clientControllerRef}
                roomId={123}
                userName={'Quan'}
            />
        </div>
    );
}

export default App;
