## MODIFIED Requirements

### Requirement: single-proposal-display

**Capability:** multi-proposal-doc-tree

无论需求卡片的 `docs.proposals` 数组长度为 1 还是多个，文档树中的提案均以 **文件夹模式** 渲染（使用 `ProposalFolder` 组件），不存在"平铺模式"的特殊分支。

- **proposals.length === 0**：不渲染任何提案区域（保持不变）
- **proposals.length >= 1**：始终渲染 `ProposalFolder` 文件夹，显示"OpenSpec 提案"分组标题
