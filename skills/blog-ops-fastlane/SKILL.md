# blog-ops-fastlane

## Purpose

Provide a fast, repeatable workflow to validate and execute a Hexo blog release.

## Use this skill when

- You need a quick pre-release validation.
- You want one-command preview or release.
- You need consistent execution for long-term maintenance.

## Commands

- Check pipeline: `./bin/blog-flow.sh check`
- Local preview: `./bin/blog-flow.sh preview`
- Release pipeline: `./bin/blog-flow.sh release`

## What `check` validates

1. Required tools (`npm`, `rg`) are installed.
2. Latest post contains required Front Matter fields:
   - `title`
   - `date`
   - `updated`
   - `tags`
   - `categories`
3. `npm run clean` succeeds.
4. `npm run build` succeeds.

## Failure handling

- Permission errors on `public/` or `db.json`:
  - Fix ownership locally, then rerun `check`.
- Build errors:
  - Check `_config.yml`, theme config, and dependency state.

## Long-term maintenance rule

- Always run `check` before `release`.
- Keep templates updated in:
  - `scaffolds/post.md`
  - `scaffolds/draft.md`
  - `docs/BLOG_WRITING_TEMPLATE.md`
