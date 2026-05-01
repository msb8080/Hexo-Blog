# Hexo-Blog

AI Composer 技术猿的 Hexo 博客工程仓库。

## 1. 项目目标

- 沉淀 AI 后端、面试总结、投资理财与副业研究的长期内容
- 用可复用流程保证写作、校验、预览、发布稳定执行
- 通过模板化与季度复盘持续迭代内容质量

## 2. 技术栈

- Node.js: `22.x`（见 `.nvmrc`）
- npm: `10.x`（见 `package.json#engines`）
- SSG: `hexo@7.3.0`
- Theme: `hexo-theme-fluid`

## 3. 快速开始

```bash
npm install
npm run clean
npm run build
npm run server
```

本地预览默认地址：`http://localhost:4000`

## 4. 日常写作与发布流程

### 新建文章

```bash
npx hexo new post "文章标题"
```

### 校验、预览、发布

```bash
./bin/blog-flow.sh check
./bin/blog-flow.sh preview
./bin/blog-flow.sh release
```

## 5. 关键目录说明

- `source/_posts/`: 已发布文章
- `source/_drafts/`: 草稿与系列开篇草稿
- `scaffolds/`: 文章/草稿模板
- `docs/`: 架构、流程、写作与复盘文档
- `bin/`: 自动化脚本

## 6. 文档索引

- 架构说明：`docs/ARCHITECTURE.md`
- 流程清单：`docs/BLOG_WORKFLOW.md`
- 工具手册：`docs/BLOG_TOOLS_USAGE.md`
- 写作模板：`docs/BLOG_WRITING_TEMPLATE.md`
- 季度复盘模板：`docs/QUARTERLY_BLOG_REVIEW_TEMPLATE.md`
- 开发日志：`docs/DEVELOPMENT_LOG.md`
- 分析归档：`docs/2026-04-30-项目分析与长期优化建议.md`
- 90 天路线图：`docs/ROADMAP_90_DAYS.md`
- 选题清单：`docs/TOPIC_BACKLOG_Q2_Q3.md`

## 7. 发布前最小检查

- Front Matter 字段完整（`title/date/updated/tags/categories`）
- 命令可复制执行
- 移动端预览正常
- 外链可访问
- `updated` 已更新

## 8. 常见问题

### 权限报错（EACCES / Operation not permitted）

```bash
sudo chown -R $(whoami):staff public db.json docs source/_posts source/_drafts bin
```

### 线上没更新

按顺序排查：

1. `./bin/blog-flow.sh release` 是否成功
2. `_config.yml` 的部署仓库与分支是否正确
3. 托管平台构建日志是否报错
