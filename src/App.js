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
import ExportDialog from './components/ExportDialog';
import SaveIcon from '@mui/icons-material/Save';
import mermaid from 'mermaid';

// 导入示例Markdown文件
import exampleMarkdown from './example.md';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [showFloatingWindow, setShowFloatingWindow] = useState(true);
  const [openExport, setOpenExport] = useState(false);

  // 加载示例Markdown文件
  useEffect(() => {
    fetch(exampleMarkdown)
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
      })
      .catch(error => console.error('Error loading example markdown:', error));
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#90caf9', // Lighter blue for dark mode
        dark: '#2196f3', // Original blue for light mode
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#000000',
        secondary: darkMode ? '#a0a0a0' : '#666666',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
  });

  useEffect(() => {
    // 等待 KaTeX 加载完成
    const waitForKaTeX = () => {
      return new Promise((resolve) => {
        if (window.katex) {
          resolve();
        } else {
          const checkKaTeX = setInterval(() => {
            if (window.katex) {
              clearInterval(checkKaTeX);
              resolve();
            }
          }, 100);
        }
      });
    };

    const initializeMarked = async () => {
      await waitForKaTeX();
      
      // 配置 marked 处理器
      marked.setOptions({
        breaks: true,
        highlight: function(code, lang) {
          if (lang === 'mermaid') {
            return `<div class="mermaid" style="background: transparent;">${code}</div>`;
          }
          if (lang === 'echarts') {
            return `<div class="echarts" style="width:100%;min-height:400px;background:transparent;">${code}</div>`;
          }
          return code;
        },
        extensions: [{
          name: 'math',
          level: 'block',
          tokenizer(src) {
            const match = src.match(/^\$\$([\s\S]+?)\$\$/);
            if (match) {
              return {
                type: 'paragraph',
                raw: match[0],
                text: match[0],
                tokens: []
              };
            }
          }
        }]
      });

      try {
        const rendered = marked(markdown);
        setHtml(rendered);
      } catch (error) {
        console.error('渲染 markdown 时出错:', error);
        setHtml('<p>渲染出错</p>');
      }
    };

    initializeMarked();
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        setOpenExport(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: darkMode ? 'dark' : 'default',
      securityLevel: 'loose'
    });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleExportClose = () => {
    setOpenExport(false);
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
            <IconButton
              color="inherit"
              onClick={() => setOpenExport(true)}
              sx={{ ml: 1 }}
              title="Save (Ctrl+S)"
            >
              <SaveIcon />
            </IconButton>
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
        <ExportDialog 
          open={openExport}
          onClose={handleExportClose}
          markdown={markdown}
          html={html}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
