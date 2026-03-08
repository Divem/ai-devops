## Why

看板页的需求评审抽屉（DetailDrawer）目前将"需求描述/用户故事/验收标准"与"AI 评审报告"混排在同一滚动区，信息密度高、层级不清。同时，需求来源于 Meego，产品经理需要在评审时看到 Meego 中的原始需求全文，并能在平台内直接修改、同步回 Meego，避免来回切换工具。

## What Changes

- `DetailDrawer` 主体区域改为 **双 Tab** 布局：
  - **「原始需求」Tab**：展示 `card.rawRequirement`（Meego 原始需求全文），支持行内编辑与保存，提供"同步到 Meego"按钮（调用 Meego API 或通过 `projectConfig.meego` 配置的 webhook）
  - **「评审报告」Tab**：展示现有内容（需求描述、用户故事、验收标准、AI 评审结果），布局保持不变
- Tab 切换无需重渲整个抽屉
- 原始需求为空时，「原始需求」Tab 显示空态提示"暂无原始需求内容（需求由人工录入）"
- Meego 同步为异步操作，有加载态与成功/失败反馈

## Capabilities

### New Capabilities
- `review-drawer-tabs`: 评审抽屉双 Tab 布局（原始需求 / 评审报告）
- `raw-requirement-meego-sync`: 原始需求编辑与 Meego 同步能力

### Modified Capabilities
- （无 requirement 级别变更，detail-drawer 原有评审报告内容结构不变）

## Impact

- `pm-ai-app/src/PMPlatform.jsx`：`DetailDrawer` 组件重构
- `card` 数据结构新增 `rawRequirement`（已存在于类型定义，部分 sample 卡片已有值）
- `projectConfig` 可选新增 `meego` 字段（`{ apiUrl, token }`），用于 Meego 同步
- 不影响 AI 评审逻辑、DetailPage 或看板拖拽
