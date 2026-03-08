## Context

`DocTreeSidebar` 接收 `cards` 数组并渲染所有需求的文档树。组件内部没有过滤逻辑。`focusCardId` 已作为 prop 传入（当前打开的需求 ID），卡片的 `col` 字段记录状态（`approved` / `rejected` 为终态）。

## Goals / Non-Goals

**Goals:**
- 在 DocTreeSidebar 内部添加筛选 state，不改变父组件传入的 cards 数组
- 渲染过滤 chip UI，点击切换激活状态
- 根据激活的筛选项，计算 `visibleCards` 并只渲染过滤后的卡片

**Non-Goals:**
- 不持久化筛选状态（刷新后重置为默认，无需 localStorage）
- 不新增卡片字段（"已PR"/"已Lock" 直接映射到现有 `col` 值）
- 不做响应式布局适配

## Decisions

**D1 — 筛选 state 内聚在 DocTreeSidebar 内**

```js
const [filters, setFilters] = useState(new Set()); // 'focus' | 'no-approved' | 'no-locked'
```

激活 chip 即向 Set 中加入对应 filter ID，再次点击移除（toggle）。`visibleCards` 由 `cards` 派生计算。

备选：将 filters 提升到父组件 `DetailPage`。但筛选仅影响文档库展示，无需暴露给外部，内聚更合理。

**D2 — 筛选语义定义**

| chip 文字 | filter ID | 过滤条件 |
|-----------|-----------|---------|
| 仅本需求 | `focus` | 只显示 `card.id === focusCardId` 的卡片 |
| 过滤已PR | `no-approved` | 隐藏 `card.col === 'approved'` 的卡片 |
| 过滤已Lock | `no-locked` | 隐藏 `card.col === 'approved' \|\| card.col === 'rejected'` 的卡片 |

多个 filter 叠加时取交集（AND 逻辑）。

**D3 — Chip UI 放置位置**

放在"文档库"标签行右侧，使用小尺寸 chip（font-size: 10px），激活时使用 `C.accent` 背景 + 白色文字，未激活时使用 `C.sbHover` 背景 + `C.sbMuted` 文字。

布局：`display: flex; align-items: center; justify-content: space-between` 放在 sidebar 顶部 header 行。

## Risks / Trade-offs

- **"仅本需求"与其他 filter 叠加**：叠加后结果是只显示当前需求且满足状态条件，行为符合预期
- **focusCardId 为 null**：`focus` filter 激活时若无 focusCardId，显示所有卡片（降级处理）
