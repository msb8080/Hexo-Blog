# 博客流程清单（精简版）

## 统一入口

- 主手册：`docs/BLOG_TOOLS_USAGE.md`
- 自动化脚本：`bin/blog-flow.sh`
- Skill：`skills/blog-ops-fastlane/SKILL.md`

## 日常发布流程

1. 创建文章：`npx hexo new post "文章标题"`
2. 补全模板：`scaffolds/post.md`
3. 校验：`./bin/blog-flow.sh check`
4. 预览：`./bin/blog-flow.sh preview`
5. 发布：`./bin/blog-flow.sh release`

## 季度复盘流程

1. 创建草稿：`npx hexo new draft "2026Qx-博客复盘"`
2. 参考模板：`docs/QUARTERLY_BLOG_REVIEW_TEMPLATE.md`
3. 转正式稿：`npx hexo publish "草稿文件名"`
4. 校验：`./bin/blog-flow.sh check`
5. 预览：`./bin/blog-flow.sh preview`
6. 发布：`./bin/blog-flow.sh release`

## 发布门禁

- Front Matter 必填字段完整（`title/date/updated/tags/categories`）
- `npm run clean` 成功
- `npm run build` 成功
- 本地预览无明显排版/链接错误
