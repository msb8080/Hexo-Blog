# 博客流程清单

## 日常写作

1. 在 `source/_drafts/` 写草稿。
2. 定稿后移动到 `source/_posts/`，文件名使用稳定、可读的 URL slug。
3. 补全 `title/date/updated/description/tags/categories`。
4. 执行 `./bin/blog-flow.sh check`。
5. 执行 `./bin/blog-flow.sh preview`，访问 `http://localhost:4321/blog/`。
6. 确认页面与链接后执行 `./bin/blog-flow.sh release`。

## 专题系列

同一系列增加以下字段：

```yaml
series: agent-harness
series_title: Agent Harness 工程实践
series_order: 1
```

`series` 保持稳定，`series_order` 从 1 递增，站点会自动生成文章顶部的系列导航。

## 发布门禁

- Front Matter 通过 Content Collections schema 校验。
- `npm run build` 成功。
- 旧文章文件名和 `date` 未意外变化。
- `/blog/` 本地预览无明显排版和站内链接错误。
- Pages 仓库工作区干净，根站首页不在部署范围内。
