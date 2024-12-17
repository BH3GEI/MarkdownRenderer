module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 禁用 html2pdf.js 的 source map
      webpackConfig.module.rules.push({
        test: /[\\/]html2pdf\.js[\\/]/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/
      });
      
      // 忽略 source-map-loader 的警告
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];
      
      return webpackConfig;
    },
  },
};
