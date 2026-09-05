# AI Composer Blog 架构

## 1. 架构结论

本站已从“Hexo + 固定主题”升级为 Astro 静态内容架构。Markdown 仍是内容源，页面结构、系列导航、搜索、RSS 与 SEO 文件改为站点代码直接管理。生产环境继续使用 GitHub Pages，不引入服务端、数据库或运行时 API。

## 2. 关键设计

- Astro `output: static`：所有页面在构建期生成，线上仅提供静态文件。
- `base: /blog`：资源和站内链接统一适配项目子路径。
- Content Collections：从 `source/_posts/*.md` 加载文章，并用 Zod 校验 Front Matter。
- 稳定 URL：继续使用 `/:year/:month/:day/:filename/`，迁移前后 108 个 `index.html` 路由完全一致。
- 构建期派生：生成分类、标签、年月归档、分页、`search.json`、`atom.xml` 和 Sitemap。
- 零客户端框架：页面主体输出纯 HTML；浏览器脚本只负责主题、导航、搜索、目录和复制操作。

## 3. 目录职责

```text
astro.config.mjs          Astro、域名与 /blog/ 基路径配置
source/_posts/            已发布 Markdown 内容
source/_drafts/           不参与构建的草稿
src/content.config.ts     内容字段约束
src/lib/site.ts           URL、日期、标签与文章工具函数
src/layouts/              HTML 基础布局
src/components/           导航、卡片、搜索与分页组件
src/pages/                静态路由与构建期端点
src/styles/               全站视觉系统
static/                   原样复制的静态文件
dist/                     构建结果
deploy.sh                 /blog/ 范围发布脚本
```

旧 `_config.yml`、`_config.fluid.yml`、`scaffolds/` 与 `source/css|js` 暂时作为迁移回退材料保留，不参与 Astro 构建。稳定运行一段时间后可在独立清理提交中移除。

## 4. 构建链路

1. `npm ci` 安装锁定依赖。
2. `npm run build` 校验内容并生成 `dist/`。
3. `npm run preview` 在 `/blog/` 基路径预览生产产物。
4. `deploy.sh` 检查 Pages 仓库和根首页，使用 `rsync --delete` 只更新 `blog/`。
5. Pages 仓库产生独立提交并推送到 `master`。

源仓库的 GitHub Actions 使用相同的 Node 24 与 `npm ci && npm run build`，再把 `dist/` 发布到外部 Pages 仓库。若 GitHub 账户级 Actions 暂不可用，本地受控发布仍是有效路径。

## 5. 内容模型

必填字段：`title`、`date`、`description`、`tags`、`categories`。`updated`、`keywords`、`series`、`series_title`、`series_order` 可选；`draft: true` 的文章不会输出。

日期按 Markdown 中的东八区壁钟时间解释。路由只取原始年月日，避免 YAML Date 转换导致晚间文章跨日。

## 6. 风险控制

- URL 回归：构建后对比旧 Hexo 和新 Astro 的全部 HTML 路由。
- 发布边界：同步前后校验 Pages 根目录 `index.html` 哈希。
- XSS：搜索结果使用 DOM `textContent` 创建，不把索引内容直接注入 HTML。
- 依赖：只保留 Astro、RSS 和 Sitemap 三个生产依赖，锁文件纳入版本控制。
- 回退：正式发布前保留旧线上产物；若发布异常，可回滚 Pages 仓库的单次部署提交。
