## Why

项目目录中存在多个遗留问题：
1. `openspec/changes/` 下有多个已实施但未归档的变更（`add-requirement-link-to-sdd2-subtitle`、`add-project-settings-page`、`rename-product-to-agentic-devops`、`sdd-add-spec-page-example`）
2. 存在空目录 `openspec/changes/add-demo-data-fallback-for-429/`（历史遗留）
3. 项目根目录有 4 个 `.bak`/`.backup` 文件（`pm-ai-platform_sdd.jsx.backup`、`pm-ai-platform_sdd.jsx.bak`、`pm-ai-platform_sdd2.jsx.bak`、`pm-ai-platform_vibe.jsx.bak`）
4. `INITIAL_CARDS` 示例数据中没有一张卡片展示多提案文件夹结构（每张卡片最多只有 1 个提案），无法演示 `doc-tree-proposal-folders` 已实现的多提案 UI

## What Changes

- **归档已完成变更**：将 4 个已实施的变更移入 `openspec/changes/archive/`
- **清理遗留文件**：删除空目录和 `.bak`/`.backup` 文件
- **补充多提案示例数据**：在 `INITIAL_CARDS` 中新增或修改一张卡片，使其 `docs.proposals` 包含 2+ 个提案，完整展示文档树的多提案文件夹 UI

## Capabilities

### Modified Capabilities
- `multi-proposal-doc-tree`（已存在）：补充示例数据，使多提案文件夹 UI 在首次打开时即可被演示

## Impact

- **归档操作**：4 个变更目录从 `openspec/changes/` 移到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- **删除文件**：4 个 `.bak`/`.backup` 文件 + 1 个空目录
- **修改文件**：`pm-ai-app/src/PMPlatform.jsx` 中的 `INITIAL_CARDS` 常量
- **无 API 变更**，**无业务逻辑变更**
