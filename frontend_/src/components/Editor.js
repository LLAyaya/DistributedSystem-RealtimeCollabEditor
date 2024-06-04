import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
// import { decodeAction } from 'next/dist/server/app-render/entry-base'

const Editor = ({clientControllerRef, roomId, userName}) => {
    const codeMirrorRef = useRef(null)

    useEffect(() => {
        const init = async () => {
            const codeMirror = CodeMirror(codeMirrorRef.current, {
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                readOnly: false,
            })
    
            // codeMirror.setValue('// Testing, testing. Things just got more interesting')
    
            codeMirror.on('change', (instance, changes) => {
                const {origin} = changes
                const content = instance.getValue()
                
                // onCodeChange(content)
    
                if (origin !== 'setValue') {
                    clientControllerRef.current.editContent(roomId, userName, 'update', content)
                }
            })
        }
        init()
        

        return () => {
            // codeMirror.toTextArea()
        }
    }, [])
    


    return (
        <div>
            <div ref={codeMirrorRef} style={{ height: '300px' }} />
        </div>
    )
}

export default Editor