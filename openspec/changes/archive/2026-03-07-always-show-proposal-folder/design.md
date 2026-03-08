## Context

`DocTreeSidebar` 中 proposals 的渲染逻辑目前有两个分支（`line 2309` 附近）：

```javascript
const multiProposal = proposals.length >= 2;
...
{multiProposal ? (
  /* 多提案：文件夹模式 */
  proposals.map(p => <ProposalFolder key={p.id} ... />)
) : proposals.length === 1 ? (
  /* 单提案：平铺模式（向后兼容） */
  PROPOSAL_DOC_TYPES.map(dt => <TreeItem ... />)
) : null}
```

`ProposalFolder` 组件已经完整实现，支持任意单个提案的展开/收起和文档项列表。

## Goals / Non-Goals

**Goals:**
- 单提案时也渲染 `ProposalFolder`，与多提案体验完全一致

**Non-Goals:**
- 不修改 `ProposalFolder` 组件本身
- 不改变 proposals 数量为 0 时的显示（不渲染任何内容）
- 不修改 PRD 项的渲染逻辑

## Decisions

### 直接简化条件分支

删除 `multiProposal` 变量和单提案平铺分支，统一为：

```javascript
{proposals.length > 0 && (
  <div>
    <div style={{...}}>OpenSpec 提案</div>
    {proposals.map(p => (
      <ProposalFolder key={p.id} cardId={card.id} proposal={p} indent={1} />
    ))}
  </div>
)}
```

同时删除不再需要的 `multiProposal` 常量声明。

## Risks / Trade-offs

- [UI 变化] 原来单提案平铺 4 个文档项，现在变成 1 个可展开文件夹 → 这正是预期的效果，不是 regression
- [无其他风险] 逻辑只涉及渲染分支，不影响数据读写
