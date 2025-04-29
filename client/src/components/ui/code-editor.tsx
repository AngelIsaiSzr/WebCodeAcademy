import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

type CodeEditorProps = {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
};

export default function CodeEditor({ 
  language, 
  value, 
  onChange, 
  height = "500px" 
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Update value when component changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <Editor
      height={height}
      defaultLanguage={language}
      defaultValue={value}
      theme="vs-dark"
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: '"Fira Code", monospace',
        lineNumbers: 'on',
        roundedSelection: true,
        automaticLayout: true,
        cursorStyle: 'line',
        cursorBlinking: 'blink',
        tabSize: 2,
        wordWrap: 'on',
      }}
    />
  );
}
