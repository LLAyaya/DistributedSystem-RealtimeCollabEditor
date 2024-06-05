import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
// import { decodeAction } from 'next/dist/server/app-render/entry-base'

const Editor = ({clientControllerRef, roomId, userName}) => {
    const codeMirrorRef = useRef(null)

    useEffect(() => {
        function init () {
            codeMirrorRef.current = CodeMirror.fromTextArea(
                document.getElementById('realtimeEditor'), {
                mode: 'javascript',
                theme: 'material',
                lineNumbers: true,
                readOnly: false,
            })
    
            codeMirrorRef.current.on('change', (instance, changes) => {
                const {origin} = changes
                const content = instance.getValue()
                
                // console.log(content)
                // onCodeChange(content)

                if (origin !== 'setValue') {
                    clientControllerRef.current.editContent(roomId, userName, 'update', content)
                }
            })
        }
        init()

        clientControllerRef.current.onMessageType('editor sync', (data) => {
            if (data.content !== null) {
                codeMirrorRef.current.setValue(data.content)
            }
        })
    })
    
    return (
        <textarea id="realtimeEditor"></textarea>
    );
}

export default Editor