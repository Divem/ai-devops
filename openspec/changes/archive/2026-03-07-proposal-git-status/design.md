## Context

`commitCardDocsToGit` 是模块级函数，执行后返回 `[{ path, url }]`。调用方在 `DetailPage` 中通过 `onUpdateDocs` 将文档内容更新到 card 上，但未保存 git 状态。提案数据结构：`{ id, name, proposal, design, spec, tasks }`，无 git 字段。`DocTreeSidebar` 通过 `hasDoc` bool 展示绿点表示文档存在，但无 git 状态区分。

## Goals / Non-Goals

**Goals:**
- 提案数据结构扩展 `gitStatus` 字段，记录各文档的 commit URL
- 提交后通过 `updateCard` 将 gitStatus 持久化到 card state（localStorage 已持久化）
- `DocTreeSidebar` ProposalFolder 显示提案整体提交状态徽标
- `TreeItem` 区分「有文档但未提交」和「已提交」两种绿色状态
- `DocEditor` 顶部显示当前文档的 git 链接（若已提交）

**Non-Goals:**
- 不发起实时 git 状态查询（无 git API polling）
- 不追踪「文档内容修改后是否需要重新提交」（dirty state）
- 不改变提交逻辑，仅在成功后记录状态

## Decisions

**D1 — gitStatus 数据结构**

挂在提案对象上：
```js
proposal.gitStatus = {
  proposal: "https://github.com/.../commit/abc",
  design: "https://github.com/.../commit/abc",
  spec: null,
  tasks: null,
  committedAt: "2026-03-07T10:00:00.000Z",
}
```
key 与 `PROPOSAL_DOC_TYPES` 的 key 对齐，值为 commit URL（null 表示未提交）。

**D2 — 提交后持久化**

`commitCardDocsToGit` 成功后，调用方（DetailPage 中的 handleCommitToGit）已有 `updateCard`，在此处额外构建 gitStatus patch 并更新对应提案：
```js
// 已有结果 results = [{ path, url }, ...]
// 解析 path 确定属于哪个提案、哪种文档类型
// 合并到对应 proposal.gitStatus
```

**D3 — DocTreeSidebar 显示**

- **ProposalFolder 徽标**：`completedDocs` 改为区分 committed（绿色 ✓ 徽标）、有文档未提交（灰色计数）
- **TreeItem `hasDoc` 扩展**：新增 `isCommitted` bool prop，已提交显示绿色 ✓，有文档未提交显示小绿点（现状），无文档不显示

**D4 — DocEditor git 状态行**

在文档内容区顶部，若当前文档有 `gitStatus[docType]` URL，显示：
```
✓ 已提交到 Git  查看 Commit →  [时间]
```
颜色：`C.success`，样式与现有 commitResult banner 一致但更轻量（inline 而非全宽 banner）。

## Risks / Trade-offs

- **path 解析脆弱**：commit path 格式为 `docs/requirements/${reqId}/proposals/${p.id}/${key}.md`，需要精确解析 — 可通过 split('/') 提取，风险低
- **gitStatus 不追踪 dirty**：文档修改后 gitStatus 仍显示旧提交 URL → 可接受，明确 Non-Goal
