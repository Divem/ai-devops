## Why

当前看板页 AI 评审抽屉默认打开“评审报告”Tab，但用户在进入抽屉后的首要诉求通常是先核对“原始需求”上下文。将默认 Tab 调整为“原始需求”可减少一次点击并提升澄清效率。

## What Changes

- 将 `DetailDrawer` 的默认激活 Tab 从“评审报告”改为“原始需求”。
- 保持双 Tab 结构与现有切换行为不变，用户仍可手动切换至“评审报告”。
- 保持“原始需求为空时展示 PRD 摘录示例”逻辑不变，仅调整首次打开时的默认落点。
- 补充验收点：打开抽屉后首屏即展示原始需求内容与基础信息区。

## Capabilities

### New Capabilities
- （无）

### Modified Capabilities
- `review-drawer-tabs`: 修改评审抽屉默认 Tab 行为，从默认“评审报告”调整为默认“原始需求”。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（`DetailDrawer` 内 tab 初始 state 与相关展示文案）。
- 受影响范围：仅前端交互默认值，无数据模型与 API 变更。
- 风险：低，需要回归确认首屏展示与 tab 切换行为保持一致。
