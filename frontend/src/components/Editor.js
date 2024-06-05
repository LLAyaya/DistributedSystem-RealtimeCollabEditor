import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
// import { decodeAction } from 'next/dist/server/app-render/entry-base'

const Editor = ({clientControllerRef, roomDetail, userName, content}) => {
    const cursorRef = useRef({line: 0, ch: 0})
    const codeMirrorRef = useRef(null)

    useEffect(() => {
        codeMirrorRef.current = CodeMirror.fromTextArea(
            document.getElementById('realtimeEditor'), {
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
            readOnly: false,
        })

        if (roomDetail) {
            codeMirrorRef.current.setValue(roomDetail.content)

            codeMirrorRef.current.on('change', (instance, changes) => {
                const {origin} = changes
                const content = instance.getValue()
                
                // console.log(content)
                // onCodeChange(content)

                if (origin !== 'setValue') {
                    clientControllerRef.current.editContent(roomDetail.roomId, userName, 'update', content)
                    cursorRef.current = codeMirrorRef.current.getCursor()
                }
            })

            clientControllerRef.current.onMessageType('editor sync', (data) => {
                if (data.content !== null) {
                    codeMirrorRef.current.setValue(data.content)
                    codeMirrorRef.current.setCursor(cursorRef.current)
                }
            })
        }
        else {
            codeMirrorRef.current.setValue('Select a room to start editing\nAlternatively, join or create a room to get started')
        }
        
    })
    
    return (
        <textarea id="realtimeEditor"></textarea>
    );
}

export default Editor