import { Editor } from '@monaco-editor/react';

export default function CodeEditor() {
  return (
    <Editor
      height='100vh'
      theme='vs-dark'
      defaultLanguage='javascript'
      defaultValue='// some comment'
    />
  );
}
