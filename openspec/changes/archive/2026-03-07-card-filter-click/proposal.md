## Why

看板卡片目前不展示空间、子系统、应用、迭代等归属信息，用户无法在看板视图直接感知一张卡片属于哪个维度，也无法快速从卡片触发同维度的筛选。点击筛选是减少操作步骤的关键交互。

## What Changes

- `KanbanCard` 新增底部信息行，展示卡片的 `space`、`subsystem`、`app`、`iteration` 字段（有值才显示）
- 每个字段标签支持点击，触发对应维度的筛选（相当于在 FilterBar 中勾选该值）
- 点击事件阻止冒泡，不触发打开详情页的 `onClick`
- `KanbanCard` 通过新增的 `onFilterClick(dimension, value)` 回调向上传递点击事件
- 根组件 `PMPlatform` 实现 `handleCardFilterClick`，根据 dimension 调用对应的 toggle handler

## Capabilities

### New Capabilities

- `card-filter-click`: 看板卡片维度标签点击触发筛选

### Modified Capabilities

- `kanban-filter-dimensions`: KanbanCard 展示空间/子系统/应用/迭代标签

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：
  - `KanbanCard` 新增 `onFilterClick` prop 和底部信息行
  - 根组件新增 `handleCardFilterClick(dimension, value)` handler，传给 `KanbanCard`
