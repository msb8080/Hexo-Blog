# 博客工具使用手册（落地版）

## 1. 这套工具包含什么

- 流程总览文档：`docs/BLOG_WORKFLOW.md`
- 自动化脚本：`bin/blog-flow.sh`
- 本地 Skill：`skills/blog-ops-fastlane/SKILL.md`
- 写作模板：`scaffolds/post.md`
- 草稿模板：`scaffolds/draft.md`

## 2. 前置准备

在项目根目录执行：

```bash
npm install
```

确认命令可用：

```bash
node -v
npm -v
rg --version
```

如果 `rg` 不存在：

- macOS: `brew install ripgrep`

## 3. 日常使用（最短路径）

### 3.1 新写一篇正式文章

```bash
npx hexo new post "文章标题"
```

填写 `scaffolds/post.md` 结构后，执行：

```bash
./bin/blog-flow.sh check
./bin/blog-flow.sh preview
./bin/blog-flow.sh release
```

### 3.2 写季度复盘草稿

```bash
npx hexo new draft "2026Q2-博客复盘"
```

按 `scaffolds/draft.md` 写完后：

```bash
npx hexo publish "2026Q2-博客复盘"
./bin/blog-flow.sh check
./bin/blog-flow.sh preview
./bin/blog-flow.sh release
```

## 4. 三个自动化命令说明

### `check`

```bash
./bin/blog-flow.sh check
```

会自动执行：

1. 检查 `npm`、`rg` 是否安装。
2. 检查关键文件写权限（`public/`、`db.json`）。
3. 检查最新文章 Front Matter 是否包含：
   - `title`
   - `date`
   - `updated`
   - `tags`
   - `categories`
4. 执行 `npm run clean`。
5. 执行 `npm run build`。

### `preview`

```bash
./bin/blog-flow.sh preview
```

启动本地预览服务：`http://localhost:4000`

### `release`

```bash
./bin/blog-flow.sh release
```

执行发布流水线：`clean -> build -> deploy`

## 5. Skill 怎么用

Skill 文件位置：`skills/blog-ops-fastlane/SKILL.md`

建议规则：

1. 发版前优先跑 `check`，再跑 `preview`。
2. 检查通过后再执行 `release`。
3. 模板更新后，同步更新 Skill 说明。

## 6. 常见问题

### 6.1 权限报错（EACCES / Operation not permitted）

症状：`npm run build` 无法写 `public/` 或 `db.json`。

修复：

```bash
sudo chown -R $(whoami):staff public db.json docs source/_posts source/_drafts bin
```

### 6.2 `check` 失败提示 Front Matter 缺字段

打开最新文章，补全：

- `title`
- `date`
- `updated`
- `tags`
- `categories`

再重跑：

```bash
./bin/blog-flow.sh check
```

### 6.3 线上没更新

排查顺序：

1. `./bin/blog-flow.sh release` 是否成功。
2. 部署仓库和分支是否正确。
3. 托管平台构建日志是否报错。

## 7. 团队/长期维护建议

1. 将 `check` 作为发布门禁。
2. 每次文章更新都改 `updated`。
3. 每季度至少产出一次复盘文。
4. 模板改动后更新以下文档：
   - `docs/BLOG_WRITING_TEMPLATE.md`
   - `docs/BLOG_WORKFLOW.md`
   - `docs/BLOG_TOOLS_USAGE.md`

## 8. 一句话执行清单

```bash
npx hexo new post "标题" && ./bin/blog-flow.sh check && ./bin/blog-flow.sh preview && ./bin/blog-flow.sh release
```
