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
import CloseIcon from '@mui/icons-material/Close';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { marked } from 'marked';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [markdown, setMarkdown] = useState('# Welcome to Markdown Editor\n\nStart typing your markdown here...\n\n## Features\n\n- Real-time preview\n- Syntax highlighting\n- Dark mode support\n- GitHub-style markdown');
  const [html, setHtml] = useState('');
  const [showFloatingWindow, setShowFloatingWindow] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // A nice blue color
      },
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

  useEffect(() => {
    // Initialize ads after component mounts
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

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
        {showFloatingWindow && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 200,
              height: 150,
              bgcolor: darkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(240, 240, 240, 0.95)',
              borderRadius: '10px',
              boxShadow: theme.shadows[3],
              border: `1px solid ${theme.palette.divider}`,
              zIndex: 9999,
              overflow: 'hidden',
              transition: 'background-color 0.3s ease',
            }}
          >
            <IconButton
              onClick={() => setShowFloatingWindow(false)}
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                padding: '2px',
                width: '12px',
                height: '12px',
                minWidth: '12px',
                backgroundColor: '#ff5f57',
                '&:hover': {
                  backgroundColor: '#ff5f57',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '8px',
                  color: '#ff5f57',
                  opacity: 0,
                  '&:hover': {
                    opacity: 1,
                  }
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ pt: 2 }}>
              <ins
                className="adsbygoogle"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                }}
                data-ad-client="ca-pub-9131146702581512"
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </Box>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
