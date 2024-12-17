import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(2),
  maxWidth: '300px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(45, 45, 45, 0.9)' 
    : 'rgba(255, 255, 255, 0.9)',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
  zIndex: 1000,
  userSelect: 'none',  // 禁用文本选择
}));

const MessageText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 4,
  top: 4,
  padding: 4,
  '&:hover': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)',
  },
}));

const AdBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showAd, setShowAd] = useState(false);
  const messages = [
    { text: "点我看看广告，求你了，我需要钱 (｡◕‿◕｡)", lang: "cn" },
    { text: "Please click me to see the ad, I need money", lang: "en" },
    { text: "広告を見てください、お金が必要です", lang: "jp" },
    { text: "광고를 봐주세요, 돈이 필요해요", lang: "kr" },
    { text: "Пожалуйста, посмотрите рекламу, мне нужны деньги", lang: "ru" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    // 初始化 AdSense
    if (showAd) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }

    return () => clearInterval(timer);
  }, [showAd]);

  const handleClick = (e) => {
    if (e.target.closest('.close-button')) {
      return;
    }
    console.log('Ad banner clicked');
    setShowAd(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <StyledPaper elevation={3} onClick={handleClick}>
      <CloseButton 
        className="close-button"
        size="small" 
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        aria-label="close"
      >
        <CloseIcon fontSize="small" />
      </CloseButton>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pr: 3 }}>
        {!showAd ? (
          // 显示轮播消息
          messages.map((msg, index) => (
            <MessageText
              key={msg.lang}
              variant="body2"
              sx={{
                opacity: index === currentIndex ? 1 : 0.3,
                transition: 'opacity 0.3s ease',
              }}
            >
              {msg.text}
            </MessageText>
          ))
        ) : (
          // 广告容器
          <Box sx={{ 
            width: '250px', 
            height: '200px', 
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
            {/* AdSense 广告容器 */}
            <ins className="adsbygoogle"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
              }}
              data-ad-client="ca-pub-9131146702581512"
              data-ad-slot="AUTO"
              data-ad-format="auto"
              data-full-width-responsive="true">
            </ins>
            {/* 开发环境下的占位内容 */}
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}>
                <Typography variant="body2" color="text.secondary">
                  AD TEST
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </StyledPaper>
  );
};

export default AdBanner;
