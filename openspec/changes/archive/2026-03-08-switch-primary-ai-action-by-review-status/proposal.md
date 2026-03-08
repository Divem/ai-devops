## Why

当前看板详情抽屉底部同时存在“AI 智能评审”和“AI 辅助设计”入口，主操作不够聚焦，用户在不同阶段容易误触或犹豫。将主按钮按评审状态动态切换，能让流程指引更清晰，降低操作成本。

## What Changes

- 在看板详情抽屉中根据当前需求是否“已完成评审”动态展示主按钮。
- 未完成评审时，主按钮显示“AI 智能评审”，触发评审流程。
- 已完成评审时，主按钮切换为“AI 辅助设计”，触发设计流程。
- 次要按钮保留状态流转与关闭等能力，不改变现有业务规则。

## Capabilities

### New Capabilities
- `detail-drawer-primary-ai-action`: 定义详情抽屉主 AI 按钮的状态驱动显示与触发行为。

### Modified Capabilities
- `review-drawer-tabs`: 详情抽屉操作区新增“按评审状态切换主按钮”的交互要求。

## Impact

- 前端页面：`pm-ai-app/src/PMPlatform.jsx`（`DetailDrawer` 按钮渲染与点击行为）。
- OpenSpec：新增 `detail-drawer-primary-ai-action` 规格，并扩展 `review-drawer-tabs` 规格。
