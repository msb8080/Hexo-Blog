#!/bin/bash
# 博客部署脚本
# 用法: ./deploy.sh

set -e

BLOG_DIR="$HOME/Desktop/ai-workspace/rainbow/Hexo-Blog"
SITE_DIR="$HOME/Desktop/ai-workspace/rainbow/msb8080.github.io"

echo "🔨 构建 Hexo 博客..."
cd "$BLOG_DIR"
export PATH="/usr/local/bin:$PATH"
npm run build

echo "📦 部署到 msb8080.github.io/blog/..."
rm -rf "$SITE_DIR/blog"
cp -r "$SITE_DIR/../Hexo-Blog/public" "$SITE_DIR/blog"

echo "🚀 推送到 GitHub..."
cd "$SITE_DIR"
git add -A
git commit -m "deploy: 更新博客 $(date '+%Y-%m-%d %H:%M')" || echo "没有变更"
git push

echo "✅ 完成！访问 https://msb8080.github.io/blog/"
