import './App.css'
import { useRef, useEffect } from 'react'
import Editor from './components/Editor'
import { initClient } from './client'

function App() {
    const clientControllerRef = useRef(null)

    const init = () => {
        clientControllerRef.current = initClient()

        clientControllerRef.current.createRoom(123)
        clientControllerRef.current.joinRoom(123, 'Quan')
        // clientControllerRef.current.onMessageType('editor sync', () => {
        //     console.log('huh')
        // })
    }
    init()
    console.log(clientControllerRef)

    // return () => {
    //     // Terminate the clientController instance in ref
    // }

    useEffect(() => {
        
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
