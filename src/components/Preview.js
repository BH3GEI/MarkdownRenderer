import React from 'react';
import { Paper } from '@mui/material';

const Preview = ({ html }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: '50%',
        height: '100%',
        overflow: 'auto',
        padding: 2
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        className="preview"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      />
    </Paper>
  );
};

export default Preview;
