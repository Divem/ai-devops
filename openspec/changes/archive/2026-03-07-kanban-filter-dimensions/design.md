## Context

看板过滤栏（`FilterBar` 组件）目前仅有"空间"和"迭代"两个多选维度，可选值从卡片数据中动态提取。由于 INITIAL_CARDS 中大多数卡片无 `space`/`iteration` 字段，过滤栏实际上是空的。本次变更在两个维度之间插入「子系统」和「应用」两个维度，并为所有四个维度提供预设静态数据。

## Goals / Non-Goals

**Goals:**
- 定义四个维度的预设常量：`KANBAN_SPACES`、`KANBAN_SUBSYSTEMS`、`KANBAN_APPS`、`KANBAN_ITERATIONS`
- `FilterBar` 支持四维筛选 UI（顺序：空间 → 子系统 → 应用 → 迭代）
- 子系统选择后联动过滤应用选项；空间选择后联动过滤迭代（现有逻辑保留）
- `filteredCards` 四维 AND 逻辑过滤
- localStorage 字段扩展（向后兼容，缺少字段时默认 `[]`）

**Non-Goals:**
- 不引入后端接口，所有数据为前端静态常量
- 不改变卡片数据结构（`subsystem`/`app` 字段为可选）
- 不改变 tag 显示行的排列方式（四类颜色各异的 badge 依次追加）

## Decisions

**D1 — 预设迭代生成策略**

从当前日期（2026-03-07）向前推 3 个月，每半月一个迭代，共 6 条，格式为 `迭代-YYYYMMDD`（每月 1 日和 15 日为迭代起始点）：
```
迭代-20260301, 迭代-20260215, 迭代-20260201,
迭代-20260115, 迭代-20260101, 迭代-20251215
```
以静态数组硬编码在常量中，不做动态计算。

**D2 — 子系统/应用联动**

`availableApps` 由 `selectedSubsystems` 决定：若未选子系统，展示全部应用；若已选，只展示对应子系统下的应用。关系以 `KANBAN_APPS` 对象表示（key = 子系统名，value = 应用数组）：
```js
const KANBAN_APPS = {
  '消费金融': ['马上消费 App', '白条', '风控平台'],
  '企业服务': ['金得助', '供应链', '报表中心'],
  '云平台': ['枭龙云控制台', '枭龙云 API', '云监控'],
  '集团中台': ['统一认证', '消息中心', '数据湖'],
};
```

**D3 — FilterBar props 扩展**

新增 4 个 props：
- `availableSubsystems`, `selectedSubsystems`, `onSubsystemToggle`
- `subsystemDropdownOpen`, `onSubsystemDropdownOpen`
- `availableApps`, `selectedApps`, `onAppToggle`
- `appDropdownOpen`, `onAppDropdownOpen`

同时新增对应 tag 颜色：子系统用 purple，应用用 warn。

**D4 — dropdown 互斥关闭**

四个 dropdown 中任一打开时其余三个关闭，统一由各自 `onXxxDropdownOpen` 回调传入 `false` 实现。

## Risks / Trade-offs

- **卡片字段稀疏**：现有卡片多数无 `subsystem`/`app` 字段，四维 AND 过滤会导致选了子系统/应用后结果为空 → 可接受，后续添加样本数据时补全字段
- **静态迭代过时**：6 个月后迭代列表需手动更新 → 低优先级，可在后续变更中引入动态生成
