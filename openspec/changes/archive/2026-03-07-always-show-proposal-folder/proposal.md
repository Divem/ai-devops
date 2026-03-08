## Why

当前文档树对单提案和多提案采用不同的显示逻辑：
- **多提案（≥2）**：文件夹模式，每个提案有独立文件夹可展开/收起
- **单提案（=1）**：平铺模式，4 个文档项直接显示在需求节点下

这导致体验不一致：大多数需求只有 1 个提案，反而看不到文件夹结构；用户无法直观感知"一个 PRD 可以对应多个 OpenSpec 提案"这一核心设计理念。此外，平铺模式下提案名称也无法显示，难以区分。

## What Changes

- 移除"单提案平铺模式"的特殊逻辑
- **无论 proposals 数量为 1 还是多个，一律使用文件夹模式**（`ProposalFolder` 组件）
- 文件夹标题显示提案名称（`proposal.name`），保持与多提案场景完全一致的交互体验

## Capabilities

### Modified Capabilities
- `multi-proposal-doc-tree`：将"多提案文件夹"升级为"始终文件夹"，单提案也以文件夹形式显示

## Impact

- **修改文件**：`pm-ai-app/src/PMPlatform.jsx` 中 `DocTreeSidebar` 的提案渲染分支
- **无数据结构变更**，**无 API 变更**
- **向后兼容**：仍使用同一 `normalizeDocs()` 和 `ProposalFolder` 组件，只是取消了单提案的平铺分支
