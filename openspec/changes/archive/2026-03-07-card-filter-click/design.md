## Context

`KanbanCard` 是纯展示组件，通过 `onClick` 回调打开详情页。根组件 `PMPlatform` 持有四个维度的 state 和 handler（`handleSpaceToggle`、`handleSubsystemToggle`、`handleAppToggle`、`handleIterationToggle`）。卡片上目前没有渲染 `space`/`subsystem`/`app`/`iteration` 字段。

## Goals / Non-Goals

**Goals:**
- `KanbanCard` 底部显示有值的维度标签（badge 样式）
- 点击标签触发 `onFilterClick(dimension, value)`，dimension 为 `'space'|'subsystem'|'app'|'iteration'`
- 根组件统一分发给对应 toggle handler

**Non-Goals:**
- 不改变 FilterBar 组件本身
- 不支持从卡片取消已有筛选（点击始终是"添加到筛选"，若已选中则等价于再次 toggle 取消）

## Decisions

**D1 — 单一回调 `onFilterClick(dimension, value)`**

用一个回调代替四个，减少 props 数量。根组件中：
```js
const handleCardFilterClick = useCallback((dimension, value) => {
  if (dimension === 'space') handleSpaceToggle(value);
  else if (dimension === 'subsystem') handleSubsystemToggle(value);
  else if (dimension === 'app') handleAppToggle(value);
  else if (dimension === 'iteration') handleIterationToggle(value);
}, [handleSpaceToggle, handleSubsystemToggle, handleAppToggle, handleIterationToggle]);
```

**D2 — 标签颜色与 FilterBar 一致**

- 空间：`C.accent` / `C.accentLight`（蓝）
- 子系统：`C.purple` / `C.purpleLight`（紫）
- 应用：`C.warn` / `C.warnLight`（橙）
- 迭代：`C.teal` / `C.tealLight`（青）

**D3 — 事件冒泡阻断**

标签的 `onClick` 调用 `e.stopPropagation()` 后再调 `onFilterClick`，防止触发卡片整体的详情页跳转。

**D4 — 标签布局**

在卡片已有内容下方（`👤 author` 行之前）新增一行，仅渲染有值的维度，使用 `gap:4 flexWrap:wrap` 排列。

## Risks / Trade-offs

- **卡片高度增加**：有四个维度值的卡片会稍高 → 可接受，信息密度提升
- **无值字段不渲染**：避免空 badge 占位，简洁优先
