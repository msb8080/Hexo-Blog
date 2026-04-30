# Hexo-Blog 架构文档

## 1. 项目定位
本项目是一个基于 Hexo 的静态博客站点工程，使用 `source/` 作为内容源目录，`public/` 作为构建产物目录，并通过 Git 部署到 GitHub Pages 仓库 `msb8080/msb8080.github.io`。

## 2. 技术栈
- 运行时：Node.js `22.x`（见 `.nvmrc` 与 `package.json#engines`）
- 静态站点生成器：Hexo `7.3.0`
- 主题：`fluid`（通过 `npm` 依赖 `hexo-theme-fluid` 管理，避免本地空主题目录风险）
- 部署插件：`hexo-deployer-git`
- 常用插件：
  - `hexo-generator-archive/category/tag/index`
  - `hexo-generator-feed`
  - `hexo-generator-sitemap`
  - `hexo-browsersync`

## 3. 目录结构与职责
- `source/`：站点内容源（文章、页面、资源）
- `scaffolds/`：新建文章/页面模板
- `themes/`：主题覆盖目录（当前不存放主题源码，主题由 `node_modules/hexo-theme-fluid` 提供）
- `public/`：静态构建输出目录（可直接部署）
- `.deploy_git/`：Hexo deploy 生成的部署临时 Git 工作目录
- `_config.yml`：全站主配置
- `db.json`：Hexo 内容数据库缓存
- `.github/dependabot.yml`：依赖更新策略（npm 每日扫描）

## 4. 构建与发布流程
### 4.1 本地开发流程
1. 安装依赖：`npm install`
2. 清理缓存：`npm run clean`
3. 本地预览：`npm run server`
4. 构建产物：`npm run build`

### 4.2 线上部署流程
1. 执行 `npm run deploy`。
2. Hexo 将 `public/` 内容推送到 `_config.yml` 中 `deploy.repository` 指定仓库分支（当前为 `master`）。
3. GitHub Pages 从该仓库分支发布。

## 5. 配置要点（来自当前仓库）
- 站点基础信息：`title = 闵帅博的个人博客`
- 永久链接：`/:year/:month/:day/:title/`
- 主题：`theme: fluid`
- 部署：
  - `type: git`
  - `repository: git@github.com:msb8080/msb8080.github.io.git`
  - `branch: master`
- 域名：`url: https://msb8080.github.io`

## 6. 当前架构风险与影响
1. **运行环境一致性**：已通过 `.nvmrc` + `engines` 约束 Node/npm 版本，但团队协作仍需统一启用 nvm。
2. **部署凭据耦合**：`hexo deploy` 依赖本机 SSH 凭据与 `known_hosts`，新机器首次部署需初始化 SSH 信任。
3. **仓库中保留 `public/` 与 `db.json`**：适合“产物直出”场景，但会增加合并噪音与仓库体积。

## 7. 建议改进
1. 增加 CI（GitHub Actions）自动构建与部署，减少本机 SSH 环境差异导致的发布失败。
2. 为新成员补充 SSH 初始化步骤（`ssh -T git@github.com`、`known_hosts` 处理）。
3. 对 `public/` 是否入库做长期策略决策（保留产物直出 vs CI 发布产物）。

## 8. 架构结论
当前项目是“Hexo 内容工程 + GitHub Pages（SSH）发布链路”的标准静态博客架构，且已完成主题可追溯化、依赖可复现化、域名配置修复三项基础治理，具备稳定迭代能力。
