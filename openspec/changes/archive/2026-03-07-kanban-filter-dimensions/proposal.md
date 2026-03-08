## Why

看板的空间和迭代筛选目前使用从卡片数据中动态提取的值，缺少预设数据导致筛选栏在初始状态下是空的，也缺少子系统/应用维度的过滤能力，无法按业务线快速定位需求。

## What Changes

- 新增 `KANBAN_SPACES` 常量，预设空间列表：马上消费、中科金得助、枭龙云国内、枭龙云国际、集团
- 新增 `KANBAN_ITERATIONS` 常量，预设近三个月迭代（半月一迭代，格式：迭代-20260307），共 6 条
- 在空间与迭代之间新增「子系统」和「应用」两个多选筛选条件，形成四维过滤：空间 → 子系统 → 应用 → 迭代
- 子系统和应用的可选值预设为固定列表
- 筛选逻辑：子系统联动限制应用选项；空间联动限制迭代选项（现有逻辑保持）
- localStorage 持久化键 `kanban-filter-state` 扩展为包含 subsystem/app 字段
- 已选 tag 行展示四类标签（颜色各异）
- 清除筛选一次清空全部四个维度

## Capabilities

### New Capabilities

- `kanban-filter-dimensions`: 四维筛选（空间、子系统、应用、迭代），含预设数据和联动逻辑

### Modified Capabilities

- `kanban-filter`: 筛选栏新增两个维度，预设数据替代纯动态提取

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：
  - 新增 `KANBAN_SPACES`、`KANBAN_SUBSYSTEMS`、`KANBAN_APPS`、`KANBAN_ITERATIONS` 常量
  - `FilterBar` 组件新增 `subsystem` / `app` 相关 props
  - 根组件 `PMPlatform` 新增 `selectedSubsystems`、`selectedApps` state 及对应 handler
  - `filteredCards` 逻辑扩展为四维过滤
  - localStorage 读写扩展字段
