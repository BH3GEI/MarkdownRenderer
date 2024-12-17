import React, { useEffect, useRef } from 'react';
import { Paper } from '@mui/material';
import * as echarts from 'echarts';
import 'katex/dist/katex.min.css';

const Preview = ({ html }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    const initPreview = async () => {
      // 等待一小段时间确保 DOM 已经渲染
      await new Promise(resolve => setTimeout(resolve, 100));

      // 初始化 KaTeX 自动渲染
      if (window.renderMathInElement && previewRef.current) {
        try {
          window.renderMathInElement(previewRef.current, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false,
            output: 'html',
            strict: false,
            trust: true,
            macros: {
              "\\eqref": "\\href{###1}{(\\text{#1})}",
              "\\ref": "\\href{###1}{\\text{#1}}",
              "\\label": "\\htmlId{#1}{}"
            }
          });
        } catch (error) {
          console.error('KaTeX 渲染错误:', error);
        }
      }

      // 初始化 Mermaid
      if (window.mermaid) {
        try {
          await window.mermaid.run({
            nodes: previewRef.current.getElementsByClassName('mermaid')
          });
        } catch (error) {
          console.error('Mermaid 渲染错误:', error);
        }
      }

      // 初始化 ECharts
      const echartsElements = previewRef.current.getElementsByClassName('echarts');
      Array.from(echartsElements).forEach(element => {
        try {
          const options = JSON.parse(element.textContent);
          element.style.width = '100%';
          element.style.height = '400px';
          const chart = echarts.init(element);
          chart.setOption(options);
        } catch (error) {
          console.error('ECharts 渲染错误:', error);
        }
      });
    };

    if (previewRef.current) {
      initPreview();
    }

    return () => {
      if (previewRef.current) {
        const echartsElements = previewRef.current.getElementsByClassName('echarts');
        Array.from(echartsElements).forEach(element => {
          const chart = echarts.getInstanceByDom(element);
          if (chart) {
            chart.dispose();
          }
        });
      }
    };
  }, [html]);

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
        ref={previewRef}
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
