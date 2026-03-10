## Why

当前“功能演示”入口位于 PRD 非空状态的头部操作区，不符合“先引导、后生成”的使用直觉，且用户在 PRD 空状态下最需要澄清指引。将入口迁移到空状态“生成提案（请先生成 PRD）”按钮下方，可在最关键时机提供低干扰引导。

## What Changes

- 将“功能演示”入口从 PRD 头部操作区迁移到 PRD 空状态区域。
- 新入口位置放在禁用按钮“生成提案（请先生成 PRD）”下方，保持小字样式。
- 点击“功能演示”后继续打开需求澄清交互式弹框，交互逻辑保持不变。
- PRD 非空状态下不再展示“功能演示”入口，避免头部拥挤。

## Capabilities

### New Capabilities
- 无

### Modified Capabilities
- `prd-proposal-workflow`: 调整“功能演示”入口展示位置与显示条件（从 PRD 非空头部迁移到 PRD 空状态区）。
- `clarification-drawer-prd-example`: 保持由 PRD 入口触发澄清弹框能力，但入口场景更新为空状态区域触发。

## Impact

- 受影响代码：`pm-ai-app/src/PMPlatform.jsx`（`DocEditor` 中 PRD 头部/空状态渲染逻辑）。
- 受影响交互：PRD 空状态下更容易触达需求澄清演示；非空状态界面更简洁。
- 外部依赖：无新增 API、无数据结构变更。
