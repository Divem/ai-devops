## Why

用户提交提案文档到 Git 后，页面上没有任何持久化标识，每次打开都无法判断哪些提案/文档已经推送到仓库、哪些是本地草稿。需要在提案列表和文档树中显示 Git 状态徽标，让团队清楚当前各文档的提交状态。

## What Changes

- 卡片的 `docs.proposals[]` 中每个提案新增可选字段 `gitStatus`，记录各文档的提交状态（URL、时间戳）
- 提交成功后将 git commit URL 持久化到对应提案的 `gitStatus` 中（通过 `updateCard`）
- `DocTreeSidebar` 中的 `ProposalFolder` 展示提案整体 git 状态徽标（`已提交` / 部分提交）
- `TreeItem`（各子文档）展示该文档是否已提交（绿色 ✓ 替换现有绿点）
- `DocEditor` 顶部工具栏展示当前文档的 git 状态与 commit 链接（可点击跳转）

## Capabilities

### New Capabilities

- `proposal-git-status`: 提案和文档的 Git 提交状态标识

### Modified Capabilities

- `detail-page-doc-editor`: DocEditor 顶部显示 git 状态与 commit 链接

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：
  - 提案数据结构新增 `gitStatus: { proposal?: url, design?: url, spec?: url, tasks?: url, committedAt?: string }`
  - `commitCardDocsToGit` 执行成功后调用 `updateCard` 持久化 gitStatus
  - `DocTreeSidebar` 的 `ProposalFolder` 和 `TreeItem` 展示 git 状态
  - `DocEditor` 顶部新增 git 状态行
