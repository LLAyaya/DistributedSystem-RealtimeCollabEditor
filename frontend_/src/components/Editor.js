import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
// import { decodeAction } from 'next/dist/server/app-render/entry-base'

const Editor = () => {
    const codeMirrorRef = useRef(null)

    useEffect(() => {
        const codeMirror = CodeMirror(codeMirrorRef.current, {
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
            readOnly: false,
        })

        codeMirror.setValue('// Testing, testing. Things just got more interesting')

        return () => {
            codeMirror.toTextArea()
        }
    }, [])
    


    return (
        <div>
            <div ref={codeMirrorRef} style={{ height: '300px' }} />
        </div>
    )
}

export default Editor