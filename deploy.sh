#!/bin/bash

# 编译React项目
npm run build

# 确保docs目录存在
mkdir -p docs

# 清空docs目录
rm -rf docs/*

# 复制build目录的内容到docs目录
cp -r build/* docs/

# 添加所有更改到git
git add docs/

