## Context

项目长期迭代后积累了多项目录/文件遗留问题。本次变更是纯清理性质，不涉及任何业务逻辑或 API 变更，主要目的是让仓库结构与实际状态保持一致。

## Goals / Non-Goals

**Goals:**
- 归档 4 个已实施完毕的 openspec 变更
- 删除无用的 `.bak`/`.backup` 文件和空目录
- 在 `INITIAL_CARDS` 中添加至少一张含 2 个提案的示例卡片，演示多提案文件夹 UI

**Non-Goals:**
- 不修改任何业务逻辑或 AI 集成代码
- 不重构 `INITIAL_CARDS` 的其他字段
- 不触及 `openspec/specs/` 主规格目录

## Decisions

### 归档策略
直接使用 `mv` 将变更目录移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`，日期用今日（2026-03-07）。

对于 tasks.md 中标记了未完成任务但代码中实际已实施的变更（`rename-product-to-agentic-devops`、`sdd-add-spec-page-example`），直接归档——tasks.md 的未完成标记只是文档更新遗漏，不影响代码实际状态。

### 多提案示例卡片
在现有 `INITIAL_CARDS` 中选择 REQ-105（或新增一张），将 `docs.proposals` 扩展为 2 个提案对象，每个提案含完整的 `proposal`/`design`/`spec`/`tasks` 示例内容。这样用户首次打开该卡片详情页时即可看到多文件夹结构。

## Risks / Trade-offs

- [归档有未完成任务的变更] → 遗留的 `- [ ]` 仅是文档标记，代码已落地，风险极低
- [删除 .bak 文件] → 这些是临时备份，原始文件（无后缀）为最新版本，可安全删除

## Migration Plan

1. 归档 4 个变更目录
2. 删除 `.bak`/`.backup` 文件和空目录
3. 修改 `INITIAL_CARDS` 添加多提案示例内容
4. 验证开发服务器正常启动，文档树多提案 UI 可正常展开/收起
