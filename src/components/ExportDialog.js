import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '10px',
    background: theme.palette.mode === 'dark' 
      ? 'rgba(45, 45, 45, 0.95)' 
      : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const deviceWidths = {
  desktop: '1200px',
  tablet: '768px',
  wechat: '375px',
  mobile: '320px',
};

const waitForImages = async (element) => {
  const images = element.getElementsByTagName('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  await Promise.all(imagePromises);
};

const waitForStyles = () => {
  return new Promise(resolve => {
    const styleSheets = Array.from(document.styleSheets);
    if (styleSheets.every(sheet => !sheet.href || sheet.cssRules)) {
      resolve();
    } else {
      setTimeout(resolve, 1000);
    }
  });
};

const ExportDialog = ({ open, onClose, markdown, html }) => {
  const [format, setFormat] = useState('html');
  const [deviceWidth, setDeviceWidth] = useState('desktop');

  const handleExport = async () => {
    let element = null;
    try {
      switch (format) {
        case 'pdf':
          element = document.createElement('div');
          element.innerHTML = html;
          element.style.width = deviceWidths[deviceWidth];
          element.style.padding = '20px';
          element.style.position = 'fixed';
          element.style.top = '0';
          element.style.left = '0';
          element.style.zIndex = '9999';
          element.style.backgroundColor = '#ffffff';
          element.style.visibility = 'visible';
          element.style.opacity = '0';
          
          // Wait for Mermaid diagrams to render
          if (window.mermaid) {
            await new Promise(resolve => {
              window.mermaid.init(undefined, element.getElementsByClassName('mermaid'));
              setTimeout(resolve, 2000); // Give some time for rendering
            });
          }
          
          // Add styling for PDF export
          const style = document.createElement('style');
          style.textContent = `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: ${document.body.style.color || '#000000'};
              background-color: ${document.body.style.backgroundColor || '#ffffff'};
            }
            pre { 
              background-color: #f6f8fa; 
              padding: 16px; 
              border-radius: 6px; 
              overflow-x: auto;
              margin: 1em 0;
            }
            code { 
              font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
              font-size: 14px;
            }
            .token.comment { color: #6a737d; }
            .token.keyword { color: #d73a49; }
            .token.string { color: #032f62; }
            .token.number { color: #005cc5; }
            .token.operator { color: #d73a49; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f6f8fa; }
            img { max-width: 100%; height: auto; }
            .math { max-width: 100%; overflow-x: auto; }
            .mermaid { background: transparent !important; }
            svg.mermaid { max-width: 100%; }
          `;
          element.appendChild(style);
          document.body.appendChild(element);
          
          // Re-run Prism highlighting
          if (window.Prism) {
            element.querySelectorAll('pre code').forEach((block) => {
              Prism.highlightElement(block);
            });
          }
          
          const opt = {
            margin: 10,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              logging: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              removeContainer: true,
              windowWidth: parseInt(deviceWidths[deviceWidth].replace('px', '')),
              onclone: function(clonedDoc) {
                const clonedElement = clonedDoc.querySelector('.preview');
                if (clonedElement) {
                  clonedElement.style.visibility = 'visible';
                  clonedElement.style.opacity = '1';
                }
                return new Promise(resolve => {
                  setTimeout(() => {
                    if (window.Prism) {
                      clonedDoc.querySelectorAll('pre code').forEach((block) => {
                        Prism.highlightElement(block);
                      });
                    }
                    resolve();
                  }, 2000);
                });
              }
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
              compress: true
            }
          };
          
          console.log('Starting PDF generation...');
          console.log('Element content:', element.innerHTML);
          console.log('Element dimensions:', {
            width: element.offsetWidth,
            height: element.offsetHeight,
            visible: element.style.visibility,
            display: element.style.display
          });
          await waitForImages(element);
          
          // 在生成 PDF 之前等待样式加载
          await waitForStyles();
          
          try {
            await html2pdf()
              .set(opt)
              .from(element)
              .save()
              .then(() => {
                console.log('PDF generated successfully');
              })
              .catch(error => {
                console.error('PDF generation error:', error);
                throw error;
              });
          } catch (error) {
            console.error('PDF generation failed:', error);
            alert('PDF generation failed. Please try again.');
            throw error;
          }
          break;
          
        case 'md':
          const mdBlob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
          saveAs(mdBlob, 'document.md');
          break;
          
        case 'html':
          const htmlDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${deviceWidths[deviceWidth]}">
  <title>Markdown Export</title>
  <style>
    body {
      max-width: ${deviceWidths[deviceWidth]};
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
          const htmlBlob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
          saveAs(htmlBlob, 'document.html');
          break;
      }
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      // 确保清理临时元素
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Export Document</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={format}
              label="Format"
              onChange={(e) => setFormat(e.target.value)}
            >
              <MenuItem value="md">Markdown</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Device Width</InputLabel>
            <Select
              value={deviceWidth}
              label="Device Width"
              onChange={(e) => setDeviceWidth(e.target.value)}
            >
              <MenuItem value="desktop">Desktop (1200px)</MenuItem>
              <MenuItem value="tablet">Tablet (768px)</MenuItem>
              <MenuItem value="wechat">WeChat Mini Program (375px)</MenuItem>
              <MenuItem value="mobile">Mobile (320px)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleExport} variant="contained" color="primary">
          Export
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ExportDialog;
