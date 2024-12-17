import React, { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { Paper } from '@mui/material';

const Editor = ({ value, onChange, darkMode }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    });

    const view = new EditorView({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        startState,
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
          '.cm-content': { 
            fontFamily: 'monospace',
            fontSize: '14px',
          },
          '&.cm-editor': {
            backgroundColor: darkMode ? '#121212' : '#ffffff',
            color: darkMode ? '#e0e0e0' : '#000000',
          },
          '.cm-gutters': {
            backgroundColor: darkMode ? '#1e1e1e' : '#f5f5f5',
            color: darkMode ? '#858585' : '#6e7781',
            border: 'none',
          },
          '.cm-activeLineGutter': {
            backgroundColor: darkMode ? '#2c313a' : '#e6e6e6',
          },
          '.cm-line': {
            padding: '0 4px',
          },
        }),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [darkMode]);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value
        }
      });
    }
  }, [value]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '50%',
        height: '100%',
        overflow: 'hidden',
        bgcolor: darkMode ? '#1e1e1e' : '#ffffff'
      }}
    >
      <div 
        ref={editorRef} 
        style={{ 
          height: '100%',
          overflow: 'auto'
        }} 
      />
    </Paper>
  );
};

export default Editor;
