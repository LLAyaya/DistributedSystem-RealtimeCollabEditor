import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
// import { decodeAction } from 'next/dist/server/app-render/entry-base'

const Editor = ({clientControllerRef, roomsDetail, selectedRoomDetail, userName, onRoomContentSync}) => {
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

        if (selectedRoomDetail) {
            codeMirrorRef.current.setValue(selectedRoomDetail.content)

            codeMirrorRef.current.on('change', (instance, changes) => {
                const {origin} = changes
                const content = instance.getValue()

                if (origin !== 'setValue') {
                    clientControllerRef.current.editContent(selectedRoomDetail.roomId, userName, 'update', content)
                    cursorRef.current = codeMirrorRef.current.getCursor()
                }
            })
        }
        else {
            codeMirrorRef.current.setValue('Choose a room and start editing\nAlternatively, join or create a room to get started')
        }  

    }, [clientControllerRef, onRoomContentSync, selectedRoomDetail, userName])
    
    useEffect(() => {
        if (selectedRoomDetail) {
            codeMirrorRef.current.setValue(selectedRoomDetail.content)
            codeMirrorRef.current.setCursor(cursorRef.current)
        }
    }, [selectedRoomDetail])

    return (
        <textarea id="realtimeEditor"></textarea>
    );
}

export default Editor