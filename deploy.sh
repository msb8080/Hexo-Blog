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
# 确保 SSH agent 已加载 GitHub key
eval "$(ssh-agent -s)" >/dev/null 2>&1
ssh-add ~/.ssh/id_github 2>/dev/null
git add -A
git commit -m "deploy: 更新博客 $(date '+%Y-%m-%d %H:%M')" || echo "没有变更"
git push

echo "✅ 完成！访问 https://msb8080.github.io/blog/"
