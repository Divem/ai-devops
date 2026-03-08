## Context

当前看板页面（`PMPlatform` 组件）展示所有需求卡片，但不支持筛选。需求卡片数据模型中应包含空间（Space）和迭代（Iteration）信息，来自 Meego 同步。看板采用 React state 管理，使用 C 颜色变量系统的 SDD 设计风格。

## Goals / Non-Goals

**Goals:**
- 实现空间和迭代的多选筛选功能
- 支持级联选择（空间筛选影响迭代选项）
- 保持现有设计风格和用户体验
- 筛选状态持久化到 localStorage

**Non-Goals:**
- 不实现自定义筛选规则保存
- 不实现跨空间的全局筛选
- V1.0 不支持按其他维度（如标签、优先级）筛选

## Decisions

### 1. 组件结构设计
创建独立的 `MultiSelectFilter` 组件，包含：
- 两个独立的多选下拉框（空间、迭代）
- 级联逻辑：选中空间后，迭代下拉仅显示该空间下的迭代
- 已选条件标签展示，可单独移除
- 全部清除按钮

### 2. 数据模型扩展
在 `INITIAL_CARDS` 的每个卡片对象中添加：
- `space: string` - 空间名称
- `iteration: string` - 迭代名称

### 3. 状态管理
在 `PMPlatform` 组件中添加：
- `selectedSpaces: string[]` - 已选空间列表
- `selectedIterations: string[]` - 已选迭代列表
- 筛选后的卡片列表：`filteredCards` 通过 `useMemo` 计算

### 4. 级联逻辑
- 当未选择任何空间时，迭代下拉显示所有迭代
- 当选择空间后，迭代下拉仅显示这些空间下的迭代
- 已选迭代如果其空间被取消选中，则该迭代自动取消

### 5. 样式方案
复用现有的 SDD 设计系统：
- 下拉框使用 `C.border` 边框，`C.cream` 背景
- 选中项使用 `C.accent` 高亮
- 标签使用圆角设计，带 × 关闭按钮

### 6. 本地存储
筛选状态保存到 `localStorage`，键名为 `kanban-filter-state`，包含：
```json
{
  "spaces": ["space1", "space2"],
  "iterations": ["iteration1", "iteration2"]
}
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 筛选后卡片数量为空时的用户体验 | 显示空状态提示，建议清除筛选 |
| 空间和迭代数据来源不明确 | V1.0 使用静态模拟数据，后续对接 Meego API |
| 级联选择逻辑复杂度高 | 编写单元测试覆盖核心逻辑 |

## Open Questions

- OQ-D1：是否需要支持"反向选择"（排除选中空间）？ → V1.0 不支持，仅支持正向筛选
- OQ-D2：筛选条件变更时是否需要确认弹窗？ → V1.0 实时筛选，无需确认
