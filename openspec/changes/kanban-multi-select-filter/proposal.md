## Why

当前需求看板页面缺乏筛选功能，当需求卡片数量增多时，产品经理难以快速定位特定空间和迭代的需求。Meego 同步的需求包含空间和迭代信息，但看板无法按这些维度进行过滤，降低了工作效率。

## What Changes

- **新增**：看板顶部多选下拉筛选器组件
- **支持**：空间（Space）多选
- **支持**：迭代（Iteration）多选
- **级联选择**：选择空间后，迭代下拉仅显示该空间下的迭代项
- **交互**：支持清除筛选、显示已选筛选条件标签

## Capabilities

### New Capabilities
- `kanban-filter`: 需求看板的多选筛选功能，包括空间和迭代的级联选择

### Modified Capabilities
- 无（此为纯新增功能，不修改现有需求）

## Impact

- **代码修改**：`pm-ai-platform_sdd2.jsx` 中的 `PMPlatform` 组件
- **数据模型**：需为需求卡片添加 `space` 和 `iteration` 字段
- **新组件**：`MultiSelectFilter` 组件（支持级联选择）
- **UI 布局**：看板顶部增加筛选栏，高度增加约 60px
