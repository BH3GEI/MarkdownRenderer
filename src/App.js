import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { marked } from 'marked';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Editor\n\nStart typing your markdown here...\n\n## Features\n\n- Real-time preview\n- Syntax highlighting\n- Dark mode support\n- GitHub-style markdown');
  const [html, setHtml] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    try {
      const rendered = marked(markdown, { breaks: true });
      setHtml(rendered);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      setHtml('<p>Error rendering markdown</p>');
    }
  }, [markdown]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Markdown Editor
            </Typography>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          gap: 2,
          p: 2,
          overflow: 'hidden'
        }}>
          <Editor 
            value={markdown} 
            onChange={setMarkdown}
            darkMode={darkMode}
          />
          <Preview html={html} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
