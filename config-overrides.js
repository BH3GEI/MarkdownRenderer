module.exports = function override(config, env) {
  // 添加markdown文件加载器
  config.module.rules.push({
    test: /\.md$/,
    type: 'asset/resource',
  });

  return config;
} 